<script>
  import DataTable from '$lib/components/DataTable.svelte'
  import {invalidateAll} from '$app/navigation'

  /**
   * @typedef {Object} Props
   * @property {Object.<string, any>} data
  */

  /** @type {Props} */
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>
<article class="prose">
  <h1>Tables</h1>
  <h2>DataTable</h2>
  <p class="lead">
    This is a sortable (click on column in table header) and optionally editable (double click on table row) data table.
  </p>
</article>
<div class="mt-6">
  <DataTable {entity} {records} update={()=>invalidateAll()}>
    {#snippet children({records, rowDblClick})}
      {#each records as record}
        <tr ondblclick={()=>rowDblClick(record)}>
          <td>{record.code}</td> 
          <td>{record.name}</td>
          <td>{record.region}</td>
          <td>{record.Currency.name} ({record.currency})</td>
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</div>
