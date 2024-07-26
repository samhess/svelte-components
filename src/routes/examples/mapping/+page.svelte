<script>
  import DataTable from '$lib/components/DataTable.svelte'
  import { invalidateAll } from '$app/navigation'
  export let data
  $: ({entity, records} = data)
</script>

<article class="prose">
  <h1>GICS to ICB Mapping</h1>
  <DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
    <svelte:fragment let:records let:rowDblClick>
      {#each records as record}
        <tr on:dblclick={()=>rowDblClick(record)}>
          <td>{record.gicsCode} - {record.Gics.name}</td>
          <td>{record.icbCode} - {record.Icb.name}</td>
          <td>{record.yahooIndustry}</td>
        </tr>
      {/each}
    </svelte:fragment>
  </DataTable>
</article>
