import type {Actions, PageServerLoadEvent} from './$types.ts'
import type {GenericObject} from '$lib/types.ts'
import {error, redirect} from '@sveltejs/kit'
import db, {getFields} from '$lib/server/database.ts'

export const actions = {
  create: async ({params, request}) => {
    const {entity: entityKey} = params
    const formData = await request.formData()
    const data: GenericObject = Object.fromEntries(formData)
    if (entityKey === 'country') {
      console.log(data)
      const {code, name, region, currency} = data
      const record = await db.country.create({
        data: {
          code,
          name,
          region,
          Currency: {connect: {code: currency}}
        }
      })
      return redirect(303, `/instrument`)
    } else {
      console.log(`${entityKey} creation not implemented`)
      console.log(data)
      error(500, `${entityKey} creation not implemented`)
    }
  },
  update: async ({params, request, url}) => {
    const {entity: entityKey} = params
    const formData = await request.formData()
    const data: GenericObject = Object.fromEntries(formData)
    if (entityKey === 'gics') {
      data.code = parseInt(data.code)
      const {code, ...values} = data
      const record = await db.gics.update({where: {code}, data: values})
      return redirect(303, `/gics`)
    } else {
      console.log(`${entityKey} update not implemented`)
      console.log(data)
      error(500, `${entityKey} update not implemented`)
    }
  },
  delete: async ({params, request, url}) => {
    const {entity: entityKey} = params
    const formData = await request.formData()
    const data: GenericObject = Object.fromEntries(formData)
    if (entityKey === 'gics') {
      await db.gics.delete({where: {code: data.code}})
      return redirect(303, `/examples/${entityKey}`)
    } else {
      console.log(`${entityKey} delettion not implemented`)
      error(500, `${entityKey} delettion not implemented`)
    }
  }
} satisfies Actions

export async function load({params, url}: PageServerLoadEvent) {
  const {entity: entityKey} = params
  const fields = await getFields(entityKey)
  if (url.searchParams.size == 1) {
    const recordKey = Object.fromEntries(url.searchParams) as GenericObject
    if (entityKey === 'gics') recordKey.code = parseInt(recordKey.code)
    // @ts-expect-error
    const record = await db[entityKey as EntityKey].findUnique({where: recordKey})
    if (record) {
      return {fields, record, action: 'update'}
    } else {
      error(500, `record ${recordKey} not found`)
    }
  } else if (url.searchParams.size > 1) {
    const recordKeyName = url.searchParams.keys().toArray().join('_')
    const recordKeys = Object.fromEntries(url.searchParams) as GenericObject
    // @ts-expect-error
    const record = await db[entityKey as EntityKey].findUnique({
      where: {[recordKeyName]: recordKeys}
    })
    if (record) {
      if (entityKey === 'instrumentToPortfolio') {
        record.portfolio = `${recordKeys.user}:${recordKeys.ticker}`
      }
      return {fields, record, action: 'update'}
    } else {
      error(500, `record ${recordKeys} not found`)
    }
  } else {
    let defaults = {}
    if (entityKey === 'company') {
      defaults = {
        headquarter: 'US',
        domicile: 'US'
      }
    }
    return {fields, record: defaults, action: 'create'}
  }
}
