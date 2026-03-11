import adapter from '@sveltejs/adapter-vercel'

const config = {
  kit: {
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter({runtime: 'nodejs22.x'})
  }
}

export default config
