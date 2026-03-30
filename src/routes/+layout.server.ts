import type {LayoutServerLoadEvent} from './$types.d.ts'
import {error} from '@sveltejs/kit'
import {routes} from '../routes.ts'

export async function load({request, route, locals}: LayoutServerLoadEvent) {
  const {session} = locals
  if (route.id) {
    const path = {
      segment1: route.id.split('/')[1],
      segment2: route.id.split('/')[2]
    }
    return {session, path, routes}
  } else {
    const url = new URL(request.url)
    error(404, `${url.pathname} route does not exist`)
  }
}
