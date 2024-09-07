import {writeFile} from 'fs/promises'
import {format, resolve} from 'node:path'
import {download,downloadFile} from '../src/lib/server/helpers.js'
import {capitalize} from '../src/lib/helpers.js'
import XLSX from 'xlsx'
const {sheet_to_json} = XLSX.utils

const source = new URL('content/dam/ftse-russell/en_us/documents/other/icb-structure-and-definitions.xlsx','https://www.lseg.com')
const tmpFile = resolve('data','icb.xlsx')
const outputPath = resolve('..','database','backup')
const headers = [
  'industryCode',
  'industry',
  'superSectorCode',
  'superSector',
  'sectorCode',
  'sector',
  'subSectorCode',
  'subSector',
  'description'
]

function getEntities(taxonomy) {
  const keepUnique = (item,index,items) => items.findIndex(({code})=>code===item.code)===index
  const subSectors = taxonomy
    .map(item => ({
      code: item.subSectorCode, 
      name: item.subSector, 
      description: item.description,
      sector: item.sectorCode,
      superSector: item.superSectorCode,
      industry: item.industryCode
    }))
  const sectors = taxonomy
    .map(({sectorCode,sector}) => ({code:sectorCode, name:sector}))
    .filter(keepUnique)
  const superSectors = taxonomy
    .map(({superSectorCode,superSector}) => ({code:superSectorCode, name:superSector}))
    .filter(keepUnique)
  const industries = taxonomy
    .map(({industryCode,industry}) => ({code:industryCode, name:industry}))
    .filter(keepUnique)
  return {subSectors,sectors,superSectors,industries}
}

const data = await download(source)
//const result = await downloadFile(source,tmpFile)
if (data instanceof Error === false) {
  const wb = XLSX.read(data, {type:'buffer'})
  const ws = wb.Sheets[wb.SheetNames[0]]

  // get json and trim items
  const json = sheet_to_json(ws, {range:'B3:J175', header:headers})
    .map(item=>{
      const {description,industry,sector,subSector,superSector} = item
      item.description = description.trim().replace(/(\")/g,'').replace(/\u2019/g,'\u0027'),
      item.industry = industry.trim()
      item.sector = sector.trim()
      item.subSector = subSector.trim()
      item.superSector = superSector.trim()
      return item
    })

  const entities = getEntities(json)
  for (const entity in entities) {
    const name = capitalize(entity.replace('subSectors','').replace(/ies$/,'y').replace(/s$/,''))
    const path = format({dir:outputPath, name:`Icb${name}`, ext:'json'})
    await writeFile(path, JSON.stringify(entities[entity],undefined,2))
  }

} else {
  console.log(data.message)
}

