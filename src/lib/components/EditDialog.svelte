<script>
  import { createEventDispatcher } from 'svelte'
  import { capitalize } from '$lib/helpers.js'
  import { page } from "$app/stores"
  const dispatch = createEventDispatcher()
  /** @type {Object<string, any>} */
  export let entity = { name:'', endpoint:'', attributes:[] }
  /** @type {Object<string, any>} */
  let editedItem = {}
  let mode = 'update'
  /** @type {HTMLDialogElement} */
  let dialog
  const selectFields = [
    'assetclass',
    'countryCode',
    'currencyCode',
    'gicsCode',
    'icbCode', 
    'instrumentId',
    'portfolioKey',
    'visibility',
    'weighting',
    'exchangeId',
    'user'
  ]

  /**
   * @param {Object<string, any>} item
   */
  export function editItem(item) {
    mode = 'update'
    editedItem = {}
    for (const {key, edit} of entity.attributes) {
      if (edit !== false || key==='portfolioKey') {
        editedItem[key] = item[key]
      }
    }
    dialog.showModal()
  }

   export function addItem() {
    mode = 'add'
    editedItem = {}
    if (entity.endpoint === 'portfolioToInstrument') {
      editedItem.portfolioKey = `${$page.data.user.email}:${entity.ticker}`
    }
    for (const {key, edit} of entity.attributes) {
      if (edit !== false) {
        editedItem[key] = null 
      }
    }
    console.log(mode)
    dialog.showModal()
  }

  async function getOptions(key='') {
    if (key==='assetclass') {
      return [
        { name:'Cash', value:'cash'},
        { name:'Cryptocurrency', value:'cryptocurrency'},
        { name:'Equity', value:'equity'},
        { name:'Commodity', value:'commodity'},
        { name:'Pension Fund', value:'pension'},
      ]
    }
    if (key==='visibility') {
      return [
        { name:'private', value:'private'},
        { name:'public', value:'public'}
      ]
    }
    if (key==='weighting') {
      return [
        { name:'marketcap-weighted', value:'marketcap'},
        { name:'price-weighted', value:'price'}
      ]
    }
    if (key==='countryCode') {
      const response = await fetch('/api/country')
      /** @type {Object<string,any>[]} */
      let countries = await response.json()
      countries = countries.map(({code, name}) => ({value:code, name:name}))
      return countries
    }
    if (key==='currencyCode') {
      const response = await fetch('/api/currency')
      /** @type {Object<string,any>[]} */
      let currencies = await response.json()
      currencies = currencies.map(({code, name}) => ({value:code, name:name}))
      return currencies
    }
    if (key==='gicsCode') {
      const response = await fetch('/api/gics')
      /** @type {Object<string,any>[]} */
      let gics = await response.json()
      gics = gics.map(({code, name}) => ({value:code, name:name}))
      return gics
    }
    if (key==='icbCode') {
      const response = await fetch('/api/icb')
      /** @type {Object<string,any>[]} */
      let icb = await response.json()
      icb = icb.map(({code, name}) => ({value:code, name:name}))
      return icb
    }
    if (key==='instrumentId') {
      const response = await fetch('/api/instrument')
      /** @type {Object<string,any>[]} */
      let instruments = await response.json()
      instruments = instruments.map(({id,isin,name,ticker,exchangeId}) => ({value:isin, name:`${name} (${ticker}:${exchangeId})`}))
      return instruments
    }
    /*
    if (key==='portfolioId') {
      const response = await fetch('/api/portfolio')
      let portfolio = await response.json()
      portfolio = portfolio.map(({id, name})=> ({value:id, name:name}))
      return portfolio
    }*/
    if (key==='portfolioKey') {
      const response = await fetch('/api/portfolio')
      /** @type {Object<string,any>[]} */
      let portfolio = await response.json()
      portfolio = portfolio.map(({user,ticker, name})=> ({value:`${user}:${ticker}`, name:name}))
      return portfolio
    }
    if (key==='exchangeId') {
      const response = await fetch('/api/exchange')
      /** @type {Object<string,any>[]} */
      let exchange = await response.json()
      exchange = exchange.map(({mic, name})=> ({value:mic, name:name}))
      return exchange
    }
    if (key==='user') {
      const response = await fetch('/api/user')
      /** @type {Object<string,any>[]} */
      let users = await response.json()
      users = users.map(({email})=> ({value:email, name:email}))
      return users
    }
    return []
  }

  /**
   * @param {string} key
   */
  function getAttributeName(key) {
    const attribute = entity.attributes.find((/** @type {Object<string, any>} */ attribute) => attribute.key === key)
    return attribute.name
  }

  async function createItem() {
    if (entity.endpoint === 'portfolioToInstrument') {
      const [user,ticker] = editedItem.portfolioKey.split(':')
      editedItem.user = user
      editedItem.ticker = ticker
    }
    const body = JSON.stringify(editedItem)
    const response = await fetch(`/api/${entity.endpoint}`, { method:'POST', body })
    if (response.ok) {
      dispatch('updateData')
    } else {
      console.log(response.statusText)
    }
    dialog.close()
  }

  async function updateItem() {
    if (entity.endpoint === 'portfolioToInstrument') {
      const [user,ticker] = editedItem.portfolioKey.split(':')
      editedItem.user = user
      editedItem.ticker = ticker
    }
    const body = JSON.stringify(editedItem)
    const response = await fetch(`/api/${entity.endpoint}`, { method:'PUT', body })
    if (response.ok) {
      dispatch('updateData')
    } else {
      console.log(response.statusText)
    }
    dialog.close()
  }

  async function deleteItem() {
    if (entity.endpoint === 'portfolioToInstrument') {
      const [user,ticker] = editedItem.portfolioKey.split(':')
      editedItem.user = user
      editedItem.ticker = ticker
    }
    const body = JSON.stringify(editedItem)
    const response = await fetch(`/api/${entity.endpoint}`, { method:'DELETE', body })
    if (response.ok) {
      dispatch('updateData')
    } else {
      console.log(response.statusText)
    }
    dialog.close()
  }
