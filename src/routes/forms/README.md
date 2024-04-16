# Vue Component for Address Completion

This is a Svelte component for address autocompletion. It integrates with 
[Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/) and [Tailwind CSS](https://tailwindcss.com/).

A current build of the component can be found in the *dist* directory.

## Installation
```bash
npm install @samhess/svelte-components
```

## Usage 
```html
<AddressInput {mapboxOptions} on:addressSelect={(address)=>getAddress(address)}></AddressInput>

<script setup>
  import AddressInput from '$lib/components/AddressInput.svelte'
  let postcode,city,state,country

  // mapbox options as per https://docs.mapbox.com/api/search/geocoding
  const mapboxOptions = {
    access_token : 'YOUR_TOKEN',
    limit : 5,
    language: 'en'
  }
  function getAddress(event) {
    const {address} = event.detail
    postcode = address.postcode
    city = address.city
    state = address.state
    country = address.country
  }
</script>
```

## Demo
[Demo](https://samhess.github.io/vue3-address-input/index.html) is hosted on GitHub Pages ([docs](/docs) directory)

## Properties

| Property      | Subproperty   | Type    | Description                        | Required | Default |
| :------:      | :-------:     | :---:   | :---------:                        | :------: | :-----: |
| mapboxOptions |               | Object  | Mapbox options as indicated below  | Yes      |         |
|               | .access_token | String  | Mapbox access token                | Yes      | ''      |
|               | .limit        | String  | Limit of suggestions               | No       | 10      |
|               | .proximity    | String  | Search near                        | No       |'ip'     |
|               | .autocomplete | Boolean | Autocomplete search input          | No       | true    |
|               | .fuzzyMatch   | Boolean | Not only exact match               | No       | true    |
|               | .country      | String  | Limit to certain countries         | No       | ''   |
|               | .language     | String  | Language for search and results    | No       | 'en'    |

Please refer to [Mapbox Geocoding API documentation](https://docs.mapbox.com/api/search/geocoding) for further information

## Events

| Event | Description |
| :---: | :---------: |
| **@addressSelect** | Triggered when user selects address. Returns object with selected address containing street, postcode, city state and country |