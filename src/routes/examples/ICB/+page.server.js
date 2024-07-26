import db from '$lib/server/database.js'

export async function load({locals}) {
  const {session, user} = locals
  const entity = { 
    attributes: [
      { key: 'code', name: 'Code'},
      { key: 'IcbIndustry', name: 'Industry'},
      { key: 'IcbSupersector', name: 'Supersector'},
      { key: 'IcbSector', name: 'Sector'},
      { key: 'name', name: 'Subsector'},
      { key: 'description', name: 'Description'}
    ],
    name: 'ICB Taxonomy',
    sorting: {field:'code'},
    isEditable: session ? user.role==='admin' : false
  }
  const records = await db.icb.findMany(
    {include: {IcbIndustry:true, IcbSupersector:true, IcbSector:true}}
  )
  for (const record of records) {
    // @ts-ignore
    record.IcbSector.value = record.IcbSector.code
    // @ts-ignore
    record.IcbIndustry.value = record.IcbIndustry.code
    // @ts-ignore
    record.IcbSupersector.value = record.IcbSupersector.code
  }
  return { entity, records }
}