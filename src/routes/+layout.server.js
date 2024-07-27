import { error } from '@sveltejs/kit'
const menuItems = {
  components: Object.keys(import.meta.glob('./components/*/*.svelte')),
  examples: Object.keys(import.meta.glob('./examples/*/*.svelte'))
}
function getSubMenu(mainMenuItem) {
  if (mainMenuItem in menuItems) {
    const subMenu = menuItems[mainMenuItem]
    return subMenu.map(path => ({
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