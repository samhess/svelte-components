<script lang="js">
  import { page } from '$app/state'
  import HeroIcon from '$lib/components/HeroIcon.svelte'
  import '../main.css'
  let {data, children} = $props()
  let {mainMenu, subMenu} = $derived(data)

  let breadcrumb = $derived(page.route.id?.slice(1).replaceAll('/',' > ') ?? '')
  let currentRoute = $derived(page.route.id?.replace(/^\//,'') ?? '') 
</script>

<svelte:head>
  <title>@samhess/svelte-components &mdash; {breadcrumb}</title>
</svelte:head>

<!-- top navigation -->
<header class="bg-sky-500">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <div class="flex bg-slate-100 rounded-full">
      </div>
      <div class="hidden md:block">
        <div class="flex items-baseline space-x-2 justify-center">
          {#each mainMenu as item}
            <a
              href={`/${item.toLowerCase()}`}
              class="text-gray-300 hover:bg-sky-400 hover:text-white rounded-md px-3 py-1.5 font-medium" 
              class:text-white = { currentRoute.startsWith(item.toLowerCase()) }
              >{ item }
            </a>
          {/each}
        </div>
        <!-- dynamic sub menu -->
        <div class="flex items-center space-x-2 justify-center">
          {#each subMenu as childRoute}
            <a href={childRoute.path}
              class="text-gray-300 hover:bg-sky-400 hover:text-white rounded-md px-3 font-medium"
              class:text-white = { currentRoute.startsWith(childRoute.path.slice(1)) }
            >{ childRoute.name }</a>
          {/each}
        </div>
      </div>
      <div class="hidden md:block">
        <div class="ml-4 flex items-center md:ml-6">
        </div>
      </div>
    </div>
  </div>
</header>

<!-- main content -->
<main class="mx-auto max-w-7xl pt-10 px-2 md:px-4">
  {@render children?.()}
  <!-- footer -->
  <hr class="mt-10 mb-2">
  <footer class="flex justify-between pb-10">
    <div>@samhess/svelte-components</div>
    <div>
      <a href="https://github.com/samhess" target="_blank">Contact <HeroIcon name="envelope" className="w-5 h-5 inline"/></a>
    </div>
  </footer>
</main>