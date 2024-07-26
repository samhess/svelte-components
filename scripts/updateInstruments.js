import { quoteMany, quoteSummary, getYahooTicker, getYahooTickerSync} from '../src/lib/server/yahooFinance.js'
import { quoteMany as quoteManyCmc } from '../src/lib/server/cmc.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const nameToMic = new Map([
  ['XETRA', 'XETR'],
  ['Toronto', 'XTSE'],
  ['Tokyo', 'XTKS'],
  ['Swiss', 'XSWX'],
  ['Shenzhen', 'XSHE'],
  ['Shanghai', 'XSHG'],
  ['Saudi', 'XSAU'],
  ['Paris', 'XPAR'],
  ['NYSE', 'XNYS'],
  ['NYSEArca', 'XNYS'],
  ['NSE', 'XNSE'],
  ['NasdaqGS', 'XNAS'],
  ['NasdaqGM', 'XNAS'],
  ['NasdaqCM', 'XNAS'],
  ['Milan', 'XMIL'],
  ['MCE', 'BMEX'],
  ['LSE', 'XLON'],
  ['KSE', 'XKRX'],
  ['Irish', 'XDUB'],
  ['IOB', 'XLON'],
  ['HKSE', 'XHKG'],
  ['Helsinki', 'XHEL'],
  ['Copenhagen', 'XCSE'],
  ['Cboe US', 'XCBO'],
  ['Brussels', 'XBRU'],
  ['ASX', 'XASX'],
  ['Amsterdam', 'XAMS'],
])

function getMic(exchangeName='') {
  return nameToMic.get(exchangeName)
}

async function getInstruments(assetclass='equity', limit=1000, offset=0) {
  return await prisma.instrument.findMany({
    where: {assetclass},
    include: {Exchange: true},
    skip: offset,
    take: limit
  })
}

async function fixClassification({isin, ticker, name, exchangeId, gicsCode, icbCode}) {
  const yahooTicker = await getYahooTicker({ticker, exchangeId})
  const {result} = await quoteSummary(yahooTicker, ['assetProfile'])
  if (result) {
    const industry = result.at(0).assetProfile.industry
      .replace('Drug Manufacturers—Specialty & Generic', 'Drug Manufacturers—General')
      .replace('Internet Retail', 'Broadline Retail')
      .replace('Discount Stores', 'Broadline Retail')
      .replace('Insurance—Specialty', 'Insurance—Property & Casualty')
      .replace('Pollution & Treatment Controls', 'Waste Management')
      .replace('Resorts & Casinos', 'Lodging')
      .replace('Healthcare Plans', 'Insurance—Life')
      .replace('Confectioners', 'Packaged Foods')
      .replace('Solar', 'Semiconductors')
    const mapping = await prisma.gicsToIcb.findFirst({
      where: {yahooIndustry:industry},
      include: {Gics:true, Icb:true}
    })
    if (mapping) {
      if (!gicsCode) {
        console.log(`  updating GICS code for ${name} (${ticker}) to ${mapping.Gics.name}`)
        await prisma.instrument.update({where: {isin}, data: {gicsCode: mapping.gicsCode}})
      }
      if (!icbCode) {
        console.log(`  updating ICB code for ${name} (${ticker}) to ${mapping.Icb.name}`)
        await prisma.instrument.update({where: {isin}, data: {icbCode: mapping.icbCode}})
      }
    } 
    else {
      console.warn(`${industry} industry is unknown`)
    }
  } else {
    if (!gicsCode) {
      await prisma.instrument.update({
        where: {isin}, 
        data: {gicsCode: 10101010}
      })
      console.warn(`setting gics code for ${name} (${ticker}) to 10101010`)
    }
  }
}

