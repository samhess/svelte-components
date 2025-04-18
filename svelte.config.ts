import type {Config} from '@sveltejs/kit'
import adapter from '@sveltejs/adapter-vercel'

const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({runtime:'edge'}),
	}
} satisfies Config

export default config
