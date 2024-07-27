import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals, route}) {
  const {session, user} = locals
  const mainMenu = [ 'Home', 'Components', 'Examples' ]
  const {id:path} = route
  if (path) {
    const [level1] = path.replace(/^\//,'').split('/')
    const entries = await readdir(resolve(process.cwd(), 'database', level1), {withFileTypes:true})
    const subMenu = entries
      .filter(item => item.isDirectory())
      .map(({name, path}) => ({
        name: name.replace(/./,char=>char.toUpperCase()).replace(/-/g,' '),
        path: `/${level1}/${name}`
      }))
    return {session, user, mainMenu, subMenu}
  } else {
    error(500, 'route does not exist')
  }
}