/** @type {import('./$types').PageServerLoad} */
export async function load({locals}) {
  const {session, user} = locals

  // mapbox options as per https://docs.mapbox.com/api/search/geocoding
  const mapbox = {
    access_token:
      'pk.eyJ1Ijoic2FtaGVzcyIsImEiOiJjbDJhYXFpYTUwM21iM2tzMXo2ejg5YWltIn0.klumhVZ4oeembZPkcgtJ6g',
    limit: 5,
    language: 'de'
  }

  return {mapbox}
}
