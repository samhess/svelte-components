<script>
  import DataTable from '$lib/components/DataTable.svelte'
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
    },
    {
      code: 'DE',
      name: 'Germany',
      region: 'Europa',
      currency: 'EUR'
    },
    {
      code: 'US',
      name: 'United States of America',
      region: 'America',
      currency: 'USD'
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
