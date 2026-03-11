<script lang="ts">
  import type {PageProps} from './$types.ts'
  import {page} from '$app/state'
  import EditForm from '$lib/components/EditForm.svelte'
  const {data, form}: PageProps = $props()
  const {fields, record, action} = $derived(data)
  const entityName = page.params.entity?.replace(/^\w/, (c) => c.toUpperCase())
</script>

<article class="prose">
  {#if action === 'update' && record}
    <h1>Edit {entityName}</h1>
    <EditForm {fields} {record} {action}></EditForm>
  {:else}
    <h1>Create {entityName}</h1>
    <EditForm {fields} {record} {action}></EditForm>
  {/if}
</article>
