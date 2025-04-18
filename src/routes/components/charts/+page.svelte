<script lang="ts">
  import Treemap from '$lib/components/Treemap.svelte'

  let {data} = $props()
  let {records, structure, grouping, evaluation} = $derived(data)
</script>

<article class="prose">
  <h1>Charts</h1>
  <h2>TreeMap</h2>
  <Treemap data={records} {structure} {grouping} {evaluation}></Treemap>
</article>
