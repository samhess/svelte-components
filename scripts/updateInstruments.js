import { quoteMany, quoteSummary, getYahooTicker, getYahooTickerSync} from '../src/lib/server/yahooFinance.js'
import { quoteMany as quoteManyCmc } from '../src/lib/server/cmc.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getInstruments(type='cash', assetclass='equity', limit=1000, offset=0) {
  return await prisma.instrument.findMany({
    where: {type,assetclass},
    include: {Exchange:true},
    skip: offset,
    take: limit
  })
}

async function fixClassification({isin, ticker, name, exchange, gicsCode, icbCode}) {
  const yahooTicker = await getYahooTicker({ticker, exchange})
  const response = await quoteSummary(yahooTicker, ['assetProfile'])
  if (response instanceof Error === false) {
    const {result, error} = response
    if (!error) {
      const [data] = result
      const {assetProfile} = data
      const yahooIndustry = assetProfile.industry
        .replace('Confectioners', 'Packaged Foods')
        .replace('Discount Stores', 'Broadline Retail')
        .replace('Drug Manufacturers—Specialty & Generic', 'Drug Manufacturers—General')
        .replace('Healthcare Plans', 'Insurance—Life')
        .replace('Internet Retail', 'Broadline Retail')
        .replace('Insurance—Specialty', 'Insurance—Property & Casualty')
        .replace('Pollution & Treatment Controls', 'Waste Management')
        .replace('Resorts & Casinos', 'Lodging')
        .replace('Solar', 'Semiconductors')
      const mapping = await prisma.gicsToIcb.findFirst({where:{yahooIndustry}, include:{Gics:true,Icb:true}})
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
        console.warn(`${yahooIndustry} industry is unknown`)
      }
    } else {
      console.error(error)
      throw new Error(error)
    } 
  } else {
    console.error(`  ${response.message} for ${yahooTicker} (${response.cause.statusText})`)
    //throw new Error(response.message)
  }
}

async function updateStocks() {
  const count = await prisma.instrument.count({where:{assetclass:'equity'}})
  console.log(`Updating ${count} stocks`)
  for (let i=0; i<Math.ceil(count/1000); i++) {
    const stocks = await getInstruments('cash', 'equity', 1000, i*1000)
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
              //assetclass: quote.quoteType.toLowerCase().replace('mutualfund','equity'),
              name: quote.longName ?? quote.shortName,
              sharesOut: quote.sharesOutstanding ?? 1
            }
          })
          if (stock.name !== updated.name || stock.sharesOut !== updated.sharesOut) {
            console.log(`  updated ${updated.ticker}:${updated.exchange} ${updated.name} from ${stock.sharesOut} to ${updated.sharesOut}`)
          } 
        } else {
          console.log(`  cannot update ${stock.ticker}`)
        }
      }
    }
  }
}

async function updateFunds() {
  const funds = await getInstruments('fund', 'equity')
  console.log(`Updating ${funds.length} funds`)
  const quotes = await quoteMany(funds.map(getYahooTickerSync))
  if (Array.isArray(quotes)) {
    for (const fund of funds){
      const quote = quotes.find(item => item.symbol === getYahooTickerSync(fund))
      if (quote) {
        const updated = await prisma.instrument.update({
          where: { isin: fund.isin },
          data: {
            name: quote.longName ?? quote.shortName,
          }
        })
        if (fund.name !== updated.name) {
          console.log(` updated ${fund.ticker}:${fund.exchange} from ${fund.name} to ${updated.name}`)
        }
      } else {
        console.log(` Cannot update ${fund.ticker}`)
      }
    }
  }
}

async function updateCryptos() {
  const cryptos = await getInstruments('cash', 'cryptocurrency')
  console.log(`Updating ${cryptos.length} cryptos`)
  const quotes = await quoteManyCmc(1,500)
  if (Array.isArray(quotes)) {
    for (const crypto of cryptos){
      const quote = quotes.find(item => item.symbol === crypto.ticker)
      if (quote) {
        if (quote.name !== crypto.name) {
          const updated = await prisma.instrument.update({
            where: {isin:crypto.isin},
            data: {name:quote.name, exchange:'XOFF', country:'ZZ', isin:`ZZXOFF${crypto.ticker}`}
          })
          console.log(` updated ${updated.ticker}:${updated.exchange} from ${crypto.name} to ${updated.name}`)
        }
      } else {
        console.log(` Cannot update ${crypto.ticker}`)
      }
    }
  }
}

async function updateCurrencies() {
  const currencies = await getInstruments('forex', 'currency')
  console.log(`Updating ${currencies.length} currencies`)
  const quotes = await quoteMany(currencies.map(getYahooTickerSync))
  if (Array.isArray(quotes)) {
    for (const currency of currencies){
      const quote = quotes.find(item => item.symbol === getYahooTickerSync(currency))
      if (quote) {
        const updated = await prisma.instrument.update({
          where: { isin: currency.isin },
          data: {
            name: quote.longName ?? quote.shortName,
          }
        })
        if (currency.name !== updated.name) {
          console.log(` updated ${currency.ticker}:${currency.exchange} from ${currency.name} to ${updated.name}`)
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
