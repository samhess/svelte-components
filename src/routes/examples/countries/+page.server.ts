import type {PageServerLoadEvent} from './$types.js'
import db from '$lib/server/database.js'

export async function load({locals}: PageServerLoadEvent) {
  const {session, user} = locals
  const entity = {
    attributes: {
      code: {name: 'Code', align: 'left'},
      name: {name: 'Name'},
      region: {name: 'Region'},
      Currency: {name: 'Main Currency', default: 'USD', key: 'code'}
    },
    endpoint: 'country',
    name: 'Countries',
    sorting: {field: 'code'},
    isEditable: true
  }
  const records = await db.country.findMany({
    orderBy: {code: 'asc'},
    include: {Currency: true}
  })
  return {entity, records}
}
