<script>
  import { invalidate } from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  /** @type {Object.<string, any>} */
  export let data = {}
  $: ({entity, records} = data)
</script>
  
<article class="prose">
  <h1>Exchanges</h1>
  <p>Current New York time is {new Date().toLocaleTimeString('en-US', { timeZone: "America/New_York" })}</p>
  <DataTable {entity} {records} on:updateData={()=>invalidate('/api/exchange')}>
    <svelte:fragment let:records let:rowDblClick>
      {#each records as record}
        <tr on:dblclick={()=>rowDblClick(record)}>
          <td>{record.mic}</td>
          <td>{record.name}</td>
          <td>{record.acronym}</td>
          <td>{record.yahooIdentifier}</td>
          <td>{record.googleIdentifier}</td>
          <td>{record.countryCode}</td>
          <td>{record.city}</td>
          <td><a href="http://{record.website}" target="_blank">{record.website}</a></td>
        </tr>
      {/each}
    </svelte:fragment>
  </DataTable>
</article>