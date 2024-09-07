import { capitalize, parseCsv } from '../src/lib/helpers.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getLocalExchanges() {
  return await prisma.exchange.findMany()
}

async function getRemoteExchanges() {
  const source = new URL('sites/default/files/ISO10383_MIC/ISO10383_MIC.csv','https://www.iso20022.org')
  const response = await fetch(source)
  const csv = await response.text()
  return parseCsv(csv)
}

async function updateExchange(record) {
  const {mic, ...data} = record
  const updated = await prisma.exchange.update({
    where: {mic},
    data: data
  })
  console.log(`updated ${mic} ${updated.name}`)
}

function getHost(website) {
  if (!website || website === 'N/A') return ''
  else {
    website = website.toLowerCase()
    if (!website.startsWith('http')) {
      website = 'http://' + website
    }
    return new URL(website).host
  }
}

function getName(name) {
  name = name.toLowerCase()
    .replace(/^bme/, 'BME')
    .replace(/^asx/, 'ASX')
    .replace(/^six/, 'SIX')
    .replace(/ab$/, 'AB')
    .replace(/ag$/, 'AG')
    .replace(/a\/s$/, 'A/S')
    .replace(/s.p.a.$/, 'S.p.A.')
    .replace(/boerse/, 'Börse')
    .replace(/(?<=\s\({0,1})(.)(?!\s)/g, wordStart => wordStart.toUpperCase())
    .replace(/(?<=\s)(and)(?=\s)/i, 'and')
    .replace(/(?<=\s)(of)(?=\s)/i, 'of')
    .replace(/e\.g\.\sunlisted/i, 'e.g. unlisted')
  return capitalize(name)
}

const localExchanges = await getLocalExchanges()
const remoteExchanges = await getRemoteExchanges()
for (const localExchange of localExchanges){
  const remoteExchange = remoteExchanges.find(exchange => exchange.mic === localExchange.mic)
  const record = {
    mic: remoteExchange.mic,
    acronym: remoteExchange.acronym,
    name: getName(remoteExchange.marketNameInstitutionDescription),
    country: remoteExchange.isoCountryCode,
    website: getHost(remoteExchange.website),
    city: remoteExchange.city === 'N/A' ? 'n/a' : capitalize(remoteExchange.city.toLowerCase())
  }
  await updateExchange(record)
}
