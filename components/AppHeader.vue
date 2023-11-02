<template>
  <header>
    <div class="flex flex-row justify-between mx-2 md:mx-4 lg:mx-8">
      <div class="flex flex-row items-center">
        <CrabIcon class="text-hitagi-600 dark:text-hitagi-300" />
        <h1 class="text-2xl font-bold ml-2 select-none text-hitagi-600 dark:text-hitagi-300">Hitagi</h1>
      </div>
      <div class="flex flex-row items-center gap-2">
        <NuxtLink href="/" title="Home" v-if="$route.fullPath.startsWith('/admin')">
          <Icon
            name="heroicons-outline:home"
            class="w-8 h-8 hover:opacity-80 transition-opacity text-hitagi-600 dark:text-hitagi-300"
          />
        </NuxtLink>
        <NuxtLink href="/admin" title="Admin" v-if="!$route.fullPath.startsWith('/admin')">
          <Icon
            name="heroicons-outline:server"
            class="w-8 h-8 hover:opacity-80 transition-opacity text-hitagi-600 dark:text-hitagi-300"
          />
        </NuxtLink>
        <DarkToggle class="hover:opacity-80 transition-opacity text-hitagi-600 dark:text-hitagi-300" />
      </div>
    </div>
    <div class="flex flex-row justify-center w-full pt-4 pb-2">
      <hr class="mx-2 md:mx-4 lg:mx-8 w-full border-hitagi-400" />
    </div>
  </header>
</template>
