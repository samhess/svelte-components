<script>
  /** @type {import('./$types').PageData} */
  import {DataTable} from '@samhess/svelte-components'
  //export let data;
  const entity = {
    attributes: [
      { key:'code', name:'Alpha-2 code', align:'left' },
      { key:'name', name:'Name' },
      { key:'region', name:'Region' },
      { key:'currencyCode', name:'Primary currency' }
    ],
    endpoint: 'country',
    name: 'Countries',
    sorting: {field:'code'},
    isEditable: true
  }
  const records = [{
    code: 123,
    name: 'foo',
    region: 'EU',
    currencyCode: 'CHF'
  }]
</script>
<article class="prose">
  <h1>Tables</h1>
  <h2>DataTable</h2>
  <DataTable {entity} {records}></DataTable>
  <h2>EditDialog</h2>
</article>
