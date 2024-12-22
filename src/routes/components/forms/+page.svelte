
<script>
  import AddressInput from '$lib/components/AddressInput.svelte'

  /**
   * @typedef {Object} Props
   * @property {Object.<string, any>} data
  */

  /** @type {Props} */
  let {data} = $props()
  let {mapbox} = $derived(data)

  let address = $state({
    postcode: '', 
    city: '', 
    state: '', 
    country: ''
  })
</script>

<article class="prose">
  <h1>Form Elements</h1>
  <h2>Address Autocomplete</h2>
  <p>Type two and more letters in the street field and select an address from the suggestions.</p>
  <form>
    <div>
      <div class="mb-2 w-1/2">
        <label class="form-label" for="street">Street</label>
        <AddressInput mapboxOptions={mapbox} deliver={(results={})=>{Object.assign(address,results)}}></AddressInput>
      </div>
    </div>
    <div class="flex justify-normal">
      <div class="me-5">
        <label class="form-label" for="postcode">Postcode</label>
        <input class="form-input" bind:value={address.postcode}/>
      </div>
      <div class="me-5">
        <label class="form-label" for="city">City</label>
        <input class="form-input" bind:value={address.city}/>
      </div>
      <div class="me-5">
        <label class="form-label" for="county">County</label>
        <input class="form-input" bind:value={address.state}/>
      </div>
      <div class="me-5">
        <label class="form-label" for="county">Country</label>
        <input class="form-input" bind:value={address.country}/>
      </div>
    </div>
  </form>
</article>

