import db from '$lib/server/database.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({locals}) {
  const {session, user} = locals
  const entity = {
    attributes: {
      code: {name:'Alpha-2 code', align:'left'},
      name: {name:'Name'},
      region: {name:'Region'},
      Currency: {name:'Primary currency', default:'USD'}
    },
    endpoint: 'country',
    name: 'Countries',
    sorting: {field:'code'},
    isEditable: session ? user.role==='admin' : false,
  }
  const records = await db.country.findMany({
    orderBy: {code: 'asc'},
    include:{Currency:true}
  })
  for (const record of records) {
    // @ts-ignore
    record.Currency.value = record.Currency.code
  }
  return {entity, records}
}