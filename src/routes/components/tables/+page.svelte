<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import {editRecord} from '$lib/components/Snippets.svelte'

  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Tables</h1>
  <h2>DataTable</h2>
  <p class="lead">
    This is a sortable (click on column in table header) and optionally editable (double click on
    table row) data table.
  </p>
</article>
<div class="mt-6">
  <DataTable {entity} {records}>
    {#snippet children(records: any)}
      {#each records as record}
        <tr>
          <td>{record.code}</td>
          <td>{record.name}</td>
          <td>{record.region}</td>
          <td>{record.Currency.name} ({record.currency})</td>
          {#if entity.isEditable}
            {@render editRecord(entity.key, {code: record.code})}
          {/if}
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</div>
