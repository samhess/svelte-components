import { error } from '@sveltejs/kit'
/** @type {Object<string,any>} */
const menuItems = {
  components: Object.keys(import.meta.glob('./components/*/*.svelte')),
  examples: Object.keys(import.meta.glob('./examples/*/*.svelte'))
}
function getSubMenu(mainMenuItem='') {
  if (mainMenuItem in menuItems) {
    /** @type {string[]} */
    const subMenu = menuItems[mainMenuItem]
    return subMenu.map(path => ({
      // @ts-ignore
      name: path.match(/\/.*\/(.*)\//)[1].replace(/./,char=>char.toUpperCase()),
      path: path.replace(/^\./,'').replace(/\/\+page.svelte$/,'')
    }))
  } else {
    return []
  }

}

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals, route}) {

  const {session, user} = locals
  const mainMenu = [ 'Home', 'Components', 'Examples' ]
  const {id:path} = route
  if (path) {
    const [level1] = path.replace(/^\//,'').split('/')
    const subMenu = getSubMenu(level1)
    return {session, user, mainMenu, subMenu}
  } else {
    error(500, 'route does not exist')
  }
}