async function updateStocks() {
  const count = await prisma.instrument.count({where:{assetclass:'equity'}})
  console.log(`Updating ${count} stocks`)
  for (let i=0; i<Math.ceil(count/1000); i++) {
    const stocks = await getInstruments('equity', 1000, i*1000)
    const quotes = await quoteMany(stocks.map(getYahooTickerSync))
    if (Array.isArray(quotes)) {
      console.log(` Batch ${i+1}: got ${quotes.length} of ${stocks.length} quotes`)
      for (const stock of stocks){
        if (!stock.gicsCode || !stock.icbCode) {
          await fixClassification(stock)
        }
        const quote = quotes.find(item => item.symbol === getYahooTickerSync(stock))
        if (quote) {
          const updated = await prisma.instrument.update({
            where: {isin: stock.isin},
            data: {
              assetclass: quote.quoteType.toLowerCase(),
              exchangeId: getMic(quote.fullExchangeName),
              name: quote.longName ?? quote.shortName,
              sharesOut: quote.sharesOutstanding ?? 1
            }
          })
          if (stock.name !== updated.name || stock.sharesOut !== updated.sharesOut) {
            console.log(`  updated ${updated.ticker}:${updated.exchangeId} ${updated.name} from ${stock.sharesOut} to ${updated.sharesOut}`)
          } 
        } else {
          console.log(`  cannot update ${stock.ticker}`)
        }
      }
    }
  }
}

async function updateFunds() {
  const funds = await getInstruments('etf')
  console.log(`Updating ${funds.length} funds`)
  const quotes = await quoteMany(funds.map(getYahooTickerSync))
  if (Array.isArray(quotes)) {
    for (const fund of funds){
      const quote = quotes.find(item => item.symbol === getYahooTickerSync(fund))
      if (quote) {
        const updated = await prisma.instrument.update({
          where: { isin: fund.isin },
          data: {
            exchangeId: getMic(quote.fullExchangeName),
            name: quote.longName ?? quote.shortName,
          }
        })
        if (fund.name !== updated.name) {
          console.log(` updated ${fund.ticker}:${fund.exchangeId} from ${fund.name} to ${updated.name}`)
        }
      } else {
        console.log(` Cannot update ${fund.ticker}`)
      }
    }
  }
}

async function updateCryptos() {
  const cryptos = await getInstruments('cryptocurrency')
  console.log(`Updating ${cryptos.length} cryptos`)
  const quotes = await quoteManyCmc(1,500)
  if (Array.isArray(quotes)) {
    for (const crypto of cryptos){
      const quote = quotes.find(item => item.symbol === crypto.ticker)
      if (quote) {
        if (quote.name !== crypto.name) {
          const updated = await prisma.instrument.update({
            where: {isin:crypto.isin},
            data: {name:quote.name, exchangeId:'XOFF', countryCode:'ZZ', isin:`ZZXOFF${crypto.ticker}`}
          })
          console.log(` updated ${updated.ticker}:${updated.exchangeId} from ${crypto.name} to ${updated.name}`)
        }
      } else {
        console.log(` Cannot update ${crypto.ticker}`)
      }
    }
  }
}

async function updateCurrencies() {
  const currencies = await getInstruments('cash')
  console.log(`Updating ${currencies.length} currencies`)
  const quotes = await quoteMany(currencies.map(getYahooTickerSync))
  if (Array.isArray(quotes)) {
    for (const currency of currencies){
      const quote = quotes.find(item => item.symbol === getYahooTickerSync(currency))
      if (quote) {
        const updated = await prisma.instrument.update({
          where: { isin: currency.isin },
          data: {
            exchangeId: getMic(quote.fullExchangeName),
            name: quote.longName ?? quote.shortName,
          }
        })
        if (currency.name !== updated.name) {
          console.log(` updated ${currency.ticker}:${currency.exchangeId} from ${currency.name} to ${updated.name}`)
        }
      } else {
        console.log(` Cannot update ${currency.ticker}`)
      }
    }
  }
}

await updateStocks()
await updateFunds()
await updateCryptos()
await updateCurrencies()
process.exit(0)
