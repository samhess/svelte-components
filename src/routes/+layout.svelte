<script lang="js">
  import { page } from '$app/stores'
  import Navigation from '$lib/components/Navigation.svelte'
  import HeroIcon from '$lib/components/HeroIcon.svelte'
  import '../main.css'
  export let data
  const {menu} = data
  let path = ''
  $: path = $page.route.id?.slice(1).replaceAll('/',' > ') ?? ''
</script>

<svelte:head>
  <title>moontrade.ch &mdash; {path}</title>
</svelte:head>

<Navigation {menu}></Navigation>
<main class="mx-auto max-w-7xl pt-10 px-2 md:px-4">
  <slot />
  <!-- footer -->
  <hr class="mt-10 mb-2">
  <footer class="flex justify-between pb-10">
    <div>@samhess/svelte-components</div>
    <div>
      <a href="https://www.linkedin.com/in/samhess/" target="_blank">Contact <HeroIcon name="envelope" className="w-5 h-5 inline"/></a>
    </div>
  </footer>
</main>