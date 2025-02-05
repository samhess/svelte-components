
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
  <p class="lead">Type two and more letters in the street field and select an address from the suggestions.</p>
  <form>
    <div class="mb-4">
      <label>Street
        <AddressInput mapboxOptions={mapbox} deliver={(results={})=>{Object.assign(address,results)}}></AddressInput>
      </label>
    </div>
    <div class="flex justify-between">
      <label>Postcode
        <input name="postcode" bind:value={address.postcode}/>
      </label>
      <label>City
        <input name="city" bind:value={address.city}/>
      </label>
      <label>County / State
        <input name="state" bind:value={address.state}/>
      </label>
      <label>Country
        <input name="country" autocomplete="off" bind:value={address.country}/>
      </label>
    </div>
  </form>
</article>

