import db from '$lib/server/database.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, fetch }) {
  const {session, user} = locals
  const entity = {
    attributes: {
      mic: {name:'MIC'},
      name: {name:'Name'},
      acronym: {name:'Acronym'},
      yahooIdentifier: {name:'Yahoo Identifier'},
      googleIdentifier: {name:'Google Identifier'},
      Country: {name:'Country', default:'US'},
      city: {name:'City'},
      website: {name:'Website'},
    },
    endpoint: 'exchange',
    name: 'Exchanges',
    sorting: {field:'mic', direction:'asc'},
    isEditable: session ? user.role==='admin' : false
  }
  const records = await db.exchange.findMany({
    orderBy: {mic: 'asc'},
    include: {Country:true}
  })
  for (const record of records) {
    // @ts-ignore
    record.Country.value = record.Country.code
  }
  return {entity, records}
}