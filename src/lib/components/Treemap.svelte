<script lang="js">
  import { onMount } from 'svelte'
  import { Chart, LinearScale, Title, Tooltip, Legend } from 'chart.js'
  import { TreemapController, TreemapElement } from 'chartjs-chart-treemap'
  import { formatPercent, formatNumber } from '$lib/format.js'

  export let data = {}
  export let structure = 'marketCap'
  export let grouping = ['gicsSector', 'gicsIndustry', 'ticker']
  export let evaluation = 'performance1d'
  export let height = '60vh'
  /** @type {HTMLCanvasElement} */
  let canvas
  /** @type {Chart} */
  let chart

  const colors = {
    darkgreen: 'rgb(91,185,116)',
    green: 'rgb(129,201,149)',
    lightgreen: 'rgb(206,234,214)',
    gray: 'rgb(218,220,224)',
    lightred: 'rgb(250,210,207)',
    red: 'rgb(242,139,130)',
    darkred: 'rgb(238,103,92)',
  }

  /**
   * @param {number} level
   * @param {Record<string, number>} item
   */
  function setBackground(level, item) {
    if (grouping.length === 2) {
      switch (level) {
        case 0: return '#444'
        case 1: return colorBackground(item) || '#999'
        default: return '#999'
      }
    }
    else if (grouping.length === 3) {
      switch (level) {
        case 0: return '#444'
        case 1: return '#555'
        case 2: return colorBackground(item) || '#999'
        default: return '#999'
      }
    }
    else if (grouping.length === 3) {
      switch (level) {
        case 0: return '#444'
        case 1: return '#555'
        case 2: return '#666'
        case 3: return colorBackground(item) || '#999'
        default: return '#999'
      }
    }
  }

  /**
   * @param {Record<string, number>} item
   */
  function colorBackground(item) {
    const value = item[evaluation]
    if (evaluation.startsWith('performance')) {
      if (value >= 2) return colors.darkgreen
      if (value >= 1) return colors.green
      if (value > 0) return colors.lightgreen
      if (value == 0) return colors.gray
      if (value < 0 && value > -1) return colors.lightred
      if (value <= -1 && value > -2) return colors.red
      if (value <= -2) return colors.darkred
    }
    if (evaluation === 'peTrailing' || evaluation === 'peForward') {
      if (!value) return colors.gray
      if (value <= 0) return colors.darkred
      if (value >= 50) return colors.red
      if (value >= 30) return colors.lightred
      if (value >= 20) return colors.lightgreen
      if (value >= 10) return colors.green
      if (value > 0) return colors.darkgreen
    }
    if (evaluation === 'pegRatio') {
      if (!value) return colors.gray
      if (value >= 20) return colors.darkred
      if (value >= 5) return colors.red
      if (value >= 2) return colors.lightred
      if (value >= 1) return colors.lightgreen
      if (value > 0) return colors.darkgreen
      if (value <= 0 ) return colors.gray
    }
  }

  /** @type {Object<string, any>} */
  const config = {
    type: 'treemap',
    data: {
      datasets: [
        {
          key: structure,
          tree: data,
          groups: grouping,
          borderColor: 'black',
          borderWidth: 1,
          spacing: 0,
          /** @param {Record<string, any>} ctx */
          backgroundColor: (ctx) => {
            if (ctx.type === 'data' && ctx.raw !== undefined) {
              let level = ctx.raw.l
              let item = ctx.raw._data.children[0]
              return setBackground(level, item)
            }
          },
          captions: {
            display: true,
            color: 'white',
            /** @param {Record<string, any>} ctx */
            font: (ctx) => {
              if (ctx.type !== 'data') return
              if (ctx.raw.l === 0) return {size: 16, weight: 'bold'}
              if (ctx.raw.l === 1) return {size: 14, weight: 'normal'}
              return {}
            },
          },
          labels: {
            display: true,
            color: 'black',
            font: {
              size: 16,
              weight: 'normal',
              lineHeight: 1.5
            },
            /** @param {Record<string, any>} ctx */
            formatter: (ctx) => {
              let item  = ctx.raw._data.children[0]
              let value
              if (evaluation.startsWith('performance')) {
                value = formatPercent(item[evaluation]/100)
              } else if (evaluation === 'positionWeight') {
                value = formatPercent(item[evaluation])
              } else {
                value = formatNumber(item[evaluation])
              }
              return [
                item.ticker ? item.ticker.split('.').shift() : '',
                value
              ]
            }
          }
        }
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
            display: false,
            position: 'top',
        },
        title: {
          display: false,
          text: 'Crypto Index 200',
          font: {
              size: 24,
              weight: 'bold',
            }
        },
        tooltip: {
          enabled: true,
          position: 'nearest',
          callbacks: {
            /** @param {Record<string, any>} ctx */
            label: (ctx) => {
              if (ctx.raw === undefined) return
              let description = ctx.raw.g
              if (grouping.length === 2 && ctx.raw.l === 1) {
                description = ctx.raw._data.children[0].Instrument.name
              }
              if (grouping.length === 3 && ctx.raw.l === 2) {
                description = ctx.raw._data.children[0].name
              }
              if (ctx.raw.v > 1_000_000_000) {
                return description + ': USD ' + (ctx.raw.v/1_000_000_000).toFixed(0) + 'B'
              } else if (ctx.raw.v > 1_000_000) {
                return description + ': USD ' + (ctx.raw.v/1_000_000).toFixed(0) + 'M'
              } else {
                return description + ': USD ' + (ctx.raw.v).toFixed(0)
              }
            },
            title: () => {
              return 'Market Capitalization'
            },
          }
        },
      }
    }
  }


  function init() {
    Chart.register(LinearScale, TreemapElement, TreemapController, Title, Tooltip, Legend)
    // @ts-ignore
    chart = new Chart(canvas, config)
  }

  function updateChartData() {
    config.data.datasets[0].tree = data
    config.data.datasets[0].key = structure
    config.data.datasets[0].groups = grouping
    if (chart) {
     chart.update()
    }
  }

  onMount(init)

  $: data, updateChartData()
  $: structure, updateChartData()
  $: grouping, updateChartData()
  $: evaluation, updateChartData()

</script>

<div class="chart-container w-100" style="height:{height};">
  <canvas bind:this={canvas}></canvas>
</div>

