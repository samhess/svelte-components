<script lang="js">
  import {page} from '$app/state'
  import {Mail} from 'lucide-svelte'
  import '../app.css'
  let {data, children} = $props()
  let {routes, subMenu} = $derived(data)

  let breadcrumb = $derived(page.route.id?.slice(1).replaceAll('/',' > ') ?? '')
  let currentRoute = $derived(page.route.id?.replace(/^\//,'') ?? '') 
</script>

<svelte:head>
  <title>@samhess/svelte-components &mdash; {breadcrumb}</title>
</svelte:head>

<!-- top navigation -->
<header class="bg-sky-500">
 <!-- menu -->
 <div class="block">
  <!-- main menu -->
  <div class="bg-sky-600 flex items-center space-x-2 justify-center py-1">
    {#each routes as route}
      <a
        href={`/${route.toLowerCase()}`}
        class="text-gray-300 hover:bg-sky-400 hover:text-white rounded-md px-3 text-lg font-semibold" 
        class:text-white = { currentRoute.startsWith(route.toLowerCase()) }
        >{ route } 
      </a>
    {/each}
  </div>
  <!-- dynamic sub menu -->
  {#if subMenu.length}
    <div class="bg-sky-500 flex items-center space-x-2 justify-center py-1">
      {#each subMenu as route}
        <a href={route.path}
          class="text-gray-300 hover:bg-sky-400 hover:text-white rounded-md px-3 text-base font-medium"
          class:text-white = { currentRoute.startsWith(route.path.slice(1)) }
        >{ route.name }</a>
      {/each}
    </div>
  {/if}
  </div>
</header>

<!-- main content -->
<main class="mx-auto max-w-5xl py-10">
  {@render children?.()}
</main>

<!-- Footer -->
<footer class="bg-gray-400 text-white flex justify-between p-4">
  <div>@samhess/svelte-components</div>
  <div >
    <a class="text-white" href="https://www.linkedin.com/in/samhess/" target="_blank">
      Contact <Mail size="20" class="inline pb-1"/>
    </a>
  </div>
</footer>