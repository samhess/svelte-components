import { basename } from 'path'
import { load } from 'cheerio'
import { findCompany } from './lookup.js'
import { wikiArticles, exchangeToMic } from './scrapeMaps.js'
import { getYahooTickerSync, quoteMany } from '../../src/lib/server/yahooFinance.js'
import { normalizeCurrency } from '../../src/lib/server/convert.js'
import db from '../../src/lib/server/database.js'

const __filename = basename(import.meta.url)

async function fixMarketCap(instruments) {
  const yahooTickers = instruments.map(item=>item.yahooTicker)
  const quoteResponse = await quoteMany(yahooTickers)
  if (quoteResponse instanceof Error) throw quoteResponse
  else if (Array.isArray(quoteResponse)) {
    for (const instrument of instruments) {
      const quote = quoteResponse.find(quote => instrument.yahooTicker === quote.symbol)
      if (quote) {
        if (quote.marketCap) {
          instrument.marketCap = normalizeCurrency(quote.marketCap, quote.currency, 'USD')
        } else {
          console.log(`${__filename}: ${quote.symbol} has ${quote.marketCap} marketCap, setting to 1`)
          instrument.marketCap = 1
        }
      } else {
        console.log(`${instrument.yahooTicker} quote missing`)
      }
    }
    return instruments
  } 
}

async function findInstrument({ticker, exchangeId}) {
  return exchangeId 
    ? await db.instrument.findUnique({
        where: {ticker_exchangeId: {ticker, exchangeId}},
        include: {Exchange:true}
      })
    : await db.instrument.findFirst({
        where: {ticker, exchangeId: {in: ['XNAS', 'XNYS', 'XCBO']}},
        include: {Exchange:true}
      })
}

async function identifyInstruments(instruments, indexTicker) {
  const cleanInstruments = []
  for (const instrument of instruments) {
    if (indexTicker === 'NDX') instrument.exchangeId = 'XNAS'
    const localInstrument = await findInstrument(instrument)
    if (localInstrument) {
      if (!instrument.exchangeId) {
        instrument.exchangeId = localInstrument.exchangeId
      }
      instrument.isin = localInstrument.isin
      instrument.yahooTicker = getYahooTickerSync(localInstrument)
    } else {
      console.log(instrument)
      throw new Error(`cannot identify ${instrument.ticker}:${instrument.exchangeId}`)
    }
    const {ticker,exchangeId,isin,yahooTicker,weight} = instrument
    cleanInstruments.push({ticker,exchangeId,isin,yahooTicker,weight})
  }
  return cleanInstruments
}

function fixExchangeId({ticker, exchangeId}) {
  if (ticker === 'NOVN') {
    exchangeId = 'XSWX'
  } else if (ticker === 'ABI') {
    exchangeId = 'XBRU'
  } else if (['ADYEN', 'AD', 'ASML', 'INGA', 'PRX'].includes(ticker)) {
    exchangeId = 'XAMS'
  } else if (['SHEL', 'FLTR', 'RIO'].includes(ticker)) {
    exchangeId = 'XLON'
  }
  return exchangeId
}

function getTableData($, tableElement, hasHeaders=true) {
  const rows = $(tableElement).find('tbody > tr')
  const headers = []
  const data = []
  for (const row of rows) {
    const fields = $(row).children('th,td')
    if (fields.length>1) {
      const record = {}
      for (const [index,field] of Array.from(fields).entries()) {
        const value = $(field).text().replace(/^\s+/,'').replace(/\s+$/,'')
        if (hasHeaders && headers.length<fields.length) {
          let name = value.toLowerCase().replace('-','')
          name = name.replace(/(?:\s)(.)/g,(m,g)=>g.toUpperCase())
          headers.push(name)
        } else {
          record[headers[index]] = value
        }
      }
      if (Object.values(record).length) {
        data.push(record)
      }
    } else {
      //console.warn(`${__filename}: skipping table row with ${fields.length} column`)
    }
  }
  return data
}

async function getInstruments(instruments) {

  for (const instrument of instruments) {
    // fix key names
    const synonyms = [
      {name: 'ticker', originalName: 'symbol'},
      {name: 'ticker', originalName: 'mainListing'},
      {name: 'weight', originalName: 'indexWeighting'}
    ]
    for (const synonym of synonyms) {
      const keys = Object.keys(instrument)
      if (keys.includes(synonym.originalName)) {
        instrument[synonym.name] = instrument[synonym.originalName]
        delete instrument[synonym.originalName]
      }
    }

    // fix ticker
    if (instrument.ticker) {
      // multiple tickers
      if (instrument.ticker.includes(';')) {
        const tickers = instrument.ticker.split(/;\s/)
        instrument.ticker = tickers.shift()
        // add second instrument
        const [exchange, ticker] = tickers.shift().split(/:\s/)
        const exchangeId = exchangeToMic.get(exchange.toUpperCase())
        instruments.push({ticker, exchangeId})
      }
      // ticker and exchange combined
      if (instrument.ticker.includes(':')) {
        instrument.ticker = instrument.ticker
          .replace('FB','META')
          .replace('RDSA','SHEL')
          .replace('TOT','TTE')
          .replace(/EI$/,'EL')
          .replace(/DPW$/,'DHL')
          .replace(/STLA$/,'STLAM')
          .replace(/NDA FI$/,'NDA-FI')
        let ticker, exchange
        [exchange, ticker] = instrument.ticker.split(/:\s/)
        instrument.ticker = ticker
        if (exchangeToMic.has(exchange.toUpperCase())) {
          instrument.exchangeId = exchangeToMic.get(exchange.toUpperCase())
        } else {
          instrument.exchangeId = exchange.replace(/.*BIT$/, 'XMIL')
                        .replace(/FWB$/, 'XETR')
                        .replace('BMAD','BMEX')
                        .replace('Nasdaq Helsinki','XHEL')
                        .replace(/^Euronext.*/,'XPAR')  // apply fix below
        }
      } 
    }
    else {
      const localInstrument = await findCompany(instrument.name)
      if (localInstrument) {
        instrument.ticker = localInstrument.ticker
        instrument.exchangeId = localInstrument.exchangeId
      } else {
        throw new Error(`cannot find ${instrument.name} (${instrument.ticker}`)
      }
    }

    // fix exchange
    if (instrument.exchangeId) {
      instrument.exchangeId = fixExchangeId(instrument)
    }
    else if (instrument.exchange) {
      instrument.exchangeId = exchangeToMic.get(instrument.exchange)
    }

    // fix weight
    if (instrument.weight) {
      if (typeof instrument.weight !== 'number') {
        const weight = parseFloat(instrument.weight.replace(/%\s+$/g,''))/100
        instrument.weight = !Number.isNaN(weight) ? weight : 0
      }
    }
  }
  return instruments
}

/**
 * @param {string} indexTicker - ticker symbol of the index
 */
export async function scrapeIndex(indexTicker='DJI') {
  const article = wikiArticles.get(indexTicker)
  const url = `https://${article.lang}.wikipedia.org/wiki/${article.path}`
  const response = await fetch(url)
  if (response.ok) {
    const html = await response.text()
    const $ = load(html, {decodeEntities:false}, false)
    const table = $('table.wikitable').eq(article.table)
    const data = getTableData($,table)
    if (data.length) {
      //console.log(data[0])
      let instruments = await getInstruments(data)
      instruments = await identifyInstruments(instruments,indexTicker)
      instruments = await fixMarketCap(instruments)
      return instruments
    } else {
      throw new Error('scraping failed')
    }
  }
}