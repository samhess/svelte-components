import type {PageServerLoadEvent} from './$types.js'

export async function load({locals}: PageServerLoadEvent) {
  const {session, user} = locals
  const records = [
    {
      name: 'Apple',
      ticker: 'AAPL',
      marketCap: 200,
      performance1d: 1,
      type: 'stock'
    },
    {
      name: 'Alphabet',
      ticker: 'GOOG',
      marketCap: 200,
      performance1d: 2,
      type: 'stock'
    },
    {
      name: 'Tesla',
      ticker: 'TSLA',
      marketCap: 100,
      performance1d: -1,
      type: 'stock'
    },
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      marketCap: 200,
      performance1d: 3,
      type: 'crypto'
    }
  ]
  const evaluation = 'performance1d'
  const structure = 'marketCap'
  const grouping = ['type', 'name']

  return {records, evaluation, structure, grouping}
}
