<script>
  import DataTable from '$lib/components/DataTable.svelte'
  import {invalidateAll} from '$app/navigation'
  
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
</article>
<div class="mt-6">
<DataTable {entity} {records} update={()=>invalidateAll()}>
  {#snippet children({ records, rowDblClick })}
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
        <td class="text-end">{record.timezone ? new Date().toLocaleTimeString('default',{timeZone:record.timezone,timeStyle:'short'}) : ''}</td>
      </tr>
    {/each}
  {/snippet}
</DataTable>
</div>