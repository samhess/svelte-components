<script>
  /**
   * @typedef {Object} Props
   * @property {any} [mapboxOptions] - mapbox options as per https://docs.mapbox.com/api/search/geocoding/
   * @property {function} deliver
   */

  /** @type {Props} */
  let { 
    mapboxOptions = {},
    deliver = (address={})=>{address}
  } = $props()

  const mapboxParams = {
    api: 'https://api.mapbox.com/geocoding/v5/',
    endpoint: 'mapbox.places',
    access_token: '',
    limit: 5,
    types: 'address',
    proximity: 'ip',
    autocomplete: true,
    fuzzyMatch: true,
    language: 'en'
  }
  let dropdownMenu = $state()
  let searchtext = $state('')
  let suggestions = $state(new Array())

  Object.assign(mapboxParams, mapboxOptions)

  function formatLabel(label='', part='') {
    let index = label.toLowerCase().indexOf(searchtext.toLowerCase())
    if (index >= 0) {
      let text = ''
      switch (part) {
        case 'start':  
          text = label.substring(0,index)
          break
        case 'middle': 
          text = label.substring(index, index + searchtext.length)
          break
        case 'end': 
          text = label.substring(index + searchtext.length)
          break
      }
      // console.log(`Found ${searchtext.value} in ${label} at pos ${index} and ${part} part is ${text}`);
      return text
    } else if (part === 'start') {
      return label
    } else {
      return ''
    }
  }

  async function searchAddress() {
    if (searchtext.length >= 2) {
      suggestions = await geoCode(searchtext)
      dropdownMenu.classList.remove('hidden')
      dropdownMenu.classList.add('block')
    } else {
      dropdownMenu.classList.remove('block')
      dropdownMenu.classList.add('hidden')
    }
  }

  /** @param {Object<string,any>} address */
  function selectAddress(address) {
    // hide dropdown menu
    dropdownMenu.classList.remove('block')
    dropdownMenu.classList.add('hidden')
    // update the value of the input field to what was selected
    searchtext = address.street
    // send address to parent component
    deliver(address)
  }

  async function geoCode(street='') {
    if (street.length >= 2) {
      const {api, endpoint, ...query} = mapboxParams
      const url = new URL(`${endpoint}/${street}.json`, api)
      for (const [key,value] of Object.entries(query)) {
        url.searchParams.set(key,value.toString())
      }
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        if (data.features) {
          // @ts-ignore
          const addresses = data.features.map(address => {
            const label = address.place_name
            const location = label.split(', ')[1]
            return {
              label: label,
              street: label.split(', ')[0],
              postcode: location.slice(0, location.indexOf(' ')),
              city: location.slice(1+location.indexOf(' ')),
              state: address.context.at(-2).text,
              country: address.context.at(-1).text
            }
          })
          return addresses
        } else {
          console.error(data.message)
        }
      } else {
        console.error(response.statusText)
      }

    }
  }
</script>

<input type="text" class="form-input" bind:value={searchtext} oninput={searchAddress}/>
<ul bind:this={dropdownMenu} class="list-none pl-0 mt-0">
  {#each suggestions as suggestion} 
    <li>
      <a class="dropdown-item" href="/" onclick={(event)=>{event.preventDefault(); selectAddress(suggestion)} }>
        {formatLabel(suggestion.label,'start')}
        <span class="text-primary">{formatLabel(suggestion.label,'middle')}</span>
        {formatLabel(suggestion.label, 'end')}
      </a> 
    </li>
  {/each}
</ul>



