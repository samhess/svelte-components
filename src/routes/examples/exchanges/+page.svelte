<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import {editRecord} from '$lib/components/Snippets.svelte'

  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Exchanges</h1>
  <DataTable {entity} {records}>
    {#snippet tbody()}
      {#each records as { mic, name, acronym, yahooIdentifier, googleIdentifier, country, city, website, timezone }}
        <tr>
          <td>{mic}</td>
          <td>{name}</td>
          <td>{acronym}</td>
          <td>{yahooIdentifier}</td>
          <td>{googleIdentifier}</td>
          <td>{country}</td>
          <td>{city}</td>
          <td><a href="http://{website}" target="_blank">{website}</a></td>
          {#if timezone}
            {@const time = new Date().toLocaleTimeString(undefined, {
              timeZone: timezone,
              timeStyle: 'short'
            })}
            <td class="text-end">{time}</td>
          {:else}
            <td></td>
          {/if}
          {#if entity.isEditable}
            <td class="w-1/16 text-end">
              {@render editRecord(entity.key, {mic})}
            </td>
          {/if}
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
