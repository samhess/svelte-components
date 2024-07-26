import { readFile } from 'fs/promises'
import * as cheerio from 'cheerio'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getRegions() {
  const url = new URL('wiki/List_of_countries_by_the_United_Nations_geoscheme', 'https://en.wikipedia.org')
  const response = await fetch(url)
  if (response.ok) {
    const text = await response.text()
    const $ = cheerio.load(text, { decodeEntities: false }, false)
    const table = $('table').first()
    const rows = $(table).find('tbody > tr')
    const countries = []
    for (const row of rows) {
      const fields = $(row).children('td')
      const country = $(fields[0]).text().trim()
        .replace(/(\s\(disputed\)\[note.*\])$/,'')
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
      const region = $(fields[3]).text().trim()
      if (country && region)
      countries.push({country,region})
    }
    countries.push({country:'Taiwan (Province of China)', region:'Asia'})
    countries.push({country:'Unknown or unspecified country', region:'n/a'})
    return countries
  } else {
    throw new Error(response.statusText)
  }
}

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
const scrapedCountries = await getRegions()

for (const country of countries) {
  const {code,name} = country
  const search = scrapedCountries.find(country => name.startsWith(country.country))
  if (search) {
    const {region} = search
    await prisma.country.upsert({where: {code},update: {name},create: {code,name,region}})
  } else {
    console.log(`Cannot determine region for ${name}`)
  }
}