import db from '$lib/server/database.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({locals}) {
  const {session, user} = locals
  const entity = {
    attributes: {
      code: {name:'Code'},
      name: {name:'Name'},
      issuer: {name:'Issuer'},
      countries: {name:'Main currency in', edit:false },
    },
    endpoint: 'currency',
    name: 'Currencies',
    sorting: {field:'code'},
    isEditable: true,
  }
  const records = await db.currency.findMany({
    orderBy: {code: 'asc'},
    include: {Country:true}
  })
  return { entity, records}
}