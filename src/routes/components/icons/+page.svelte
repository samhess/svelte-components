<script>
  import HeroIcon from '$lib/components/HeroIcon.svelte'
</script>

<article class="prose">
  <h1>Icons</h1>
  <h2>Heroicons</h2>
  <p>I did not find an easy Svelte integration of 
    <a href="https://heroicons.com/outline" target="_blank">heroicons</a> 
    so I put the fiew icons I am using into my own component.
  </p>
  <div class="flex flex-col">
    <div class="flex justify-between my-2">
      <HeroIcon name="check" className="w-8 h-8"/>
      <HeroIcon name="chevron-double-left" className="w-8 h-8"/>
      <HeroIcon name="chevron-double-right" className="w-8 h-8"/>
      <HeroIcon name="envelope" className="w-8 h-8"/>
      <HeroIcon name="plus-small" className="w-8 h-8"/>
      <HeroIcon name="xmark" className="w-8 h-8"/>
      <HeroIcon name="question-mark-circle" className="w-8 h-8"/>
    </div>
    <div class="flex justify-between my-2">
      <HeroIcon name="check" className="w-8 h-8 text-green-500"/>
      <HeroIcon name="chevron-double-left" className="w-8 h-8 text-green-500"/>
      <HeroIcon name="chevron-double-right" className="w-8 h-8 text-green-500"/>
      <HeroIcon name="envelope" className="w-8 h-8 text-green-500"/>
      <HeroIcon name="plus-small" className="w-8 h-8 text-green-500"/>
      <HeroIcon name="xmark" className="w-8 h-8 text-green-500"/>
      <HeroIcon name="question-mark-circle" className="w-8 h-8 text-green-500"/>
    </div>
    <div class="flex justify-between my-2">
      <HeroIcon name="check" className="w-8 h-8 text-red-500"/>
      <HeroIcon name="chevron-double-left" className="w-8 h-8 text-red-500"/>
      <HeroIcon name="chevron-double-right" className="w-8 h-8 text-red-500"/>
      <HeroIcon name="envelope" className="w-8 h-8 text-red-500"/>
      <HeroIcon name="plus-small" className="w-8 h-8 text-red-500"/>
      <HeroIcon name="xmark" className="w-8 h-8 text-red-500"/>
      <HeroIcon name="question-mark-circle" className="w-8 h-8 text-red-500"/>
    </div>
  </div>
</article>
