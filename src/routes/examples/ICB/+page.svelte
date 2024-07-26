<script>
  import DataTable from '$lib/components/DataTable.svelte'
  /** @type {Object<string, any>} */
  export let data
  let {entity, records} = data
</script>

<article class="prose">
  <h1>ICB Industry Classification</h1>
  <p>The Industry Classification Benchmark (ICB) is an industry classification taxonomy launched by Dow Jones
     and FTSE in 2005 and now used by FTSE International and STOXX. It is used to segregate markets into sectors
      within the macroeconomy. The ICB uses a system of 11 industries, partitioned into 20 supersectors, 
      which are further divided into 45 sectors, which then contain 173 subsectors.
  </p>
  <DataTable {entity} {records}>
    <svelte:fragment let:records let:rowDblClick>
      {#each records as record}
        <tr on:dblclick={()=>rowDblClick(record)}>
          <td>{record.code}</td>
          <td>{record.IcbSector.name}</td>
          <td>{record.IcbSupersector.name}</td>
          <td>{record.IcbIndustry.name}</td>
          <td>{record.name}</td>
          <td>{record.description}</td>
        </tr>
      {/each}
    </svelte:fragment>
  </DataTable>
</article>
