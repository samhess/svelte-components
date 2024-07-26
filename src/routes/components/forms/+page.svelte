<script>
  import AddressInput from '$lib/components/AddressInput.svelte'
  let postcode,city,state,country

  // mapbox options as per https://docs.mapbox.com/api/search/geocoding
  const mapboxOptions = {
    access_token : 'pk.eyJ1Ijoic2FtaGVzcyIsImEiOiJjbDJhYXFpYTUwM21iM2tzMXo2ejg5YWltIn0.klumhVZ4oeembZPkcgtJ6g',
    limit : 5,
    language: 'de'
  }

  function updateAddress(event) {
    const {address} = event.detail
    postcode = address.postcode
    city = address.city
    state = address.state
    country = address.country
  }
</script>

<article class="prose">
  <h1>Form Elements</h1>
  <h2>Address Autocomplete</h2>
  <p>Type two and more letters in the street field and select an address from the suggestions.</p>
  <form>
    <div>
      <div class="mb-2 w-1/2">
        <label class="form-label" for="street">Street</label>
        <AddressInput {mapboxOptions} on:addressSelect={updateAddress}></AddressInput>
      </div>
    </div>
    <div class="flex justify-normal">
      <div class="me-5">
        <label class="form-label" for="postcode">Postcode</label>
        <input class="form-input" bind:value={postcode}/>
      </div>
      <div class="me-5">
        <label class="form-label" for="city">City</label>
        <input class="form-input" bind:value={city}/>
      </div>
      <div class="me-5">
        <label class="form-label" for="state">State</label>
        <input class="form-input" bind:value={state}/>
      </div>
      <div class="me-5">
        <label class="form-label" for="state">Country</label>
        <input class="form-input" bind:value={country}/>
      </div>
    </div>
  </form>
</article>

