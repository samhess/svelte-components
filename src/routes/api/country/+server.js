//import db from '$lib/server/database.js'
import { json } from '@sveltejs/kit'

export async function GET() {
  const countries = [] /* await db.country.findMany({
    orderBy: {code: 'asc'},
    include: {Currency:true}
  })*/
  return json(countries)
}

export async function POST({request}) {
  const data = await request.json()
  console.log(data)
  const record = {} // await db.country.create({data})
  return json(record)
}

export async function PUT({request}) {
  const data = await request.json()
  console.log(data)
  const record = {} // await db.country.update({data, where:{code:data.code}})
  return json(record)
}

export async function DELETE({request}) {
  const data = await request.json()
  console.log(data)
  const record = {} // await db.country.delete({where:{code:data.code}})
  return json(record)
}