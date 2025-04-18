# Svelte Component for Address Completion

This is a Svelte component for address autocompletion. It integrates with
[Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/).

## Demo

[Demo](https://svelte-components-black.vercel.app/components/forms).

## Installation

```bash
npm install @samhess/svelte-components
```

## Usage

```html
<script>
  import AddressInput from '$lib/components/AddressInput.svelte'

  type Address = {
    postcode?: string | number;
    city?: string;
    state?: string;
    country?: string;
  }

  const {data} = $props()

  let address:Address = $state({})
</script>

<form>
  <AddressInput
    mapboxOptions={data.mapbox}
    dispatch={(results: Address) => Object.assign(address, results)}
  ></AddressInput>
</form>
```

## Properties

|   Property    |  Attribute   |  Type   |            Description            | Required | Default |
| :-----------: | :----------: | :-----: | :-------------------------------: | :------: | :-----: |
| mapboxOptions |              | Object  | Mapbox options as indicated below |   Yes    |         |
|               | access_token | String  |        Mapbox access token        |   Yes    |   ''    |
|               |    limit     | String  |       Limit of suggestions        |    No    |   10    |
|               |  proximity   | String  |            Search near            |    No    |  'ip'   |
|               | autocomplete | Boolean |     Autocomplete search input     |    No    |  true   |
|               |  fuzzyMatch  | Boolean |       Not only exact match        |    No    |  true   |
|               |   country    | String  |    Limit to certain countries     |    No    |   ''    |
|               |   language   | String  |  Language for search and results  |    No    |  'en'   |
| dispatch      |              | Function| Triggered when user selects address. Returns object with selected address containing street, postcode, city state and country | No | - |

Please refer to [Mapbox Geocoding API documentation](https://docs.mapbox.com/api/search/geocoding) for further information

