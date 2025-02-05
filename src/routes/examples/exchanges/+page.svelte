<script>
  import { invalidate } from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  
  /**
   * @typedef {Object} Props
   * @property {Object.<string, any>} [data]
  */

  /** @type {Props} */
  let {data={}} = $props()
  let {entity, records} = $derived(data)
</script>
  
<article class="prose">
  <h1>Exchanges</h1>
  <p class="lead">New York time is {new Date().toLocaleTimeString('default', {timeZone:'America/New_York', timeStyle:'short'})}</p>
</article>
<div class="mt-6">
  <DataTable {entity} {records} update={()=>invalidate('/api/exchange')}>
    {#snippet children({records, rowDblClick})}
      {#each records as record}
        <tr ondblclick={()=>rowDblClick(record)}>
          <td>{record.mic}</td>
          <td>{record.name}</td>
          <td>{record.acronym}</td>
          <td>{record.yahooIdentifier}</td>
          <td>{record.googleIdentifier}</td>
          <td>{record.country}</td>
          <td>{record.city}</td>
          <td><a href="http://{record.website}" target="_blank">{record.website}</a></td>
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</div>