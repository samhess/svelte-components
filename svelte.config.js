import adapter from '@sveltejs/adapter-vercel'

const config = {
  kit: {
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter()
    //adapter: adapter({runtime: 'edge'})
  }
}

export default config
