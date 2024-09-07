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
   * @param {Object<string,any>} item
   */
  function getBackground(item) {
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

  function initChart() {
    Chart.register(LinearScale, TreemapElement, TreemapController, Title, Tooltip, Legend)
    // @ts-ignore
    chart = new Chart(canvas, {type:'treemap'})
    chart.options.responsive = true
    chart.options.maintainAspectRatio = false
    chart.options.plugins = {}
    chart.options.plugins.legend = {
      display: false, 
      position: 'top',
    },
    chart.options.plugins.title = {
      display: false,
      text: '',
      font: {size:24, weight:'bold'}
    },
    chart.options.plugins.tooltip = {
      enabled: true,
      position: 'nearest',
      callbacks: {
        title: () => 'Value',
        /** @param {Record<string, any>} ctx */
        label: (ctx) => {
          const {raw} = ctx
          if (raw) {
            const group = grouping.length-1===raw.l 
              ? raw._data.children[0].name 
              : raw.g
            if (raw.v > 1_000_000_000) {
              return `${group}: USD ${(raw.v/1_000_000_000).toFixed(0)} B`
            } else if (raw.v > 1_000_000) {
              return `${group}: USD ${(raw.v/1_000_000).toFixed(0)} M`
            } else {
              return `${group}: USD ${(raw.v).toFixed(0)}`
            }
          }
        }
      }
    }
    chart.data.datasets[0] = {
      key: structure,
      tree: data,
      groups: grouping,
      borderColor: 'black',
      borderWidth: 1,
      spacing: 0,
      /** @param {Object<string,any>} ctx */
      backgroundColor: (ctx) => {
        const {raw} = ctx
        if (raw) {
          const level = raw.l
          if (level === grouping.length-1) {
            return getBackground(raw._data.children[0]) ?? '#999'
          } else {
            return `#${111*(level+5)}` // gray levels
          }
        }
      },
      captions: {
        display: true,
        color: 'white',
        /** @param {Object<string,any>} ctx */
        // @ts-ignore
        font: (ctx) => {
          const {raw} = ctx
          if (raw) {
            if (ctx.raw.l === 0) return {size: 16, weight: 'bold'}
            if (ctx.raw.l === 1) return {size: 14, weight: 'normal'}
          }
        },
      },
      labels: {
        display: true,
        color: 'black',
        font: {lineHeight:1.5, size:16, weight:'normal'},
        /** @param {Object<string,any>} ctx */
        formatter: (ctx) => {
          const item  = ctx.raw._data.children[0]
          if (item) {
            const label = [
              item.ticker?.split('.').shift() ?? '',
              item[evaluation] ?? ''
            ]
            if (evaluation.startsWith('performance')) {
              label[1] = formatPercent(item[evaluation]/100)
            } else if (evaluation === 'weight') {
              label[1] = formatPercent(item[evaluation])
            } else {
              label[1] = formatNumber(item[evaluation])
            }
            return label
          }
        }
      }
    }
  }

  function updateChart() {
    if (chart) {
      // @ts-ignore
      chart.data.datasets[0].tree = data
      // @ts-ignore
      chart.data.datasets[0].key = structure
      // @ts-ignore
      chart.data.datasets[0].groups = grouping
      chart.update()
    }
  }

  onMount(initChart)

  $: data, updateChart()
  $: structure, updateChart()
  $: grouping, updateChart()
  $: evaluation, updateChart()

</script>

<div class="chart-container w-100" style="height:{height};">
  <canvas bind:this={canvas}></canvas>
</div>

