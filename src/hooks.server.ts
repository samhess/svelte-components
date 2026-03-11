import type {HandleServerError, Handle} from '@sveltejs/kit'

export const handle: Handle = async ({event, resolve}) => {
  console.log(`${event.request.method} ${event.url.pathname}${event.url.search}`)
  return resolve(event)
}

export const handleError: HandleServerError = ({error, event, status, message}) => {
  console.error(`${status}: ${message}`)
  return {status, message}
}
