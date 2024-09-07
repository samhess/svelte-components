import db from '../src/lib/server/database.js'
import { quoteIndex as quoteIndexSix} from '../src/lib/server/six.js'
import { quoteIndex as quoteIndexFwb } from '../src/lib/server/fwb.js'
import { quoteMany as quoteIndexCmc } from '../src/lib/server/cmc.js'
import { scrapeIndex } from './modules/scrapeIndex.js'
import { normalizeCurrency } from '../src/lib/server/convert.js'
import { askUser } from '../src/lib/server/readline.js'

const ARGS = process.argv.slice(2)
const supportedIndexes = [
  'SMI', 
  'SLI', 
  'SPIX',
  'DAX', 
  'SX5E', 
  'SX5R', 
  'DJI', 
  'DJU', 
  'OEX', 
  'NDX',
  'SPX', 
  'DJGT', 
  'C20'
]

async function getRemoteTitles(indexTicker) {
  let remmoteTitles = []
  if (['SMI', 'SLI', 'SPIX'].includes(indexTicker)) {
    const fields = ['ClosingPrice','ISIN','NumberInIssue','ShortName','SecTypeCode','TradingSegmentId','ValorSymbol']
    const response = await quoteIndexSix(indexTicker, fields)
    if (response instanceof Error === false) {
      if (Array.isArray(response)) {
        remmoteTitles = response
          .map(({ClosingPrice,ISIN,NumberInIssue,ShortName,SecTypeCode,TradingSegmentId,ValorSymbol}) => ({
            assetclass: 'equity',
            country: ISIN.slice(0,2),
            exchange: 'XSWX',
            isin: ISIN,
            marketCap: normalizeCurrency(NumberInIssue * ClosingPrice, 'CHF', 'USD'),
            name: ShortName,
            ticker: ValorSymbol,
            type: 'cash',
            SecTypeCode: SecTypeCode,
            TradingSegmentId: parseInt(TradingSegmentId)
          }))
          .filter(({SecTypeCode,TradingSegmentId}) => {
            return SecTypeCode!=='SW' && TradingSegmentId!==597
          }) // no warrants and no second line
      }
    } else {
      throw new Error(`Query ${indexTicker} failed: ${response.message}`)
    }
  } 
  else if (['DAX'].includes(indexTicker)) {
    const response = await quoteIndexFwb(indexTicker)
    if (!(response instanceof Error)) {
      if (Array.isArray(response)) {
        remmoteTitles = response.map(quote => ({
          assetclass: 'equity',
          country: quote.isin.slice(0,2),
          exchange: 'XETR',
          isin: quote.isin,
          marketCap: normalizeCurrency(quote.keyData.marketCapitalisation, 'EUR', 'USD'),
          name: quote.name.originalValue,
          ticker: quote.wkn, 
          type: 'cash',
        }))
      }
    } else {
      console.log(`Could not get ${indexTicker} titles (${response.message})`)
    }
  }
  else if (['SPX', 'OEX', 'NDX', 'DJI', 'DJGT','DJU', 'SX5E', 'SX5R'].includes(indexTicker)) {
    remmoteTitles = await scrapeIndex(indexTicker)
  } 
  else if (['C20'].includes(indexTicker)) {
    const response = await quoteIndexCmc(1,20)
    if (!(response instanceof Error)) {
      if (Array.isArray(response)) {
        remmoteTitles = response.map(quote => ({
          assetclass: 'cryptocurrency',
          country: 'ZZ', 
          exchange: 'XOFF',
          isin: `ZZXOFF${quote.symbol}`,
          name: quote.name,
          marketCap: quote.circulating_supply * quote.quote.USD.price,
          ticker: quote.symbol,
          type: 'cash'
        }))
      }
    } else {
      console.log(`Could not get ${indexTicker} instruments`)
      throw response
    }
  }
  return remmoteTitles
}

async function getIndexMembers(ticker) {
  const user = 'admin@moontrade.ch'
  return await db.portfolioToInstrument.findMany({
    where: {Portfolio: {user,ticker}},
    include: {Instrument: true}
  })
}

async function updatePositions(indexTicker, remmoteTitles) {
  const marketCap = remmoteTitles.reduce((accumulator, title) => accumulator + title.marketCap, 0)
  for (const remmoteTitle of remmoteTitles) {
    const position = {user:'admin@moontrade.ch', ticker:indexTicker}
    position.weight = remmoteTitle.weight ?? remmoteTitle.marketCap/marketCap
    let instrument = await db.instrument.findUnique({where: {isin:remmoteTitle.isin}})
    if (!instrument) {
      const decision = await askUser(`Add ${remmoteTitle.name} (${remmoteTitle.ticker}:${remmoteTitle.exchange}) ${remmoteTitle.isin} to database and index?`, 'y')
      if (decision)  {
        const {assetclass,country,exchange,isin,name,ticker,type} = remmoteTitle
        instrument = await db.instrument.create({
          data: {assetclass,country,exchange,isin,name,ticker,type}
        })
      } else continue
    }
    position.instrument = instrument.isin
    //console.log(`Upserting ${instrument.name} (${instrument.isin}) position (${(100*position.weight).toFixed(2)}%)`)
    await upsertMember(position) 
  }  
}

async function upsertMember({user, ticker, instrument, weight}) {
  await db.portfolioToInstrument.upsert({
    where: {ticker_user_instrument: {ticker, user, instrument}},
    create: {user, ticker, instrument, weight},
    update: {weight}
  })
}

async function checkUnnecessary(indexTicker, remmoteTitles) {
  const indexMembers = await getIndexMembers(indexTicker)
  const unnecessaryMembers = indexMembers.filter(member => !remmoteTitles.map(title => title.isin).includes(member.Instrument.isin))
  for (const unnecessaryMember of unnecessaryMembers) {
    const decision = await askUser(`Remove ${unnecessaryMember.Instrument.name} (${unnecessaryMember.Instrument.ticker}:${unnecessaryMember.Instrument.exchange}) from ${indexTicker}?`, 'y')
    if (decision)  {
      const result = await db.portfolioToInstrument.delete({
        where: {
          ticker_user_instrument: {
            user: 'admin@moontrade.ch',
            ticker: indexTicker, 
            instrument: unnecessaryMember.Instrument.isin}
          }
        })
      console.log(`Unnecessary instrument ${unnecessaryMember.Instrument.ticker} removed`)
    }
  }
}

// main
const indexes = ARGS.at(0) ? [ARGS.at(0)] : supportedIndexes
for (const indexTicker of indexes) {
  if (supportedIndexes.includes(indexTicker)) {
    const indexMembers = await getIndexMembers(indexTicker)
    const remmoteTitles = await getRemoteTitles(indexTicker)
    console.log(`checking ${indexTicker} (${remmoteTitles.length} of ${indexMembers.length})`)
    await updatePositions(indexTicker, remmoteTitles)
    await checkUnnecessary(indexTicker, remmoteTitles)
  } else {
    console.log(`Index ${indexTicker} not supported`)
    process.exit(1)
  }
}
process.exit(0)