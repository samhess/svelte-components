import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

const prisma = new PrismaClient()
const backupDir = './database/backup'

// order matters
const entities = [
  'User', 'Currency', 'Country', 'Exchange',
  'GicsSector','GicsIndustryGroup','GicsIndustry','Gics',
  'IcbIndustry','IcbSupersector','IcbSector','Icb',
  'GicsToIcb',
  'Instrument',
  'Event',
  //'Portfolio',
  //'PortfolioToInstrument',
  'Listing'
]

for (const entityName of entities) {
  const data = await readFile(resolve(backupDir, `${entityName}.json`))
  const records = JSON.parse(data)
  const entityKey = entityName.replace(/^./, char1=>char1.toLowerCase())
  const isEmpty = await prisma[entityKey].count() === 0
  if (isEmpty) {
    for (const record of records) {
      if (entityKey==='country') {
        const {currencyCode, ...scalars} = record
        await prisma.country.create({
          data: {
            ...scalars,
            Currency: {connect:{code:currencyCode}}
          }
        })
      } else {
        await prisma[entityKey].create({data:record})
      }
    }
    console.log(`created ${records.length} records in ${entityName} table`)
  }
  const count = await prisma[entityKey].count()
  if (count !== records.length) {
    console.log(`incomplete seeding of ${entityName} table (${count} of ${records.length})`)
  }
}
await prisma.$disconnect()
process.exit(0)
