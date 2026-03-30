<script module lang="ts">
  import {PenLine, Plus} from '@lucide/svelte'
  import type {GenericObject} from '$lib/types.ts'
  // Export the snippets from the module script
  export {createRecord, editRecord}
</script>

<!-- Define the snippets in the markup -->
{#snippet createRecord(entity: string)}
  <a href={`/crud/${entity}`}>
    <Plus class="inline" />
  </a>
{/snippet}

{#snippet editRecord(entity: string, record: GenericObject, path = '/crud')}
  {#if path === '/crud'}
    {#if typeof record === 'object'}
      {@const searchParams = new URLSearchParams(record)}
      <a href={`${path}/${entity}?${searchParams.toString()}`}>
        <PenLine class="inline" size={18} />
      </a>
    {:else}
      <td class="w-1/16 text-end text-red-600"> Record key must be object </td>
    {/if}
  {:else}
    {@const searchParams = new URLSearchParams(record)}
    <td class="w-1/16 text-end">
      <a href={`${path}/${searchParams.values().next().value}/?${searchParams.toString()}`}>
        <PenLine class="inline" size={18} />
      </a>
    </td>
  {/if}
{/snippet}
