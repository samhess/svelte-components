# Svelte Component for Treemap Chart

This is a Svelte integration of some [heroicons](https://heroicons.com) component.

## Demo
[Demo](https://svelte-components-black.vercel.app/components/icons)

## Installation
```bash
npm install @samhess/svelte-components
```

## Usage 
```html
<script>
  import {HeroIcon} from '@samhess/svelte-components'
</script>
<article class="prose">
  <h1>Icons</h1>
  <h2>HeroIcons</h2>
    <HeroIcon name="check" className="w-8 h-8"/>
    <HeroIcon name="chevron-double-left" className="w-8 h-8"/>
    <HeroIcon name="chevron-double-right" className="w-8 h-8"/>
    <HeroIcon name="envelope" className="w-8 h-8"/>
    <HeroIcon name="plus-small" className="w-8 h-8"/>
    <HeroIcon name="xmark" className="w-8 h-8"/>
    <HeroIcon name="question-mark-circle" className="w-8 h-8"/>
</article>
```

## Properties

| Property      | Type     | Description                                    | Required | Default |
| :------:      | :---:    | :---------:                                    | :------: | :-----: |
| name          | string   | Name of the heroicon                           | Yes      |         |
| className     | string   | Tailwind classes to be applied                 | Yes      | ''      |

Please refer to [heroicons](https://heroicons.com) for further information.