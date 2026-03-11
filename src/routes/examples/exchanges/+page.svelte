<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import {editRecord} from '$lib/components/Snippets.svelte'

  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Exchanges</h1>
  <DataTable {entity} {records}>
    {#snippet tbody(records: any)}
      {#each records as record}
        <tr>
          <td>{record.mic}</td>
          <td>{record.name}</td>
          <td>{record.acronym}</td>
          <td>{record.yahooIdentifier}</td>
          <td>{record.googleIdentifier}</td>
          <td>{record.country}</td>
          <td>{record.city}</td>
          <td><a href="http://{record.website}" target="_blank">{record.website}</a></td>
          <td class="text-end"
            >{record.timezone
              ? new Date().toLocaleTimeString('default', {
                  timeZone: record.timezone,
                  timeStyle: 'short'
                })
              : ''}</td
          >
          {#if entity.isEditable}
            {@render editRecord(entity.key, {mic: record.mic})}
          {/if}
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
