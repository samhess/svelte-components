<script>
  // @ts-nocheck
  import { invalidateAll } from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'

  export let data
  $: ({entity, records} = data)
</script>

<article class="prose">
  <h1>Currencies</h1>
  <DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
    <svelte:fragment let:records let:rowDblClick>
      {#each records as record}
        <tr on:dblclick={()=>rowDblClick(record)}>
          <td>{record.code}</td>
          <td>{record.name}</td>
          <td>{record.issuer}</td>
          <td>{record.Country.map(({code})=>code).join(', ')}</td>
        </tr>
      {/each}
    </svelte:fragment>
  </DataTable>
</article>

