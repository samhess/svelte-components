import db from '$lib/server/database.js'
import {json} from '@sveltejs/kit'
import {Prisma} from '@prisma/client'

const {models} = Prisma.dmmf.datamodel
const modelNames = models.map(({name})=>name.replace(/^Gics^$/,''))

/** @type {Object<string,any>} */
const hardOptions = {
  Assetclass: [
    { value:'bond', name:'Bond'},
    { value:'commodity', name:'Commodity'},
    { value:'cryptocurrency', name:'Cryptocurrency'},
    { value:'currency', name:'Foreign currency'},
    { value:'equity', name:'Equity'}
  ],
  Objective: [
    { value:'index', name:'Index'},
    { value:'investing', name:'Investing'},
    { value:'pension', name:'Pension'},
    { value:'reference', name:'Popular'},
    { value:'trading', name:'Trading'},
    { value:'watchlist', name:'Watchlist'},
  ],
  Type: [
    { value:'cash', name:'Cash financial instrument'},
    { value:'derivative', name:'Financial derivative'},
    { value:'forex', name:'Foreign exchange instrument'},
    { value:'fund', name:'Investment fund'},
    { value:'money', name:'Money market instrument'}
  ],
  Visibility: [
    { value:'private', name:'Private', },
    { value:'public', name:'Public'}
  ],
  Weighting: [
    { value:'marketcap', name:'marketcap-weighted'},
    { value:'price', name:'price-weighted'}
  ]
}

async function getOptions(entity='Article', orderKey='name', valueKey='code', nameKey='name') {
  /** @type {Object<string,any>[]} */
  // @ts-ignore
  const options = await db[entity].findMany({orderBy: {orderKey: 'asc'}})
  return options.map(option => ({
    value: option[valueKey], 
    name: option[nameKey]
  }))
}


/** @type {import('./$types').RequestHandler} */
export async function GET({params}) {
  const {entity} = params
  if (entity in hardOptions) {
    const options = new Array(...hardOptions[entity])
    options.unshift({value:'', name:`\u2014\u2014\u2014 select ${entity.toLowerCase()} \u2014\u2014\u2014`})
    return json(options)
  }
  else if (modelNames.includes(entity)) {
    let options = new Array()
    if (entity==='Article') {
      options = await db.article.findMany({orderBy: {title: 'asc'}})
      options = options.map(({url, title}) => ({value:url, name:title}))
    }
    else if (entity==='Country') {
      options = await db.country.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value:code, name:`${code} \u2013 ${name}`}))
    }
    else if (entity==='Currency') {
      options = await db.currency.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value:code, name:`${code} \u2013 ${name}`}))
    }
    else if (entity==='Gics') {
      options = await db.gics.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value:code, name:`${code} \u2013 ${name}`}))
    }
    else if (entity==='Sector') {
      options = await db.gicsSector.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value:code, name:`${code} \u2013 ${name}`}))
    }
    else if (entity==='Industry') {
      options = await db.gicsIndustry.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value:code, name:`${code} \u2013 ${name}`}))
    }
    else if (entity==='IndustryGroup') {
      options = await db.gicsIndustryGroup.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value:code, name:`${code} \u2013 ${name}`}))
    }
    else if (entity==='Icb') {
      options = await db.icb.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value:code, name:`${code} \u2013 ${name}`}))
    }
    else if (entity==='IcbSector') {
      options = await db.icbSector.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value:code, name:`${code} \u2013 ${name}`}))
    }
    else if (entity==='IcbIndustry') {
      options = await db.icbIndustry.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value:code, name:`${code} \u2013 ${name}`}))
    }
    else if (entity==='IcbSuperSector') {
      options = await db.icbSuperSector.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value:code, name:`${code} \u2013 ${name}`}))
    }
    else if (entity==='Instrument') {
      options = await db.instrument.findMany({orderBy: {name: 'asc'}})
      options = options.map(({isin,name,ticker,exchange}) => ({value:isin, name:`${ticker}:${exchange} \u2013 ${isin} \u2013 ${name}`}))
    }
    else if (entity==='Portfolio') {
      options = await db.portfolio.findMany({orderBy: {name: 'asc'}})
      options = options.map(({user,ticker, name}) => ({value:`${user}:${ticker}`, name:`${user}:${ticker} \u2013 ${name}`}))
    }
    else if (entity==='Exchange') {
      options = await db.exchange.findMany({orderBy: {mic: 'asc'}})
      options = options.map(({mic, name}) => ({value:mic, name:`${mic} \u2013 ${name}`}))
    }
    else if (entity==='User') {
      options = await db.user.findMany({orderBy: {email: 'asc'}})
      options = options.map(({email, firstname, lastname}) => ({value:email, name:`${email} \u2013 ${firstname} ${lastname}`}))
    }
    options.unshift({value:'', name:`\u2014\u2014\u2014 select ${entity.toLowerCase()} \u2014\u2014\u2014`})
    return json(options)
  } else {
    return json([{value:'', name:`\u2014 ${entity} cannot be looked up \u2014`}])
  }
}