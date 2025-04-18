<script lang="ts">
  import AddressInput from '$lib/components/AddressInput.svelte'

  type Address = {
    postcode?: string | number
    city?: string
    state?: string
    country?: string
  }

  const {data} = $props()

  let address: Address = $state({})
</script>

<article class="prose">
  <h1>Form Elements</h1>
  <h2>Address Autocomplete</h2>
  <p class="lead">
    Type two and more letters in the street field and select an address from the suggestions.
  </p>
  <form>
    <div class="mb-4">
      <label
        >Street
        <AddressInput
          mapboxOptions={data.mapbox}
          dispatch={(results: Address) => Object.assign(address, results)}
        ></AddressInput>
      </label>
    </div>
    <div class="flex justify-between">
      <label
        >Postcode
        <input name="postcode" value={address.postcode} />
      </label>
      <label
        >City
        <input name="city" value={address.city} />
      </label>
      <label
        >County / State
        <input name="state" value={address.state} />
      </label>
      <label
        >Country
        <input name="country" autocomplete="off" value={address.country} />
      </label>
    </div>
  </form>
</article>
