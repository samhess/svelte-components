<script>
  import EditDialog from '$lib/components/EditDialog.svelte'
  import { capitalize } from '$lib/helpers'
  
  /**
   * @typedef {Object} Props
   * @property {Object<string,any>} entity
   * @property {Object<any,any>[]} records
   * @property {import('svelte').Snippet<[any]>} [beforeHeader]
   * @property {import('svelte').Snippet} [header]
   * @property {import('svelte').Snippet<[any]>} [children]
   * @property {import('svelte').Snippet} [footer]
   * @property {function} update
   */

  /** @type {Props} */
  let {
    entity,
    records,
    beforeHeader,
    header,
    children,
    footer,
    update
  } = $props()
  let {
    name = '', 
    attributes = {}, 
    isEditable = false,
    sorting = {field:'name', direction:'asc'},
    endpoint = ''
  } = $state(entity)
  let caption = $derived(`${capitalize(name)} (${records.length})`)
  let sortedRecords = $derived(sortRecords(sorting))
  let editDialog = $state()

  function rowDblClick(record={}) {
    if (isEditable) {
      editDialog.editItem(record)
    }
  }

  function addItem() {
    editDialog.addItem()
  }

  function toggleSorting(field='name') {
    sorting.field = field
    sorting.direction = sorting.direction==='asc' ? 'desc' : 'asc'
  }

  function sortRecords({field='name', direction='asc'}) {
    //$inspect(records)
    //console.log(`sorting ${field} ${direction}`)
    const sortCode = direction==='asc' ? 1 : -1
    if (Array.isArray(records)) {
      return records.toSorted((A,B) => {
        let a = A[field] ?? ''
        let b = B[field] ?? ''
        if (typeof a === 'object' && typeof b === 'object') {
          a = a.name
          b = b.name
        }
        if (typeof a === 'string' && typeof b === 'string') {
          const compareResult = a.localeCompare(b, undefined, {sensitivity:'base'})
          return compareResult * sortCode
        }
        if (a === b) return 0
        return (a > b) ? sortCode : -sortCode
      })
    } else {
      console.log(`empty records`)
      return []
    }
  }
</script>

{#if isEditable===true}
  <EditDialog entity={{name,endpoint,attributes}} bind:this={editDialog} edit={update}></EditDialog>
{/if}
<table class="table">
  <caption class="text-center">{caption}</caption>
  <thead>
    {#if beforeHeader}{@render beforeHeader({ addItem, })}{:else}
      {#if isEditable===true}
        <tr>
          <td colspan={Object.keys(attributes).length} class="text-end pb-3">
            <button class="btn btn-primary" onclick={()=>addItem()}>Add</button>
          </td>
        </tr>
      {/if}
    {/if}
    {#if header}{@render header()}{:else}
      <tr class="bg-gray-200">
        {#each Object.entries(attributes) as [key,props]}
          {#if props.show !== false}
            <th class:text-end={props.align==='right'} onclick={()=>toggleSorting(key)}>
              {props.name}
              <a aria-label="sort" href="#sort">
                <svg class="w-3 h-3 mb-1 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                </svg>
              </a>
            </th>
          {/if}
        {/each}
      </tr>
    {/if}
  </thead>
  <tbody>
    {#if children}{@render children({records:sortedRecords, rowDblClick})}{:else}
      {#each sortedRecords as record}
        <tr ondblclick={()=>rowDblClick(record)}>
          {#each Object.values(record) as value}
            <td>{value}</td>
          {/each}
        </tr>
      {/each}
    {/if}
  </tbody>
  <tfoot>
    {@render footer?.()}
  </tfoot>
</table>