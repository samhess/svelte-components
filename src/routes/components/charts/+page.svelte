<script>
  import Treemap from '$lib/components/Treemap.svelte'
  const data = [
    {
      name: 'AAPL',
      marketCap: 200,
      performance1d: 1,
      type: 'stock'
    },
    {
      name: 'GOOG',
      marketCap: 200,
      performance1d: 2,
      type: 'stock'
    },
    {
      name: 'TSLA',
      marketCap: 100,
      performance1d: -1,
      type: 'stock'
    },
    {
      name: 'BTC',
      marketCap: 200,
      performance1d: 3,
      type: 'crypto'
    }
  ]
  const evaluation = 'performance1d'
  const structure = 'marketCap'
  const grouping = ['type', 'name']
</script>
<article class="prose">
  <h1>Charts</h1>
  <h2>TreeMap</h2>
  <Treemap {data} {structure} {grouping} {evaluation}>
  </Treemap>
</article>
