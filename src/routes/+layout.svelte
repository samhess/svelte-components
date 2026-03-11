<script lang="ts">
  import type {LayoutProps} from './$types.ts'
  import {page} from '$app/state'
  import Mail from '@lucide/svelte/icons/mail'
  import '../app.css'
  const {data, children}: LayoutProps = $props()
  // svelte-ignore state_referenced_locally
  const routeNames = Array.from(Object.values(data.routes)).map((item:any) => item.name)

  let breadcrumb = $derived(page.route.id?.slice(1).replaceAll('/', ' > ') ?? '')
  let currentRoute = $derived(page.route.id?.replace(/^\//, '') ?? '')
  let match = $derived(page.route.id?.match(/^\/(?<segment1>[^/]*)\//))
  let segment1 = $derived(match?.groups?.segment1 ?? 'home')
  let childRoutes = $derived(data.routes[segment1]?.children ?? [])
</script>

<svelte:head>
  <title>@samhess/svelte-components &mdash; {breadcrumb}</title>
</svelte:head>

<div class="container">
  <!-- top navigation -->
  <header class="bg-sky-500">
    <!-- menu -->
    <div class="block">
      <!-- main menu -->
      <div class="flex items-center justify-center space-x-2 bg-sky-600 py-1">
        {#each routeNames as route}
          <a
            href={`/${route.toLowerCase()}`}
            class="rounded-md px-3 text-lg font-semibold text-gray-300 hover:bg-sky-400 hover:text-white"
            class:text-white={currentRoute.startsWith(route.toLowerCase())}
            >{route}
          </a>
        {/each}
      </div>
      <!-- dynamic sub menu -->
      {#if childRoutes.length}
        <div class="flex items-center justify-center space-x-2 bg-sky-500 py-1">
          {#each childRoutes as route}
            <a
              href={`/${segment1}/${route.toLowerCase().replace(/\s/g, '-')}`}
              class="rounded-md px-3 text-base font-medium text-gray-300 hover:bg-sky-400 hover:text-white"
              class:text-white={currentRoute.endsWith(route.toLowerCase().replace(/\s/g, '-'))}
              >{route}</a
            >
          {/each}
        </div>
      {/if}
    </div>
  </header>

  <!-- main content -->
  <main class="mx-auto max-w-5xl py-10">
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="flex justify-between bg-gray-400 p-4 text-white">
    <div>@samhess/svelte-components</div>
    <div>
      <a class="text-white" href="https://www.linkedin.com/in/samhess/" target="_blank">
        Contact <Mail size="20" class="inline pb-1" />
      </a>
    </div>
  </footer>
</div>
