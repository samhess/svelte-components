# Svelte Component for Treemap Chart

This is a implementation of a data table component.

## Demo

[Demo](https://svelte-components-black.vercel.app/components/tables)

## Installation

```bash
npm install @samhess/svelte-components
```

## Usage

```html
<script>
  import DataTable from '$lib/components/DataTable.svelte'
  import {invalidateAll} from '$app/navigation'

  /** @type {Props} */
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>
<article class="prose">
  <h1>Tables</h1>
  <h2>DataTable</h2>
  <p>
    This is a sortable (click on column in table header) and optionally editable (double click on
    table row) data table.
  </p>
  <DataTable {entity} {records} update="{()" =""
    >invalidateAll()}> {#snippet children({records, rowDblClick})} {#each records as record}
    <tr ondblclick="{()" ="">
      rowDblClick(record)}>
      <td>{record.code}</td>
      <td>{record.name}</td>
      <td>{record.region}</td>
      <td>{record.Currency.name} ({record.currency})</td>
    </tr>
    {/each} {/snippet}
  </DataTable>
</article>
```

## Properties

| Property |   Type   |           Description           | Required | Default |
| :------: | :------: | :-----------------------------: | :------: | :-----: |
|  entity  |  Object  | The specification of the entity |   Yes    |         |
| records  | Object[] |         The table data          |   Yes    |   ''    |

Please refer to [chartjs-chart-treemap](https://chartjs-chart-treemap.pages.dev/) for further information.
