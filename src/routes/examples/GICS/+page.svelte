<script>
  import DataTable from '$lib/components/DataTable.svelte'
  /** @type {Object.<string, any>} */
  export let data
  let {entity, records} = data
</script>

<article class="prose">
  <h1>Global Industry Classification Standard</h1>
  <p>The Global Industry Classification Standard (GICS) is an industry taxonomy developed in 1999 by MSCI and Standard & Poor's (S&P) for use by the global financial community. 
    The GICS structure consists of 11 sectors, 25 industry groups, 76 industries and 170 sub-industries
    into which S&P has categorized all major public companies. 
    The system is similar to <a href="/taxonomy/ICB">Industry Classification Benchmark (ICB)</a>.
  </p>
  <DataTable {entity} {records}>
    <svelte:fragment let:records let:rowDblClick>
      {#each records as record}
        <tr on:dblclick={()=>rowDblClick(record)}>
          <td>{record.code}</td>
          <td>{record.GicsSector.name}</td>
          <td>{record.GicsIndustryGroup.name}</td>
          <td>{record.GicsIndustry.name}</td>
          <td>{record.name}</td>
          <td>{record.description}</td>
        </tr>
      {/each}
    </svelte:fragment>
  </DataTable>
</article>
