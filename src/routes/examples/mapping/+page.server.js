import db from '$lib/server/database.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({locals}) {
  const {session, user} = locals
  const entity = { 
    attributes: {
      Gics: {name:'GICS Subindustry', key:'code', default:10101010},
      Icb: {name:'ICB Subsector', key:'code', default:60101015},
      yahooIndustry: {name:'Yahoo Industry'}
    },
    endpoint: 'gics2icb',
    isEditable: session ? user.role==='admin' : false,
    name: 'GICS to ICB Mapping',
    sorting: {field:'gicsCode', direction:'asc'}
  }
  /** @type {Object<string,any>[]} */
  const records = await db.gicsToIcb.findMany({
    include: {Gics:true, Icb:true},
    orderBy: {gicsCode:'asc'}
  })  
  return {entity, records}
}