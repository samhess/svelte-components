<script lang="ts">
  import type {Snippet} from 'svelte'
  import type {GenericObject} from '$lib/types.ts'
  import {ArrowUpDown} from '@lucide/svelte'
  import {createRecord} from '$lib/components/Snippets.svelte'
  export type TableProps = {
    caption?: String
    entity: {
      attributes: GenericObject
      isEditable?: boolean
      key: string
      name?: string
      sorting?: {field: string; direction: string}
    }
    records: Array<any>
    tbody?: Snippet
  }

  let {caption, entity, records, tbody}: TableProps = $props()

  let isEditable = $derived(entity.isEditable)
  let defaultSorting = $derived(entity.sorting ?? {field: 'name', direction: 'asc'})
  let forceRender = $state(1)
  // svelte-ignore state_referenced_locally
  let sorting = $state(defaultSorting)

  function toggleSorting(field: string) {
    const direction = sorting.direction === 'asc' ? 'desc' : 'asc'
    forceRender = sortRecords({field, direction})
    sorting = {field, direction}
  }

  function sortRecords({field, direction}: GenericObject) {
    console.log(`sorting ${field} ${direction}`)
    const sortCode = direction === 'asc' ? 1 : -1
    records.sort((A, B) => {
      let a = A[field] ?? ''
      let b = B[field] ?? ''
      if (typeof a === 'object' && typeof b === 'object') {
        a = a.name
        b = b.name
      }
      if (typeof a === 'string' && typeof b === 'string') {
        const compareResult = a.localeCompare(b, undefined, {sensitivity: 'base'})
        return compareResult * sortCode
      }
      if (a === b) return 0
      return a > b ? sortCode : -sortCode
    })
    return new Date().valueOf()
  }
</script>

<table class="datatable">
  {#if caption}
    <caption class="text-center">{caption}</caption>
  {/if}
  <thead>
    <tr class="bg-gray-200">
      {#each Object.entries(entity.attributes) as [key, attribute]}
        <th
          class={`${sorting.field == key ? 'underline' : ''} ${attribute.align === 'right' ? 'text-end' : ''}`}
          onclick={(e) => toggleSorting(key)}
        >
          {attribute.name}
          <ArrowUpDown size={12} class="ms-0.5 inline-block" />
        </th>
      {/each}
      {#if isEditable}
        <th class="w-1/16 text-end">
          {@render createRecord(entity.key)}
        </th>
      {/if}
    </tr>
  </thead>
  <tbody>
    {#key forceRender}
      {#if tbody}
        {@render tbody()}
      {:else}
        {#each records as record}
          <tr>
            {#each Object.entries(record).filter(([key, value]) => typeof value !== 'object') as [key, value]}
              <td>{typeof value !== 'object' ? value : 'obj'}</td>
              {#if isEditable}
                {@render createRecord(entity.key)}
              {/if}
            {/each}
          </tr>
        {/each}
      {/if}
    {/key}
  </tbody>
</table>
