import db from '$lib/server/database.js'

export async function load({locals}) {
  const {session, user} = locals
  const entity = { 
    name:'GICS Taxonomy',
    attributes:[
      {key:'code', name:'Code' },
      {key:'GicsSector', name:'Sector'},
      {key:'GicsIndustryGroup', name:'Industry Group'},
      {key:'GicsIndustry', name:'Industry'},
      {key:'name', name:'Subindustry'},
      {key:'description', name:'Description'}
    ],
    sorting: {field:'code'},
    isEditable: session ? user.role==='admin' : false
  }
  const records = await db.gics.findMany(
    {include: {GicsIndustry:true, GicsIndustryGroup:true, GicsSector:true}}
  )
  for (const record of records) {
    // @ts-ignore
    record.GicsSector.value = record.GicsSector.code
    // @ts-ignore
    record.GicsIndustry.value = record.GicsIndustry.code
    // @ts-ignore
    record.GicsIndustryGroup.value = record.GicsIndustryGroup.code
  }
  return { entity, records }
}