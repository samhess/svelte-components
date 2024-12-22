<script>
  import HeroIcon from '$lib/components/HeroIcon.svelte'
  const icons = [
    'check',
    'chevron-double-left',
    'chevron-double-right',
    'envelope',
    'plus-small',
    'xmark',
    'question-mark-circle'
  ]
</script>

<article class="prose">
  <h1>Icons</h1>
  <h2>Heroicons</h2>
  <p>I did not find an easy Svelte integration of 
    <a href="https://heroicons.com/outline" target="_blank">heroicons</a> 
    so I put the fiew icons I am using into my own component.
  </p>
  <div class="flex flex-col">
    <h3>Black Icons</h3>
    <div class="flex justify-between my-2">
      {#each icons as iconName}
        <HeroIcon name={iconName} className="w-8 h-8"/>
      {/each}
    </div>
    <h3>Green Icons</h3>
    <div class="flex justify-between my-2">
      {#each icons as iconName}
        <HeroIcon name={iconName} className="w-8 h-8 text-green-500"/>
      {/each}
    </div>
    <h3>Red Icons</h3>
    <div class="flex justify-between my-2">
      {#each icons as iconName}
        <HeroIcon name={iconName} className="w-8 h-8 text-red-500"/>
      {/each}
    </div>
  </div>
</article>
