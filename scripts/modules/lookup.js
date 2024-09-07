import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const blacklist = [
  'Bobst Group',
  'Achiko',
  'Credit Suisse Group',
  'Von Roll',
  'EPH European Property',
  'Castle Alternative Invest',
  'IGEA Pharma N.V.',
  'Vifor Pharma',
  'One Swiss Bank',
  'Schaffner',
  'Kinarus Therapeutics',
  'Banque Profil de Gestion', // One swiss bank
  'Datacolor',
  'lastminute.com N.V.',
  'ObsEva',
  'PIERER Mobility'
]

export async function findCompany(name) {
  if (!name) return null
  name = name
    .replace(/\s\(.*\)$/, '') // (BCV), (BLKB)
    .replace(/\sAG$/, '')
    .replace(/\sSA$/, '')
    .replace(/\sSpA$/, '')
    .replace(/\sNV$/, '')
    .replace(/\sHolding$/, '')
    .replace(/\sLtd$/, '')
    .replace(/^St\s/, 'St. ')
    .replace(/^ams/, 'ams-OSRAM')
    .replace(/Baloise/, 'Bâloise')
    .replace(/Baer Group/, 'Bär Gruppe')
    .replace('CPH Chemie + Papier', 'CPH Group AG')
    .replace(/Daetwyler/, 'Dätwyler')
    .replace(/Dufry/, 'Avolta')
    .replace(/Flughafen Zurich/, 'Flughafen Zürich')
    .replace(/Fuessli/, 'Füssli')
    .replace(/Geneve/, 'Genève')
    .replace(/Graubuendner/, 'Graubündner')
    .replace(/Leclanche/, 'Leclanché')
    .replace(/Nestle/, 'Nestlé')
    .replace(/SIG Combibloc Group/, 'SIG Group')
    .replace(/Spruengli/, 'Sprüngli')
    .replace(/Truebsee/, 'Trübsee')
    .replace(/Zueblin/, 'Züblin')
    .replace(/Zur Rose Group/, 'DocMorris')
    .replace(/^.*Tornos.*$/, 'StarragTornos Group AG')
    .replace(/Poenina/, 'Burkhalter Holding AG')
    .replace(/Air Liquide/, 'L\u0027Air Liquide S.A.')
    .replace(/DHL Group/, 'Deutsche Post AG')
    .replace(/L\u2019Oréal/, 'L\u0027Oréal S.A.')
    .replace(/^Richemont$/, 'Compagnie Financière Richemont SA')
    .replace(/RELX Group/, 'RELX PLC')
    .replace(/^ABB$/, 'ABB Ltd')
    .replace(/^VT5 Acquisition Company$/, 'R&S Group Holding')
    .replace(/Energiedienst/, 'Naturenergie')
  const instrument = await prisma.instrument.findFirst({where:{name:{startsWith:name}}})
  if (instrument) {
    return instrument
  } else {
    if (!blacklist.includes(name)) {
      console.warn(`lookup.js: company ${name} unknown`)
    }
    return null
  }
}

export async function findCountry(name) {
  if (!name) return null
  const country = await prisma.country.findFirst({where:{name:{startsWith:name}}})
  if (country) {
    return country
  } else {
    console.log(`Country ${name} unknown`)
    return null
  }
}

export async function findExchange(name) {
  if (!name) return null
  name = name
    .replace(/Ltd.?$/,'')
    .replace(/Inc.$/,'')
    .replace(/Llc$/,'')
    .replace(/A\/S$/,'')
    .replace(/Ag$/,'')
    .replace(/Asa$/,'')
    .replace(/Nyse Euronext/,'Euronext')
    .replace(/^Nasdaq Omx/,'Nasdaq')
    .replace(/Omx Nordic Exchange/,'Nasdaq')
    .replace(/^Nasdaq Nordic/,'Nasdaq Stockholm')
    .replace(/^Cboe.*$/,'Cboe')
    .replace(/Deutsche Boerse /,'')
    .replace(/Boerse/,'Börse')
    .replace(/New Zealand Exchange/,'Nzx')
    .replace(/Oslo Bors/,'Oslo')
    .replace(/New York Stock Exchange/,'New York Stock')
    .replace(/Nyse Mkt/,'New York Stock')
    .replace(/Euronext Amsterdam/,'Euronext - Euronext Amsterdam')
    .replace(/Bolsa De Madrid/,'BME')
  const exchange = await prisma.exchange.findFirst({where:{name:{startsWith:name}}})
  if (exchange) {
    return exchange
  } else {
    console.log(`Exchange ${name} unknown`)
    return null
  }
}