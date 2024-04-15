<script>
  import { onMount } from 'svelte'
  import { Chart, LinearScale, Tooltip, Title, Legend } from 'chart.js'
  import sankeyChart from 'chartjs-chart-sankey'
  const {SankeyController, Flow} = sankeyChart
  /** @type {Object.<string,any>} */
  export let data
  export let caption = ''
  /** @type {HTMLCanvasElement} */
  let canvas
  /** @type {Chart} */
  let chart

  /** @type {Object.<string,any>} */
  const chartData = {
    datasets: [
      {
        label: 'Dataset 1',
        data: [],
        colorFrom: 'green',
        // @ts-ignore
        colorTo: context => context?.raw?.color,
        colorMode: 'gradient', // or 'from' or 'to'
        size: 'max', // or 'min' if flow overlap is preferred
      }
    ]
  }

  /**
   * @param {Object<string,any>[]} flows
   */
  function formatFlows(flows) {
    for (const [index, entry] of flows.entries()) {
      const amount = Math.abs(entry.flow)/1_000_000
      flows[index].flow = parseFloat(amount.toFixed(1)) ?? 0
    }
    return flows
  }

  /**
   * @param {Object.<string,string>[]} flows
   */
  function getColum(flows) {
    let column = {}
    for (const flow of flows) {
      if (flow.column !== undefined) {
        // @ts-ignore
        column[flow.to] = flow.column
      }
    }
    return column
  }

  function init() {
    Chart.register(SankeyController, Flow, LinearScale, Tooltip, Title, Legend)
    Chart.defaults.font.size = 14
    Chart.defaults.font.style = 'italic'
    /** @type {import('chart.js').ChartConfiguration} */
    const config = {
      type: 'sankey',
      // @ts-ignore
      data: chartData,
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            text: 'Sankey chart'
          },
        }
      }
    }
    chart = new Chart(canvas, config)
  }

  function updateChartData() {
    if (chart) {
      if (Array.isArray(data)) {
        // @ts-ignore
        chartData.datasets[0].data = formatFlows(data)
        chartData.datasets[0].column = getColum(data)
        chart.update()
      }
    } else {
      console.log('Chart is not ready')
    }
  }

  onMount(init)

  $: data, updateChartData()
</script>

<figure>
  <div class="w-100 mt-5 min-h-[50vh] max-h-96">
    <canvas bind:this={canvas}></canvas>
  </div>
  <figcaption class="figure-caption">{caption}</figcaption>
</figure>


