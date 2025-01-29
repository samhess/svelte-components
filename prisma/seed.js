import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { resolve, format } from 'path'

const prisma = new PrismaClient()
const backupDir = resolve('database','backup')

// order matters
const entities = [
  'Currency',
  'Country',
  'Exchange',
  'GicsSector',
  'GicsIndustryGroup',
  'GicsIndustry',
  'Gics',
  'Company',
  'Instrument',
]

for (const entityName of entities) {
  const path = format({dir:backupDir, name:entityName, ext:'json'})
  const data = await readFile(path)
  const records = JSON.parse(data)
  const entityKey = entityName.replace(/^./, char1=>char1.toLowerCase())
  const isEmpty = await prisma[entityKey].count() === 0
  if (isEmpty) {
    await prisma[entityKey].createMany({data:records})
    const count = await prisma[entityKey].count()
    console.log(`${count} of ${records.length} ${entityName} records seeded`)
  } else {
    console.log(`skip seeding of non-empty table ${entityName} `)
  }
}
await prisma.$disconnect()
process.exit(0)
