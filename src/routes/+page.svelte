<script>
  import {DataTable} from '@samhess/svelte-components'
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
<h1>Welcome to my library project</h1>
<h2>Datatable</h2>
<DataTable {entity} {records}></DataTable>
