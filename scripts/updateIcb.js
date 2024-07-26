import XLSX from 'xlsx'
import { writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const url = new URL('https://content.ftserussell.com/sites/default/files/icb_structure_and_definitions_0.xlsx')
const inputFile = './data/icb.xlsx'
//const outputDir = '../database/backup'
const outputDir = './data'

const keepUnique = (element,index,array) => array.findIndex(item => item.code === element.code) === index

async function saveJSON(data, name) {
  await writeFile(`${outputDir}/${name}.json`, JSON.stringify(data, undefined, 2))
}

async function upsertIcb(subsectors) {
  for (const subsector of subsectors) {
    if (subsector.code) {
      const upserted = await prisma.icb.upsert({
        where: { code: subsector.code },
        create: subsector,
        update: subsector
      })
      console.log(`Upserted ${upserted.code} ${upserted.name}`)
    } else {
      console.log(`${subsector.name} has no code`)
    }
  }
}

if (!existsSync(inputFile)) {
  const response = await fetch(url)
  if (response.ok) {
    const data = await response.arrayBuffer()
    await writeFile(inputFile, Buffer.from(data))
  } else {
    console.error(response.statusText)
    throw new Error(response.statusText)
  }
}
const wb = XLSX.readFile(inputFile)
const ws = wb.Sheets[wb.SheetNames[0]]
const header = ['industryCode', 'industry', 'supersectorCode', 'supersector', 'sectorCode', 'sector', 'subsectorCode', 'subsector', 'description']
const icb = XLSX.utils.sheet_to_json(ws, { range: 'A2:I174', defval: null, header })

// clean items
for (const item of icb) {
  item.subsector = item.subsector.replace(/\s$/, '')
  item.description = item.description.replace(/\s*$/, '').replace(/(\")/g, '').replace('’',"'")
  item.sector = item.sector.replace(/\s$/, '')
  item.supersector = item.supersector.replace(/\s*$/, '')
  item.industry = item.industry.replace(/\s$/, '')
}

const subsectors = icb
  .map(item => ({
    code: item.subsectorCode, 
    name: item.subsector, 
    description: item.description,
    sectorCode: item.sectorCode,
    supersectorCode: item.supersectorCode,
    industryCode: item.industryCode
  }))
await saveJSON(subsectors, 'Icb')

const sectors = icb
  .map(({sectorCode, sector, supersectorCode}) => ({code:sectorCode, name:sector, supersectorCode}))
  .filter(keepUnique)
await saveJSON(sectors, 'IcbSector')

const supersectors = icb
  .map(({supersectorCode, supersector, industryCode}) => ({code:supersectorCode, name:supersector, industryCode}))
  .filter(keepUnique)
await saveJSON(supersectors, 'IcbSupersector')

const industries = icb
  .map(({industryCode, industry}) => ({code:industryCode, name:industry}))
  .filter(keepUnique)
await saveJSON(industries, 'IcbIndustry')

// await upsertIcb(subsectors)
