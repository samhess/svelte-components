<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import {editRecord} from '$lib/components/Snippets.svelte'

  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Currencies</h1>
  <DataTable {entity} {records}>
    {#snippet tbody(records: any)}
      {#each records as record}
        <tr>
          <td>{record.code}</td>
          <td>{record.name}</td>
          <td>{record.issuer}</td>
          <td>{record.Country.map(({code}: any) => code).join(', ')}</td>
          {#if entity.isEditable}
            {@render editRecord(entity.key, {code: record.code})}
          {/if}
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
