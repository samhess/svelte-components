<script>
  import { onMount } from 'svelte'
  import { Chart, LinearScale, CategoryScale, BarController, BarElement, Legend, Title, Tooltip } from 'chart.js'
  
  
  /**
   * @typedef {Object} Props
   * @property {Object.<string,any>[]} [data]
   * @property {string} [caption]
   * @property {Object.<string,any>} [title]
   * @property {string} [period]
   */

  /** @type {Props} */
  let {
    data = [],
    caption = '',
    title = { name:'', ticker:'' },
    period = ''
  } = $props()
  /** @type {HTMLCanvasElement} */
  let canvas
  /** @type {Chart} */
  let chart

  let caption1 = $derived(`${title.name} (${title.ticker}) ${period} income statement`) 


  const chartData = {
    labels: [ '2019', '2020', '2021', '2022' ],
    datasets: [
      {
        label: 'Revenue',
        data: [10, 20, 30, 40],
        backgroundColor: 'blue',
        borderWidth: 1
      },
      {
        label: 'Earnings',
        data: [1, 2, 3, 4],
        backgroundColor: 'darkorange',
        borderWidth: 1
      }
    ]
  }


  function init() {
    Chart.register(LinearScale, CategoryScale, BarController, BarElement, Legend, Title, Tooltip)
    Chart.defaults.font.size = 14
    /** @type {import('chart.js').ChartConfiguration} */
    const config = {
      type: 'bar',
      data: chartData,
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
          },
          title: {
            display: false,
            text: 'Revenues and Earnings'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenues and Earnings',
              font: {
                size: 18,
                style: 'normal'
              }
            },
            ticks: {
              /** @param {*} value */
              callback: function(value) {
                  return value/1000000000+' B'
              }
            }                    
          }
        }
      },
    }
    chart = new Chart(canvas, config)
  }

  onMount(init)

  $effect(() => {
    if (chart) {
      if (Array.isArray(data)) {
        chartData.datasets[0].data = [
          data[3].totalRevenue.raw,
          data[2].totalRevenue.raw,
          data[1].totalRevenue.raw,
          data[0].totalRevenue.raw
        ]
        chartData.datasets[0].label = 'Revenue'
        chartData.datasets[1].data = [
          data[3].netIncome.raw,
          data[2].netIncome.raw,
          data[1].netIncome.raw,
          data[0].netIncome.raw
        ]
        chartData.datasets[1].label = 'Earnings'
        chartData.labels = [
          new Date(1000*data[3].endDate.raw).toLocaleDateString(),
          new Date(1000*data[2].endDate.raw).toLocaleDateString(),
          new Date(1000*data[1].endDate.raw).toLocaleDateString(),
          new Date(1000*data[0].endDate.raw).toLocaleDateString()
        ]
        chart.update()
      }
    } else {
      console.log('Chart is not ready')
    }
	})
</script>

<figure>
  <div class="max-h-60 min-h-[40vh] mt-5">
    <canvas bind:this={canvas}></canvas>
  </div>
  <figcaption class="figure-caption">{caption1}</figcaption>
</figure>


