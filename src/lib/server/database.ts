import 'dotenv/config'
import {PrismaBetterSqlite3} from '@prisma/adapter-better-sqlite3'
import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient, Prisma, $Enums} from '../../../prisma/generated/client.ts'
import {env} from 'prisma/config'

const connectionString = env('DATABASE_URL')
const url = new URL(connectionString)

let adapter
if (url.protocol == 'postgres:') {
  console.log(`using PostgreSQL database ${url.hostname}`)
  adapter = new PrismaPg({connectionString})
} else {
  const url = `file:${process.cwd()}/database/svelte-components.db`
  console.log(`using SQLite database ${url}`)
  adapter = new PrismaBetterSqlite3({url})
}

const db = new PrismaClient({
  adapter,
  log: ['info', 'warn', 'error']
})

export default db

const capitalize = (str: string) => str.replace(/^\w/, (v) => v.toUpperCase())

const models = Object.keys(Prisma.ModelName)

export async function getSelectOptions(entity: string) {
  if (entity in $Enums) {
    // @ts-expect-error
    const keys = Object.keys($Enums[entity])
    const options = keys.map((key: any) => ({value: key, name: capitalize(key)}))
    options.unshift({
      value: undefined,
      name: `\u2014\u2014\u2014 select ${entity.toLowerCase()} \u2014\u2014\u2014`
    })
    return options
  } else if (models.includes(entity)) {
    let options = new Array()
    if (entity === 'Currency') {
      options = await db.currency.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'Country') {
      options = await db.country.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'Gics') {
      options = await db.gics.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'Sector') {
      options = await db.gicsSector.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'Industry') {
      options = await db.gicsIndustry.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'IndustryGroup') {
      options = await db.gicsIndustryGroup.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'Exchange') {
      options = await db.exchange.findMany({orderBy: {mic: 'asc'}})
      options = options.map(({mic, name}) => ({value: mic, name: `${mic} \u2013 ${name}`}))
    } else if (entity === 'User') {
      options = await db.user.findMany({orderBy: {email: 'asc'}})
      options = options.map(({email, firstname, lastname}) => ({
        value: email,
        name: `${email} \u2013 ${firstname} ${lastname}`
      }))
    }
    options.unshift({
      value: null,
      name: `\u2014\u2014\u2014 select ${entity.toLowerCase()} \u2014\u2014\u2014`
    })
    return options as Array<{value: any; name: string}>
  } else {
    return []
  }
}

export async function getFields(entityKey: string) {
  // @ts-expect-error
  let dbFields = Object.assign({}, db[entityKey].fields)
  if (entityKey === 'gics') {
    delete dbFields.industry
    delete dbFields.sector
    delete dbFields.industryGroup
  }
  let formFields = []
  for (const field in dbFields) {
    const capitalName = field.replace(/^\w/, (c) => c.toUpperCase())
    if (models.includes(capitalName)) {
      formFields.push({
        kind: 'relation',
        name: capitalName,
        options: await getSelectOptions(capitalName)
      })
    } else if (capitalName in $Enums) {
      formFields.push({
        kind: 'enum',
        name: capitalName,
        options: await getSelectOptions(capitalName)
      })
    } else {
      formFields.push({
        kind: 'scalar',
        name: capitalName,
        type: dbFields[field].typeName.replace(/String/, 'text').replace(/Int|Float/, 'number')
      })
    }
  }
  if (entityKey === 'instrumentToPortfolio') {
    formFields.splice(0, 2)
    formFields.unshift({
      kind: 'relation',
      name: 'portfolio',
      options: await getSelectOptions('Portfolio'),
      type: 'select'
    })
  }
  //console.log(fields.map(({name,options})=>({name,options:options.length})))
  return formFields
}
