// changing user agent will change html response of google search. cheerio might not find the news anymore.
export const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'

/**
 * @param {*} url 
 * @param {*} options 
 * @returns 
 */
export async function fetchWrapper(url, options={headers: new Headers()}) {
  if (!options.headers.has('accept')) options.headers.set('accept', 'text/html, application/json, */*')
  if (!options.headers.has('accept-language')) options.headers.set('accept-language', 'en-US,en;q=0.9') 
  if (!options.headers.has('sec-fetch-dest')) options.headers.set('sec-fetch-dest', 'empty') 
  if (!options.headers.has('sec-fetch-mode')) options.headers.set('sec-fetch-mode', 'cors') 
  if (!options.headers.has('sec-fetch-site')) options.headers.set('sec-fetch-site', 'same-site')
  if (!options.headers.has('user-agent')) options.headers.set('user-agent', userAgent)
  try {
    const response = await fetch(url, options)
    if (response.ok) {
      return response
    } else {
      console.error(`HTTP error: ${response.status} - ${response.statusText} ${url.pathname}`)
      return new Error('HTTP error', {cause: response})
    }
  } catch (/** @type {*} */error) {
    const message = `${error.message} - ${error.cause ?? 'cause unknown'}`
    console.error(`fetch error: ${message}`)
    return new Error('fetch error', {cause: error})
  }
}