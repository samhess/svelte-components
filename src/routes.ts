import type {GenericObject} from '$lib/types.ts'

export const routes: GenericObject = {
  home: {
    name: 'Home',
    children: []
  },
  components: {
    name: 'Components',
    children: ['Charts', 'Forms', 'Tables']
  },
  examples: {
    name: 'Examples',
    children: ['Countries', 'Currencies', 'Exchanges', 'Industries']
  }
}
