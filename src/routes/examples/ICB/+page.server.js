import db from '$lib/server/database.js'

export async function load({locals}) {
  const {session, user} = locals
  const entity = { 
    attributes: {
      code: {name:'Code', edit:false},
      name: {name:'Subsector'},
      description: {name:'Description'},
      Sector: {name:'Sector', key:'code'},
      SuperSector: {name:'Supersector', key:'code'},
      Industry: {name:'Industry', key:'code'}
    },
    endpoint: 'icb',
    isEditable: session ? user.role==='admin' : false,
    name: 'ICB Taxonomy',
    sorting: {field:'code'},
  }
  /** @type {Object<string,any>[]} */
  const records = await db.icb.findMany(
    {include: {Industry:true, SuperSector:true, Sector:true}}
  )
  return {entity, records}
}