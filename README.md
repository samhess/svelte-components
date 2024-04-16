# Sam's Svelte Components

* [Address autocompletion](https://github.com/samhess/svelte-components/tree/main/src/routes/forms)
* [DataTable](https://github.com/samhess/svelte-components/tree/main/src/routes/tables)
* [Heroicons](https://github.com/samhess/svelte-components/tree/main/src/routes/icons)
* [TreeMap](https://github.com/samhess/svelte-components/tree/main/src/routes/charts)

## Installation
```bash
npm install @samhess/svelte-components
```

## Usage 
```html
<AddressInput {mapboxOptions} on:addressSelect={(address)=>getAddress(address)}></AddressInput>

<script setup>
  import {AddressInput} from '@samhess/svelte-components'
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

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
