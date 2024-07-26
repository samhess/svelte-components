import { writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { capitalize } from '../src/lib/helpers.js'
import { PrismaClient } from '@prisma/client'
import XLSX from 'xlsx'

const prisma = new PrismaClient()
const inputFile = './data/currencies.xls'
const url = new URL('https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xls')

if (!existsSync(inputFile)) {
  const response = await fetch(url)
  if (response.ok) {
    const data = await response.arrayBuffer()
    await writeFile(inputFile, Buffer.from(data))
  } else {
    console.log(response.statusText)
  } 
}
const wb = XLSX.readFile(inputFile)
const ws = wb.Sheets[wb.SheetNames[0]]
const headers = ['issuer', 'currency', 'alphabeticCode', 'numericCode', 'minorUnit']
const currencies = XLSX.utils.sheet_to_json(ws, { range:'A5:E285',  header:headers, defval:null })
console.log(currencies)

for (const currency of currencies) {
  if (currency.alphabeticCode) {
    const countryName = currency.issuer.toLowerCase().replace(/\u2019/g,"'").replace(/\u0307/g,'').replace(/^tanzania.*$/,'tanzania')
    const country = await prisma.country.findFirst({where: {name: {startsWith:capitalize(countryName)}}})
    if (country) {
      currency.countryCode = country.code
    } else {
      currency.countryCode = 'ZZ'
      //console.log(`${currency.alphabeticCode}: ${countryName}`)
    }
    currency.numericCode = parseInt(currency.numericCode)
    currency.minorUnit = currency.minorUnit && currency.minorUnit !== 'N.A.' ? parseInt(currency.minorUnit) : currency.minorUnit
  } else {
    //console.log(currency)
  }
}

for (const currency of currencies) {
  const {code,name,issuer } = currency
  await prisma.currency.upsert({
    where: {code},
    update: {name},
    create: {
      code,
      name,
      issuer,
      Country: {
        connectOrCreate: {
          where: {code:'ZZ'},
          create: {code:'ZZ'}
        }}
    }
  })
}


