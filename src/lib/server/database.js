import { PrismaClient } from '@prisma/client'
const db = new PrismaClient({
  log: [] // ['info', 'warn', 'error','query']
})

/*
db.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})*/

// https://stackoverflow.com/questions/75947475/prisma-typeerror-do-not-know-how-to-serialize-a-bigint
// https://github.com/prisma/prisma/issues/16144
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// @ts-ignore
/*
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString())
  return int ?? this.toString()
}*/

export default db