<script lang="ts">
  import {enhance} from '$app/forms'
  import type {GenericObject} from '../types.ts'
  type Props = {
    fields: GenericObject[]
    record: GenericObject
    action?: string
  }
  const props: Props = $props()
  const {fields, action = 'update'} = $derived(props)
  // svelte-ignore state_referenced_locally
  let record = $state(props.record)

  const capitalize = (str: string) => str.replace(/^\w/, (v) => v.toUpperCase())

  function getType(fieldName: string) {
    if (['instance'].includes(fieldName)) return 'number'
    return 'text'
  }
</script>

<form method="POST">
  {#each fields as field}
    {@const fieldname = field.name.replace(/^\w/, (c: string) => c.toLowerCase())}
    {#if !Array.isArray(field.options)}
      <label class="font-semibold">
        {capitalize(field.name)}
        {#if fieldname === 'description'}
          <textarea
            class="block font-normal"
            name={field.name}
            bind:value={record[fieldname]}
            rows="3"
            cols="134"
          >
          </textarea>
        {:else}
          <input
            step="any"
            type={getType(field.name)}
            name={field.name}
            bind:value={record[fieldname]}
            autoComplete="off"
          />
        {/if}
      </label>
    {:else}
      <label class="font-semibold">
        {capitalize(field.name)}
        <select name={fieldname} bind:value={record[fieldname]}>
          {#each field.options as { value, name }, index}
            <option {value}>
              {name}
            </option>
          {/each}
        </select>
      </label>
    {/if}
  {/each}
  {#if action === 'update'}
    <div class="my-6 flex justify-between">
      <button class="bg-red-500! hover:bg-red-600!" type="submit" formAction="?/delete">
        Delete
      </button>
      <button class="ms-2 text-white" type="submit" formAction={`?/${action}`}>
        {capitalize(action)}
      </button>
    </div>
  {:else}
    <div class="my-6 text-end">
      <button class="text-white" type="submit" formAction={`?/${action}`}>
        {capitalize(action)}
      </button>
    </div>
  {/if}
</form>
