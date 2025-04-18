import db from '$lib/server/database.js'
import { json } from '@sveltejs/kit'

export async function GET() {
  const countries = await db.country.findMany({
    orderBy: {code: 'asc'},
    include: {Currency:true}
  })
  return json(countries)
}

export async function POST({request}) {
  const {code,name,region,Currency} = await request.json()
  const record = await db.country.create({
    data: {
      code,
      name,
      region,
      Currency: {connect:{code:Currency.value}}
    }
  })
  return json(record)
}

export async function PUT({request}) {
  const {code,name,region,Currency} = await request.json()
  const record = await db.country.update({
    where:{code},
    data: {
      code,
      name,
      region,
      Currency: {connect:{code:Currency.value}}
    }, 
  })
  return json(record)
}

export async function DELETE({request}) {
  const {code} = await request.json()
  const record = await db.country.delete({where:{code}})
  return json(record)
}