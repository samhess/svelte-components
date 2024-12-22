# Sam's Svelte Components

* [Address Autocompletion](src/routes/components/forms)
* [DataTable](src/routes/components/tables)
* [TreeMap](src/routes/components/charts)

The components code can be found in [src/lib/components](src/lib/components)

## Demo
Find a [demo](https://svelte-components-black.vercel.app) on Vercel.

## Installation
```bash
npm install @samhess/svelte-components
```

## Usage
### Address Autocompletion
```html
<script>
  import {AddressInput} from '@samhess/svelte-components'
  
  /** @type {Props} */
  let {data} = $props()
  let {mapbox} = $derived(data)

  let address = $state({
    postcode: '', 
    city: '', 
    state: '', 
    country: ''
  })
</script>

<form>
  <AddressInput mapboxOptions={mapbox} deliver={(results={})=>{Object.assign(address,results)}}>
  </AddressInput>
</form>
```

### DataTable
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
    This is a sortable (click on column in table header) and optionally editable (double click on table row) data table.
  </p>
  <DataTable {entity} {records} update={()=>invalidateAll()}>
  </DataTable>
</article>
```

### TreeMap
```html
<script>
  import {Treemap} from '@samhess/svelte-components'
  const data = [
    {
      name: 'GOOG',
      marketCap: 200,
      performance1d: 2,
      type: 'stock'
    }
  ]
  const evaluation = 'performance1d'
  const structure = 'marketCap'
  const grouping = ['type', 'name']
</script>
<article class="prose">
  <h1>Charts</h1>
  <h2>TreeMap</h2>
  <Treemap {data} {structure} {grouping} {evaluation}>
  </Treemap>
</article>
```