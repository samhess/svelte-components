<script>
  /**
   * @typedef {Object} Props
   * @property {string} [name]
   * @property {string} [className]
   * @property {function} [onclick]
   */

  /** @type {Props} */
  let { 
    name = 'question-mark-circle', 
    className = 'w-5 h-5',
    onclick 
  } = $props()
  let data = $state('')

  switch (name) {
    case 'check':
      data = "M4.5 12.75l6 6 9-13.5"
      break
    case 'chevron-double-left':
      data = "M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z"
      break
    case 'chevron-double-right':
      data = "M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      break
    case 'envelope':
      data = "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      break
    case 'plus-small':
      data = "M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
      break
    case 'xmark':
      data = "M6 18L18 6M6 6l12 12"
      break

    default:
      data = "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
      break
  }
</script>

<svg 
  xmlns="http://www.w3.org/2000/svg" 
  fill="none" 
  viewBox="0 0 24 24" 
  stroke-width="1" 
  stroke="currentColor" 
  class={className}>
  onclick={onclick}
  <path stroke-linecap="round" stroke-linejoin="round" d={data}/>
</svg>

