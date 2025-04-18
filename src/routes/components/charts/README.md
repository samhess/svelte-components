# Svelte Component for Treemap Chart

This is a Svelte integration of the **chartjs-chart-treemap** component.

## Demo

[Demo](https://svelte-components-black.vercel.app/components/charts)

## Installation

```bash
npm install @samhess/svelte-components
```

## Usage

```html
<script>
  import {Treemap} from '@samhess/svelte-components'
  let {data} = $props()
  let {records, structure, grouping, evaluation} = $derived(data)
</script>
<article class="prose">
  <h1>Charts</h1>
  <h2>TreeMap</h2>
  <Treemap data="{records}" {structure} {grouping} {evaluation}> </Treemap>
</article>
```

## Properties

|  Property  |   Type   |                 Description                  | Required | Default |
| :--------: | :------: | :------------------------------------------: | :------: | :-----: |
|    data    | Object[] |            Array with data object            |   Yes    |         |
| evaluation |  string  |         The value that is displayed          |   Yes    |   ''    |
|  grouping  | string[] |        The grouping levels of the map        |   Yes    |   ''    |
| structure  |  string  | This data property is used structure the map |   Yes    |   ''    |

Please refer to [chartjs-chart-treemap](https://chartjs-chart-treemap.pages.dev/) for further information.
