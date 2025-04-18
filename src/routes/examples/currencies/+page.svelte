<script>
  // @ts-nocheck
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'

  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Currencies</h1>
  <DataTable {entity} {records} on:updateData={() => invalidateAll()}>
    {#snippet children({records, rowDblClick})}
      {#each records as record}
        <tr ondblclick={() => rowDblClick(record)}>
          <td>{record.code}</td>
          <td>{record.name}</td>
          <td>{record.issuer}</td>
          <td>{record.Country.map(({code}) => code).join(', ')}</td>
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
