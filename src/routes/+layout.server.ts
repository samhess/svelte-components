import type {LayoutServerLoadEvent} from './$types.d.ts'
import {error} from '@sveltejs/kit'
import {routes} from '../routes.ts'

export async function load({request, route, locals}: LayoutServerLoadEvent) {
  if (route.id) {
    return {session: locals.session, routes}
  } else {
    const url = new URL(request.url)
    error(404, `${url.pathname} route does not exist`)
  }
}
