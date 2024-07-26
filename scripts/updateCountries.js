import { readFile, writeFile } from 'fs/promises'
import * as cheerio from 'cheerio'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const csv = await readFile('./data/countries.csv', { encoding: 'utf-8' })
const lines = csv.split(/\r\n/)
const countries = lines.slice(1).map(country => {
  const fields = country.replace(/(,)(?=(?:[^"]|"[^"]*")*$)/g,';').split(';')
  return {
    code: fields[2],
    name: fields[0].replace(/^"/,'').replace(/"$/,'').replace(/\*$/,'')
  }
})
countries.push({code:'ZZ', name:'Unknown or unspecified country'})
//await writeFile('./data/countries.json', JSON.stringify(countries,  null, 2))

for (const country of countries) {
  let currentCountry = await prisma.country.findUnique({where: {code: country.code}})
  if (currentCountry === null) {
    console.log(`${country.code} ${country.name} is missing`)
  } else if (currentCountry.name !== country.name) {
    //console.log(`${currentCountry.name} should be ${country.name}`)
  }
}

async function getRegions() {
  const url = new URL('https://en.wikipedia.org/wiki/List_of_countries_by_the_United_Nations_geoscheme')
  const response = await fetch(url)
  if (response.ok) {
    const text = await response.text()
    const $ = cheerio.load(text, { decodeEntities: false }, false)
    const table = $('table').first()
    const regions = []
    $(table).find('tbody > tr').each((i,el) => {
      if (i>0) {
        const country = $(el).find('td').first().text().trim()
        const region = $(el).find('td').eq(3).text().trim()
        regions.push({country,region})
      }
    })
    return regions
  }
}

async function updateRegions(records) {
  await prisma.country.update({where: {code:'TW'},data: {region:'Asia'}})
  await prisma.country.updateMany({where: {code: {in:['ZZ','AQ']}},data: {region:'n/a'}})
  for (const record of records) {
    const countryName = record.country
      .replace(/(\s\[.*\])$/,'')
      .replace(/^China,\s/, '')
      .replace(/\sSpecial Administrative Region$/, '')
      .replace('British Virgin Islands', 'Virgin Islands (British)')
      .replace(/^Congo/, 'Congo (the)')
      .replace('Democratic Republic of the Congo', 'Congo (the Democratic Republic of the)')
      .replace("Democratic People's Republic of Korea", "Korea (the Democratic People's Republic of)")
      .replace("Republic of Korea", 'Korea (the Republic of)')
      .replace('Republic of Moldova', 'Moldova')
      .replace('State of Palestine', 'Palestine')
      .replace('United States Virgin Islands', 'Virgin Islands (U.S.)')
      .replace('United Republic of Tanzania', 'Tanzania, the United Republic of')
      .replace('Svalbard and Jan Mayen Islands','Svalbard and Jan Mayen')
      .replace('Wallis and Futuna Islands','Wallis and Futuna')
      .replace('Falkland Islands (Malvinas)','Falkland Islands (the)')
    const country = await prisma.country.findFirst({where: {name: {startsWith: countryName}}})
    if (country && record.region) {
      await prisma.country.update({
        where: {code:country.code},
        data: {region: record.region}
      })
    } else {
      console.log(`skipping ${record.country}`)
    }
  }
}

const scrapedRegions = await getRegions()
await updateRegions(scrapedRegions)