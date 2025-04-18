import {error} from '@sveltejs/kit'
/** @type {Object<string,any>} */
const menu = {
  components: Object.keys(import.meta.glob('./components/*/*.svelte')),
  examples: Object.keys(import.meta.glob('./examples/*/*.svelte'))
}
function getSubMenu(item='') {
  if (menu[item]) {
    /** @type {string[]} */
    const subMenu = menu[item]
    return subMenu
      .map(path => ({
        name: path.match(/\/.*\/(.*)\//)[1].replace(/./,char=>char.toUpperCase()),
        path: path.replace(/^\./,'').replace(/\/\+page.svelte$/,'')
      }))
      .sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base'}))
  } else {
    return []
  }
}

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals, route}) {
  const {session, user} = locals
  if (route.id) {
    const subMenu = getSubMenu(route.id.split('/')[1])
    const routes = ['Home','Components','Examples']
    return {session, user, routes, subMenu}
  } else {
    error(404, 'route does not exist')
  }
}