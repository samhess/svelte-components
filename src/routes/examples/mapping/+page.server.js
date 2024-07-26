import db from '$lib/server/database.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({locals}) {
  const {session, user} = locals
  const entity = { 
    attributes: {
      Gics: {name:'GICS Subindustry' },
      Icb: {name:'ICB Subsector' },
      yahooIndustry: {name:'Yahoo Industry'}
    },
    name: 'GICS to ICB Mapping',
    endpoint: 'gics2icb',
    sorting: {field:'gicsCode', direction:'asc'},
    isEditable: session ? user.role==='admin' : false
  }
  const records = await db.gicsToIcb.findMany({
    include: {Gics:true, Icb:true},
    orderBy: {gicsCode:'asc'}
  })
  for (const record of records) {
    // @ts-ignore
    record.Gics.value = record.Gics.code
    // @ts-ignore
    record.Icb.value = record.Icb.code
  }
  return { entity, records }
}