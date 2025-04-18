<script>
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'

  /**
   * @typedef {Object} Props
   * @property {Object.<string, any>} data
   */

  /** @type {Props} */
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Countries</h1>
  <DataTable {entity} {records} update={() => invalidateAll()}>
    {#snippet children({records, rowDblClick})}
      {#each records as record}
        <tr ondblclick={() => rowDblClick(record)}>
          <td>{record.code}</td>
          <td>{record.name}</td>
          <td>{record.region}</td>
          <td>{record.Currency.name} ({record.currency})</td>
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
