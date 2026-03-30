<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import {editRecord} from '$lib/components/Snippets.svelte'

  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Global Industry Classification Standard</h1>
  <p class="lead">
    The Global Industry Classification Standard (GICS) is an industry taxonomy developed in 1999 by
    MSCI and Standard & Poor's (S&P) for use by the global financial community. The GICS structure
    consists of 11 sectors, 25 industry groups, 76 industries and 163 sub-industries into which S&P
    has categorized all major public companies.
  </p>
  <DataTable {entity} {records}>
    {#snippet tbody()}
      {#each records as record}
        <tr>
          <td>{record.code}</td>
          <td>{record.name}</td>
          <td>{record.description}</td>
          <td>{record.Industry.name}</td>
          <td>{record.IndustryGroup.name}</td>
          <td>{record.Sector.name}</td>
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
