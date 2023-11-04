<template>
  <header>
    <div class="mx-2 flex flex-row justify-between md:mx-4 lg:mx-8">
      <div class="flex flex-row items-center">
        <NuxtLink to="/">
          <CrabIcon class="transform-gpu text-hitagi-600 transition hover:scale-110 dark:text-hitagi-300" />
        </NuxtLink>
        <h1 class="ml-2 select-none text-2xl font-bold text-hitagi-600 dark:text-hitagi-300">Hitagi</h1>
      </div>
      <div class="flex flex-row items-center gap-2">
        <NuxtLink v-if="$route.fullPath.startsWith('/admin')" href="/" title="Home">
          <Icon
            name="heroicons-outline:home"
            class="h-8 w-8 text-hitagi-600 transition-opacity hover:opacity-80 dark:text-hitagi-300"
          />
        </NuxtLink>
        <NuxtLink v-if="!$route.fullPath.startsWith('/admin')" href="/admin" title="Admin">
          <Icon
            name="heroicons-outline:server"
            class="h-8 w-8 text-hitagi-600 transition-opacity hover:opacity-80 dark:text-hitagi-300"
          />
        </NuxtLink>
        <DarkToggle class="text-hitagi-600 transition-opacity hover:opacity-80 dark:text-hitagi-300" />
      </div>
    </div>
    <div class="flex w-full flex-row justify-center pb-2 pt-4">
      <hr class="mx-2 w-full border-hitagi-400 md:mx-4 lg:mx-8" />
    </div>
  </header>
</template>
