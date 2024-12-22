<script>
  import DataTable from '$lib/components/DataTable.svelte'
  
  /**
   * @typedef {Object} Props
   * @property {Object.<string, any>} data
   */

  /** @type {Props} */
  let { data } = $props();
  let {entity, records} = data
</script>

<article class="prose">
  <h1>Global Industry Classification Standard</h1>
  <p>The Global Industry Classification Standard (GICS) is an industry taxonomy developed in 1999 by MSCI and Standard & Poor's (S&P) for use by the global financial community. 
    The GICS structure consists of 11 sectors, 25 industry groups, 76 industries and 170 sub-industries
    into which S&P has categorized all major public companies. 
    The system is similar to <a href="/taxonomy/ICB">Industry Classification Benchmark (ICB)</a>.
  </p>
  <DataTable {entity} {records} update={()=>{}}>
    {#snippet children({ records, rowDblClick })}
      {#each records as record}
        <tr ondblclick={()=>rowDblClick(record)}>
          <td>{record.code}</td>
          <td>{record.name}</td>
          <td>{record.description}</td>
          <td>{record.Industry.name}</td>
          <td>{record.IndustryGroup.name}</td>
          <td>{record.Sector.name}</td>
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