</script>
  
<dialog bind:this={dialog}>
  <slot name="header">
    <h2 class="h3 text-center">{`${capitalize(mode)} ${capitalize(entity.name)}`}</h2>
  </slot>
  <slot>
    {#each Object.entries(editedItem) as [key,itemValue]}
      {#if entity.attributes.find((/** @type {{ key: string; }} */ attribute) => attribute.key===key) && key!=='id'}
        <div class="m-3" >
          <label class="form-label font-semibold" for={key}>{getAttributeName(key)}</label>
            {#if selectFields.includes(key) }
              <div class="flex flex-row align-middle">
                <div class="basis-3/4">
                  <select id={key} class="form-select" bind:value={editedItem[key]} disabled={key==='portfolioKey'}>
                    {#await getOptions(key) then options }
                      <option hidden disabled selected value> -- select an option -- </option>
                      {#each options as option}
                        <option value={option.value} selected={option.value===itemValue}>{option.name}</option>
                      {/each}
                    {/await}
                  </select>
                </div>
                <div class="basis-1/4 ms-3 mt-3">
                  {itemValue}
                </div>
              </div>
            {:else}
              {#if ['shares', 'sharesOut', 'weight'].includes(key)}
                <input class="form-input" id={key} type='number' disabled={key==='id'} bind:value={editedItem[key]}/>
              {:else}
                <input class="form-input" id={key} type='text' bind:value={editedItem[key]}/>
              {/if}
            {/if}

        </div>
      {/if}
    {/each}
  </slot>
  <slot name="footer">
    <div class="flex justify-between my-4 mx-4">
      <button class="btn btn-danger" on:click={deleteItem}>Delete</button>
      <div>
        <button class="btn btn-secondary" on:click={()=>dialog.close()}>Cancel</button>
        {#if mode==='add' }
          <button class="btn btn-primary text-white"on:click={createItem}>Add</button>
        {:else if mode==='update' }
          <button class="btn btn-primary text-white"on:click={updateItem}>Update</button>
        {/if}
      </div>
    </div>
  </slot>
</dialog>