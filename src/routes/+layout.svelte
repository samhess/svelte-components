<script lang="ts">
  import type {LayoutProps} from './$types.ts'
  import {page} from '$app/state'
  import Mail from '@lucide/svelte/icons/mail'
  import '../app.css'

  let {data, children}: LayoutProps = $props()
  let routes = $derived(data.routes)
  let segment1 = $derived(data.path.segment1)
  let segment2 = $derived(data.path.segment2)
  let breadcrumb = $derived(page.route.id?.slice(1).replaceAll('/', ' > ') ?? '')
</script>

<svelte:head>
  <title>@samhess/svelte-components &mdash; {breadcrumb}</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
  <!-- top navigation -->
  <header class="bg-sky-500">
    <!-- main menu -->
    <div class="flex items-center justify-center space-x-2 bg-sky-600 py-1">
      {#each Object.keys(routes) as path}
        <a
          href={`/${path}`}
          class="rounded-md px-3 text-lg font-semibold text-gray-300 hover:bg-sky-400 hover:text-white"
          class:text-white={segment1 === path}
          >{routes[path].name}
        </a>
      {/each}
    </div>
    <!-- dynamic sub menu -->
    {#if data.routes[segment1]?.children}
      {@const routes = data.routes[segment1].children}
      <div class="flex items-center justify-center space-x-2 bg-sky-500 py-1">
        {#each routes as route}
          <a
            href={`/${segment1}/${route.toLowerCase()}`}
            class="rounded-md px-3 text-base font-medium text-gray-300 hover:bg-sky-400 hover:text-white"
            class:text-white={segment2 === route.toLowerCase()}>{route}</a
          >
        {/each}
      </div>
    {/if}
  </header>

  <!-- main content -->
  <main class="container mx-auto max-w-5xl py-10">
    {@render children()}
  </main>

  <!-- footer -->
  <footer class="mt-auto flex justify-between bg-gray-400 p-4 text-white">
    <div>@samhess/svelte-components</div>
    <div>
      <a class="text-white" href="https://www.linkedin.com/in/samhess/" target="_blank">
        Contact <Mail size="20" class="inline pb-1" />
      </a>
    </div>
  </footer>
</div>
