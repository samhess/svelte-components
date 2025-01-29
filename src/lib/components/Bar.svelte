<script>
  import { onMount } from 'svelte'
  import { Chart, LinearScale, CategoryScale, BarController, BarElement, Legend, Title, Tooltip } from 'chart.js'
  
  /**
   * @typedef {Object} Props
   * @property {Object<string,any>} [data]
   * @property {string} [caption]
   */

  /** @type {Props} */
  let {
    data = {},
    caption = '',
  } = $props()
  /** @type {HTMLCanvasElement} */
  let canvas
  /** @type {Chart} */
  let chart

  const dummyData = {
    labels: [ '2021', '2022', '2023', '2024' ],
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
      data: dummyData,
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
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || ''
                  if (label) {
                      label += ': '
                  }
                  // @ts-ignore
                  if (context.parsed.y !== null) {
                    // @ts-ignore
                    label += new Intl.NumberFormat('default', {style:'currency', currency:'USD', notation:'compact', maximumFractionDigits:3}).format(context.parsed.y)
                  }
                  return label
              }
            }
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
      chart.data.datasets = data.datasets
      chart.data.labels = data.labels
      chart.update()
    } else {
      console.error('Chart is not ready')
    }
	})
</script>

<figure>
  <div class="max-h-60 min-h-[40vh] mt-5">
    <canvas bind:this={canvas}></canvas>
  </div>
  <figcaption class="figure-caption">{caption}</figcaption>
</figure>


