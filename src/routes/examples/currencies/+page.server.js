import db from '$lib/server/database.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({locals}) {
  const {session, user} = locals
  const entity = {
    attributes: [
      { key: 'code', name: 'Code', align: 'left' },
      { key: 'name', name: 'Name' },
      { key: 'issuer', name: 'Issuer' },
      { key: 'countries', name: 'Main currency in', edit:false },
    ],
    endpoint: 'currency',
    name: 'Currencies',
    sorting: {field:'code'},
    isEditable: session ? user.role==='admin' : false,
  }
  const records = await db.currency.findMany({
    orderBy: {code: 'asc'},
    include: {Country:true}
  })
  return { entity, records}
}