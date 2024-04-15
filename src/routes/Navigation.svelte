<script lang="js">
  import { page } from '$app/stores'
  const menu = [ 'Home', 'Charts', 'Forms', 'Icons', 'Tables']

  function getCurrentRoute(path) {
    return path.replace(/^\//,'')
  }
  
  let currentRoute
  $: currentRoute = getCurrentRoute($page.route.id)
</script>  
  
  
<!-- top navigation -->
<header class="bg-sky-500">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <div class="flex bg-slate-100 rounded-full">
      </div>
      <div class="hidden md:block">
        <div class="flex items-baseline space-x-2 justify-center">
          {#each menu as item}
            <a
              href={`/${item.toLowerCase()}`}
              class="text-gray-300 hover:bg-sky-400 hover:text-white rounded-md px-3 py-1.5 font-medium" 
              class:text-white = { currentRoute === item.toLowerCase() }
              >{ item }
            </a>
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