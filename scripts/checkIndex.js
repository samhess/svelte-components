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
  'SXGE',
  'SSIRT',
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
  if (['SMI', 'SLI', 'SXGE', 'SSIRT'].includes(indexTicker)) {
    const response = await quoteIndexSix(indexTicker, ['ShortName','ValorSymbol','ISIN','Currency', 'NumberInIssue', 'ClosingPrice'])
    if (Array.isArray(response)) {
      remmoteTitles = response.map(title => ({
        name: title.ShortName,
        isin: title.ISIN,
        ticker: title.ValorSymbol,
        exchangeId: 'XSWX',
        marketCap: normalizeCurrency(title.NumberInIssue * title.ClosingPrice, 'CHF', 'USD'),
        countryCode: title.ISIN.slice(0,2),
        assetclass: 'equity'
      }))
    } else if (response instanceof Error) {
      throw new Error(`Query ${indexTicker} failed: ${response.message}`)
    }
  } 
  else if (['DAX'].includes(indexTicker)) {
    const response = await quoteIndexFwb(indexTicker)
    if (Array.isArray(response)) {
      remmoteTitles = response.map(quote => ({
        isin: quote.isin,
        name: quote.name.originalValue,
        ticker: quote.wkn, 
        exchangeId: 'XETR',
        marketCap: normalizeCurrency(quote.keyData.marketCapitalisation, 'EUR', 'USD'),
        countryCode: quote.isin.slice(0,2),
        assetclass: 'equity'
      }))
    } else if (response instanceof Error) {
      console.log(`Could not get ${indexTicker} titles (${response.message})`)
    }
  }
  else if (['SPX', 'OEX', 'NDX', 'DJI', 'DJGT','DJU', 'SX5E', 'SX5R'].includes(indexTicker)) {
    remmoteTitles = await scrapeIndex(indexTicker)
  } 
  else if (['C20'].includes(indexTicker)) {
    const response = await quoteIndexCmc(1,20)
    if (Array.isArray(response)) {
      remmoteTitles = response.map(quote => ({
        isin: `ZZXOFF${quote.symbol}`,
        name: quote.name,
        ticker: quote.symbol,
        exchangeId: 'XOFF',
        countryCode: 'ZZ', 
        assetclass: 'cryptocurrency',
        marketCap: quote.circulating_supply * quote.quote.USD.price
      }))
    } else if (response instanceof Error) {
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
      const decision = await askUser(`Add ${remmoteTitle.name} (${remmoteTitle.ticker}:${remmoteTitle.exchangeId}) to database and index?`, 'y')
      if (decision)  {
        const {isin,ticker,exchangeId,name,countryCode,assetclass} = remmoteTitle
        instrument = await db.instrument.create({
          data: {isin, ticker, exchangeId,name, countryCode, assetclass}
        })
      } else continue
    }
    position.instrumentId = instrument.isin
    //console.log(`Upserting ${instrument.name} (${instrument.isin}) position (${(100*position.weight).toFixed(2)}%)`)
    await upsertMember(position) 
  }  
}

async function upsertMember({user, ticker, instrumentId, weight}) {
  await db.portfolioToInstrument.upsert({
    where: {ticker_user_instrumentId: {ticker, user, instrumentId}},
    create: {user, ticker, instrumentId, weight},
    update: {weight}
  })
}

async function checkUnnecessary(indexTicker, remmoteTitles) {
  const indexMembers = await getIndexMembers(indexTicker)
  const unnecessaryMembers = indexMembers.filter(member => !remmoteTitles.map(title => title.isin).includes(member.Instrument.isin))
  for (const unnecessaryMember of unnecessaryMembers) {
    const decision = await askUser(`Remove ${unnecessaryMember.Instrument.name} (${unnecessaryMember.Instrument.ticker}:${unnecessaryMember.Instrument.exchangeId}) from ${indexTicker}?`, 'y')
    if (decision)  {
      await db.portfolioToInstrument.delete({
        where:{
          ticker_user_instrumentId: {
            user: 'admin@moontrade.ch',
            ticker: indexTicker, 
            instrumentId: unnecessaryMember.Instrument.isin}
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