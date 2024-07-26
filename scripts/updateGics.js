import XLSX from 'xlsx'
import { writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const url = new URL('https://www.msci.com/documents/1296102/11185224/GICS+Map+2023.xlsx/82cc6504-9919-29e5-9789-a24fc039d0a5')
const inputFile = './data/gics.xlsx'
const outputPath = './data'
//const outputPath = '../database/backup'

function parseJSON(json) {
  const gics = []
  for (const [index, item] of json.entries()) {
    if (typeof item.sector_code !== 'number') item.sector_code = null
    if (typeof item.subindustry_code !== 'number') item.subindustry_code = null
    if (typeof item.industrygroup_code !== 'number') item.industrygroup_code = null
    if (typeof item.industry_code !== 'number') item.industry_code = null
    if (item.subindustry_code) {
      item.description = json[index+1].subindustry
      gics.push(item)
    }
  }
  return gics
}

async function getSegment(data, segemnt='GicsSector', save=true) {
  let records
  if (segemnt === 'GicsSector') {
    records = data.filter(el => el.sector_code && el.sector).map(el => ({code:el.sector_code, name:el.sector}))
  }
  if (segemnt === 'GicsIndustryGroup') {
    records = data.filter(el => el.industrygroup_code && el.industrygroup)
                  .map(el => ({
                    code: el.industrygroup_code, 
                    name: el.industrygroup.replace(/\s\(New.*\)$/,'').replace(/\s\s/, ' '), 
                    sector_code: parseInt(el.industrygroup_code.toString().slice(0,2)) 
                  }))
  }
  if (segemnt === 'GicsIndustry') {
    records = data.filter(el => el.industry_code && el.industry)
                  .map(el => ({
                    code: el.industry_code, 
                    name: el.industry.replace(/\s\(New.*\)$/,'').replace(/\r\n/, ' ').replace(/^\s/, ''), 
                    industrygroup_code: parseInt(el.industry_code.toString().slice(0,4))
                  }))
  }
  if (segemnt === 'Gics') {
    records = data.filter(el => el.subindustry_code && el.subindustry && el.description)
                  .map(el => ({
                    code: el.subindustry_code, 
                    name: el.subindustry.replace(/\s\((New|Definition|Sector).*\)$/,'').replace(/\s$/, ''), 
                    description: el.description.replace(/\s\s/, ' ').replace(/\s$/, '').replace(/\s\./, '.'), 
                    industry_code: parseInt(el.subindustry_code.toString().slice(0,6)),
                    industrygroupCode: parseInt(el.subindustry_code.toString().slice(0,4)),
                    sectorCode: parseInt(el.subindustry_code.toString().slice(0,2))
                  }))
                  .sort((a,b) => a.code - b.code)
  }
  if (save) {
    await saveJSON(records, segemnt)
  }
  return records
}

async function saveJSON(data, name) {
  await writeFile(`${outputPath}/${name}.json`, JSON.stringify(data, undefined, 2))
}

async function upsertGics(subindustries) {
  for (const subindustry of subindustries) {
    if (subindustry.code) {
      const upserted = await prisma.gics.upsert({
        where: { code: subindustry.code },
        create: subindustry,
        update: subindustry
      })
      console.log(`Upserted ${upserted.code} ${upserted.name}`)
    } else {
      console.log(`${subindustry.name} has no code`)
    }
  }
}

if (!existsSync(inputFile)) {
  url.searchParams.set('t', '1679087572540')
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
const header = ['sector_code', 'sector', 'industrygroup_code', 'industrygroup', 'industry_code', 'industry' ,'subindustry_code', 'subindustry']
const json = XLSX.utils.sheet_to_json(ws, { range: 'A5:H344', header, defval: null })
const gicsData = parseJSON(json)

const sectors = await getSegment(gicsData, 'GicsSector')
const industrygroups = await getSegment(gicsData, 'GicsIndustryGroup')
const industries = await getSegment(gicsData, 'GicsIndustry')
const subindustries = await getSegment(gicsData, 'Gics')

// check consistency
const gics = await prisma.gics.findMany()
for (const gic of gics) {
  if ( gic.industryCode != gic.code.toString().slice(0,6) |
       gic.industrygroupCode != gic.code.toString().slice(0,4) |
       gic.sectorCode != gic.code.toString().slice(0,2)
  ) {
    console.log('inconsistency found')
    console.log(gic)
  }
}

// await upsertGics(subindustries)

