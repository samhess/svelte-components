import { PrismaClient } from '@prisma/client'
import { writeFile } from 'node:fs/promises'
import { format, resolve } from 'node:path'

const prisma = new PrismaClient()
const backupDir = resolve('..', 'scripts/backup')
console.log(`Backup directory is ${backupDir}`)

const tables = await prisma.$queryRaw`
  select table_name
  from information_schema.tables
  where table_schema = 'public'
  order by table_name
`
for (const table of tables) {
  const {table_name:name} = table
  const records = await prisma[name].findMany()
  const json = JSON.stringify(records, undefined, 2)
  const path = format({dir:backupDir, name, ext:'json'})
  await writeFile(path, json)
  console.log(`backing up table ${name}`)
}
process.exit(0)


// JSON.stringify cannot handle BigInt
// const replacer = (key, value) => typeof value === 'bigint' ? parseInt(value) : value

