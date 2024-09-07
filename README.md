# Sam's Svelte Components

* [Address Autocompletion](src/routes/components/forms)
* [DataTable](src/routes/components/tables)
* [HeroIcons](src/routes/components/icons)
* [TreeMap](src/routes/components/charts)

## Demo
Find a [demo](https://svelte-components-black.vercel.app) on Vercel.

## Installation
```bash
npm install @samhess/svelte-components
```

## Usage
### DataTable
```html
<script>
  import {DataTable} from '@samhess/svelte-components'
  const entity = {
    attributes: [
      { key:'code', name:'Alpha-2 code', align:'left' },
      { key:'name', name:'Name' },
      { key:'region', name:'Region' },
      { key:'currency', name:'Currency' }
    ],
    endpoint: 'country',
    name: 'Countries',
    sorting: {field:'code'},
    isEditable: true
  }
  const records = [
    {
      code: 'CH',
      name: 'Switzerland',
      region: 'Europa',
      currency: 'CHF'
    }
  ]
</script>
<article class="prose">
  <h1>Tables</h1>
  <h2>DataTable</h2>
  <p>
    This is a sortable (click on column in table header) and optionally editable (double click on table row) data table.
  </p>
  <DataTable {entity} {records}></DataTable>
</article>
```

### AddressInput
```html
<AddressInput {mapboxOptions} on:addressSelect={(address)=>getAddress(address)}></AddressInput>

<script>
  import {AddressInput} from '@samhess/svelte-components'
  let postcode,city,state,country

  // mapbox options as per https://docs.mapbox.com/api/search/geocoding
  const mapboxOptions = {
    access_token : 'YOUR_TOKEN',
    limit : 5,
    language: 'en'
  }
  function getAddress(event) {
    const {address} = event.detail
    postcode = address.postcode
    city = address.city
    state = address.state
    country = address.country
  }
</script>
```

### TreeMap
```html
<script>
  import Treemap from '$lib/components/Treemap.svelte'
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