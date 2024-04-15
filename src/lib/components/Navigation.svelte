<script lang="js">
  import { goto } from '$app/navigation'
  import { page, navigating } from '$app/stores'
  export let menu
  /** @type {Object.<string, any>} */
  const navigation = {
    main: [ 'Home', 'Charts', 'Tables', 'Icons'], 
    user: [
      { name: 'Profile', path: '/user/profile'},
      { name: 'Logout', path: '/user/profile'},
    ]
  }
  navigation.menu = menu
  const pages = Object.keys(import.meta.glob(['/src/routes/**/+page.svelte']))
  let hideUserMenu = true
  /** @type {Object.<string, any>[]} */
  let childRoutes = []
  $: onRouteChange($navigating)
  $: childRoutes = getChildRoutes($page.route)

  /** @param {Object<string,any>|null} nav */
  function onRouteChange(nav) {
    if (nav) console.log(`navigation from ${nav.from.route.id} to ${nav.to.route.id}`)
  }

  /**
   * @param {Object.<string, any>} route
  */
  function getChildRoutes(route) {
    const routes = new Array()
    if (route.id) {
      const mainMenuItem = route.id.split('/')[1]
      let subMenuItems = pages.filter(item => item.includes(`/src/routes/${mainMenuItem}/`) && !item.includes(`/src/routes/user/`))
      for (const subMenuItem of subMenuItems) {
        let name = subMenuItem.split('/')[4]
        if (!name.includes('+page.svelte') && !name.endsWith(']')) { // skip the parant page and slugs
          const path = `/${mainMenuItem}/${name}`
          const linkName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g,' ')
          if (!routes.find(route => route.path === path)) { // only add once
            routes.push({path, name: linkName})
          }
        }
      }
      routes.sort((a,b) => a.name.localeCompare(b.name))
    } else {
      // console.log(`invalid route ${route.id}`)
    }
    return routes
  }

  /** 
   * @param {string} path
   * @param {Object.<string, any>} currentRoute
  */
  function isCurrentRoute(path, currentRoute, checkLevel=1) {
    if (path && currentRoute.id) {
      const [foo, level1, level2] = currentRoute.id.split('/')
      if (checkLevel===1) {
        return path.toLowerCase().startsWith(level1)
      } else if (checkLevel===2) {
        // console.log(`${path} ?=? ${currentRoute.id}`)
        return path === `/${level1}/${level2}`
      }
    } else {
      return false
    }
  }

  async function userRouteClick(route={name:undefined}) {
    if (route.name==='Logout') {
      goto('/user/logout')
      console.log('signed out')
    }
    hideUserMenu = true
  }
</script>  
  
  
<!-- top navigation -->
<header class="bg-sky-500">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <div class="flex bg-slate-100 rounded-full" title="moontreade.ch">
        <!-- <MoonIcon class="h-8 w-8 p-1 text-yellow-500"/> -->
      </div>
      <div class="hidden md:block">
        <div class="flex items-baseline space-x-2 justify-center">
          {#each navigation.main as route}
            <a
              href={`/${route.toLowerCase()}`}
              class="text-gray-300 hover:bg-sky-400 hover:text-white rounded-md px-3 py-1.5 font-medium" 
              class:text-white = { isCurrentRoute(route, $page.route) }
              >{ route }
            </a>
          {/each}
        </div>
        <!-- dynamic sub menu -->
        <div class="flex items-center space-x-2 justify-center">
          {#each childRoutes as childRoute}
            <a href="{childRoute.path}"
              class="text-gray-300 hover:bg-sky-400 hover:text-white rounded-md px-3 font-medium"
              class:text-white = { isCurrentRoute(childRoute.path, $page.route, 2) }
            >{ childRoute.name }</a>
          {/each}
        </div>
      </div>
      <div class="hidden md:block">
        <div class="ml-4 flex items-center md:ml-6">
          <!-- Profile dropdown -->
          {#if $page.data.session}
            <div class="relative ml-3">
              <div>
                <button class="flex max-w-xs items-center rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  on:click={()=>hideUserMenu = false}
                >
                  <span class="h-8 w-8 rounded-full text-2xl text-primary-700">{$page.data.user.name.charAt(0).toUpperCase() }</span>
                </button>
              </div>
                <ul class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    class:hidden = {hideUserMenu}
                >
                  {#each navigation.user as userRoute}
                    <li>
                      <a href={userRoute.path}
                        class="block px-4 py-2 text-sm text-gray-700"
                        on:click = { ()=>userRouteClick(userRoute) } 
                      >{ userRoute.name }
                      </a>
                    </li>
                  {/each}
                </ul>
            </div>
          {:else}
            <a class="me-2 text-white" href="/user/login">Login</a>
          {/if}
        </div>
      </div>
      <div class="-mr-2 flex md:hidden">
        <!-- Mobile menu button -->
        <button class="inline-flex items-center justify-center rounded-md bg-sky-800 p-2 text-gray-400 hover:bg-sky-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-800">
          <span class="sr-only">Open main menu</span>
          Open
          <!-- <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
          <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" /> -->
        </button>
      </div>
    </div>
  </div>
</header>


<!-- Mobile menu -->
<div class="md:hidden">
  <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
    {#each navigation.main as route}
      <a href="{`/${route.toLowerCase()}`}"
        class="text-gray-300 hover:bg-sky-400 hover:text-white block rounded-md px-3 py-1.5 text-base font-medium" 
        class:text-white = { isCurrentRoute(route, $page.route) }
        >{ route }
      </a>
    {/each}
  </div>
  <div class="flex items-center space-x-2 justify-center">
    {#each childRoutes as childRoute}
      <a href="{childRoute.path}"
        class="text-gray-300 hover:bg-sky-400 hover:text-white rounded-md px-3 font-medium"
        class:text-white = { isCurrentRoute(childRoute.path, $page.route, 2) }
      >{ childRoute.name }</a>
    {/each}
  </div>
  <div class="border-t border-sky-700 pt-4 pb-3">
    {#if $page.data.session}
      <div class="flex items-center px-5">
        <div class="flex justify-center text-center">
          <span class="h-8 w-8 rounded-full text-2xl bg-gray-100 text-sky-800">{ $page.data.session?.user?.name?.slice(0,1).toUpperCase() }</span>
        </div>
        <div class="ml-3">
          <div class="text-base font-medium leading-none text-white">{ $page.data.session?.user?.email }</div>
        </div>
      </div>
      <div class="mt-3 space-y-1 px-2">
        {#each navigation.user as userRoute}
        <li>
          <a href={userRoute.path}
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-sky-600 hover:text-white"
            on:click = {()=>userRouteClick(userRoute)} 
          >{ userRoute.name }
          </a>
        </li>
      {/each}
      </div>
    {:else}
      <div class="mt-3 space-y-1 px-2">
        <a class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-sky-600 hover:text-white" href="/user/login">Login</a>
      </div>
    {/if}
  </div>
</div>