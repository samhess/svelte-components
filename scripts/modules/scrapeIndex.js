import { basename } from 'path'
import { load } from 'cheerio'
import { findCompany } from './lookup.js'
import { wikiArticles } from './scrapeMaps.js'
import { getYahooTickerSync, quoteMany } from '../../src/lib/server/yahooFinance.js'
import { normalizeCurrency } from '../../src/lib/server/convert.js'
import db from '../../src/lib/server/database.js'

const __filename = basename(import.meta.url)

async function fixMarketCap(instruments) {
  const yahooTickers = instruments.map(item=>item.yahooTicker)
  const response = await quoteMany(yahooTickers)
  if (response instanceof Error === false) {
    if (Array.isArray(response)) {
      for (const instrument of instruments) {
        const quote = response.find(quote => instrument.yahooTicker === quote.symbol)
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
  } else {
    throw response
  }
}

async function findInstrument({ticker, exchange}) {
  // SPX, OEX, DJU come without exchange info
  return exchange 
    ? await db.instrument.findUnique({
        where: {ticker_exchange: {ticker, exchange}},
        include: {Exchange:true}
      })
    : await db.instrument.findFirst({
        where: {ticker, exchange: {in: ['XNAS', 'XNYS', 'XCBO']}},
        include: {Exchange:true}
      })
}

async function identifyInstruments(instruments, indexTicker) {
  const cleanInstruments = []
  for (const instrument of instruments) {
    if (indexTicker === 'NDX') instrument.exchange = 'XNAS'
    // SPX, OEX, DJU remein without exchange info
    const localInstrument = await findInstrument(instrument)
    if (localInstrument) {
      const yahooTicker = getYahooTickerSync(localInstrument)
      const {weight} = instrument
      const {assetclass,exchange,isin,ticker,type} = localInstrument
      cleanInstruments.push({assetclass,exchange,isin,ticker,type,weight,yahooTicker})
    } else {
      throw new Error(`cannot identify ${instrument.ticker}:${instrument.exchange}`)
    }
  }
  return cleanInstruments
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
        const value = $(field).text().trim()
        if (hasHeaders && headers.length<fields.length) {
          const name = value
            .toLowerCase()
            .replace('-','')
            .replace(/\sin\s\%$/,'')
            .replace(/\s./g,c=>c.trim().toUpperCase())
            .replace(/symbol|mainListing/,'ticker')
            .replace('indexWeighting','weight')
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
    // fix ticker
    if (instrument.ticker) {
      // two instruments, firstly split them
      if (instrument.ticker.includes(';')) {
        const tickers = instrument.ticker.split(/;\s/)
        instrument.ticker = tickers.at(0)
        // hack: add second instrument
        const [exchange, ticker] = tickers.at(1).split(/:\s/)
        instruments.push({ticker, exchange:exchange.replace(/NASDAQ/i, 'XNAS')})
      }
      // ticker and exchange combined (SX5E)
      if (instrument.ticker.includes(':')) {
        instrument.ticker = instrument.ticker
          .replace('FB','META')
          .replace('RDSA','SHEL')
          .replace('TOT','TTE')
          .replace(/EI$/,'EL')
          .replace(/DPW$/,'DHL')
          .replace(/STLA$/,'STLAM')
          .replace(/NDA FI$/,'NDA-FI')
        const [exchange, ticker] = instrument.ticker.split(/:\s/)
        instrument.ticker = ticker
        instrument.exchange = exchange
          .replace(/.*BIT$/, 'XMIL')
          .replace('FWB', 'XETR')
          .replace('BMAD','BMEX')
          .replace('ASX', 'XASX')
          .replace('LSE', 'XLON')
          .replace('NYSE', 'XNYS')
          .replace('SIX', 'XSWX')
          .replace('TSX', 'XTSE')
          .replace('TYO', 'XTKS')
          .replace('Nasdaq Helsinki','XHEL')
          .replace(/NASDAQ/i, 'XNAS')
          .replace(/^Euronext.*$/i,'XPAR')  // apply exchange fix below
        if (ticker === 'NOVN') instrument.exchange = 'XSWX'
        else if (ticker === 'ABI') instrument.exchange = 'XBRU'
        else if (['ADYEN', 'AD', 'ASML', 'INGA', 'PRX'].includes(ticker)) {
          instrument.exchange = 'XAMS'
        } else if (['SHEL', 'FLTR'].includes(ticker)) {
          instrument.exchange = 'XLON'
        }
      } else if (instrument.exchange) {
        instrument.exchange = instrument.exchange
          .replace('NYSE', 'XNYS')
          .replace('NASDAQ', 'XNAS')
      }
    }
    else {
      // no ticker and exchange available (SX5R)}
      if (instrument.name==='Rio Tinto') {
        instrument.ticker = 'RIO'
        instrument.exchange = 'XLON'
      } else {
        const localInstrument = await findCompany(instrument.name)
        if (localInstrument) {
          instrument.ticker = localInstrument.ticker
          instrument.exchange = localInstrument.exchange
        } else {
          throw new Error(`cannot find ${instrument.name} (${instrument.ticker}`)
        }
      }
    }
    // add weight DJI
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
      let instruments = await getInstruments(data)
      instruments = await identifyInstruments(instruments,indexTicker)
      instruments = await fixMarketCap(instruments)
      return instruments
    } else {
      throw new Error('scraping failed')
    }
  }
}