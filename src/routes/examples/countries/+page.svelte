<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import {editRecord} from '$lib/components/Snippets.svelte'

  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Countries</h1>
  <DataTable {entity} {records}>
    {#snippet tbody()}
      {#each records as record}
        <tr>
          <td>{record.code}</td>
          <td>{record.name}</td>
          <td>{record.region}</td>
          <td>{record.Currency.name} ({record.currency})</td>
          {#if entity.isEditable}
            <td class="w-1/16 text-end">
              {@render editRecord(entity.key, {code: record.code})}
            </td>
          {/if}
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
