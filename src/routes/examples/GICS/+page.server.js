import db from '$lib/server/database.js'

export async function load({locals}) {
  const {session, user} = locals
  const entity = { 
    attributes:{
      code: {name:'Code', edit:false},
      name: {name:'Subindustry'},
      description: {name:'Description'},
      Industry: {name:'Industry', key:'code'},
      IndustryGroup: {name:'Industry Group', key:'code'},
      Sector: {name:'Sector', key:'code'}
    },
    endpoint: 'gics',
    isEditable: session ? user.role==='admin' : false,
    name: 'GICS Taxonomy',
    sorting: {field:'code'}
  }
  const records = await db.gics.findMany(
    {include: {Industry:true, IndustryGroup:true, Sector:true}}
  )
  return { entity, records }
}