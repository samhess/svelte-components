import {writeFile,readFile} from 'fs/promises'
import {format, resolve} from 'node:path'
import {download} from '../src/lib/server/helpers.js'
import {capitalize} from '../src/lib/helpers.js'
import XLSX from 'xlsx'
const {sheet_to_json} = XLSX.utils

const source = new URL('documents/1296102/11185224/GICS+Map+2023.xlsx','https://www.msci.com')
const tmpFile = resolve('data','gics.xlsx')
const outputPath = resolve('..','database','backup')

const headers = [
  'sectorCode',
  'sector',
  'industryGroupCode',
  'industryGroup',
  'industryCode',
  'industry',
  'subIndustryCode',
  'subIndustry'
]

function parseJSON(json) {
  const taxonomy = []
  for (const [index, item] of json.entries()) {
    item.industryGroup = item.industryGroup?.replace(/\s\(New.*\)$/,'').replace(/\s{2}/,' ')
    item.industry = item.industry?.trim().replace(/\s\(New.*\)$/,'').replace(/\r\n/,' ')
    item.subIndustry = item.subIndustry?.replace(/\s\((New|Definition|Sector).*\)$/,'').trimEnd()
    if (typeof item.subIndustryCode === 'number') {
      item.description = json[index+1].subIndustry.trim().replace(/\s\./,'.').replace(/\s{2}/,' ')
      taxonomy.push(item)
    } else {
      // avoid space (char 160)
      item.subIndustryCode = undefined
    }
  }
  return taxonomy
}

function getTaxonomy(data) {
  const sectors = data
    .filter(({sectorCode,sector}) => sectorCode && sector)
    .map(({sectorCode,sector}) => ({code:sectorCode, name:sector}))
  const industryGroups = data
    .filter(({industryGroupCode,industryGroup}) => industryGroupCode && industryGroup)
    .map(({industryGroupCode,industryGroup}) => ({
      code: industryGroupCode, 
      name: industryGroup, 
    }))
  const industries = data
    .filter(({industryCode,industry}) => industryCode && industry)
    .map(({industryCode,industry}) => ({
      code: industryCode, 
      name: industry, 
    }))
  const subIndustries = data
    .filter(item => item.subIndustryCode && item.subIndustry && item.description)
    .map(item => ({
      code: item.subIndustryCode, 
      name: item.subIndustry, 
      description: item.description, 
      industry: Math.floor(item.subIndustryCode/100),
      industryGroup: Math.floor(item.subIndustryCode/10000),
      sector: Math.floor(item.subIndustryCode/1000000)
    }))
    .sort((a,b) => a.code - b.code)
  return {sectors, industryGroups, industries, subIndustries}
}

//const data = await download(source)
const data = await readFile(tmpFile)
if (data instanceof Error === false) {
  const wb = XLSX.read(data, {type:'buffer'})
  const ws = wb.Sheets[wb.SheetNames[0]]
  const json = sheet_to_json(ws, {range:'A5:H350', header:headers})
  const taxonomy = parseJSON(json)
  const entities = getTaxonomy(taxonomy)
  for (const entity in entities) {
    const name = capitalize(entity.replace('subIndustries','').replace(/ies$/,'y').replace(/s$/,''))
    const path = format({dir:outputPath, name:`Gics${name}`, ext:'json'})
    await writeFile(path, JSON.stringify(entities[entity],undefined,2))
  }
} else {
  console.log(data.message)
}


