import type {PageServerLoadEvent} from "./$types.js"
import db from '$lib/server/database.js'

export async function load({locals}:PageServerLoadEvent) {
  const {session, user} = locals
  const entity = {
    attributes: {
      code: {name: 'Code'},
      name: {name: 'Name'},
      issuer: {name: 'Issuer'},
      countries: {name: 'Main currency in', edit: false}
    },
    endpoint: 'currency',
    name: 'Currencies',
    sorting: {field: 'code'},
    isEditable: true
  }
  const records = await db.currency.findMany({
    orderBy: {code: 'asc'},
    include: {Country: true}
  })
  return {entity, records}
}
