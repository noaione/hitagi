<template>
  <header>
    <div class="mx-2 flex flex-row justify-between md:mx-4 lg:mx-8">
      <div class="flex flex-row items-center">
        <NuxtLink to="/">
          <HitagiIconHeader class="transform-gpu text-themed-600 transition hover:scale-110 dark:text-themed-300" />
        </NuxtLink>
        <h1 class="ml-2 select-none text-2xl font-bold text-themed-600 dark:text-themed-300">Hitagi</h1>
      </div>
      <div class="flex flex-row items-center gap-2">
        <NuxtLink href="/search" title="Search">
          <Icon
            name="heroicons:magnifying-glass"
            class="h-8 w-8 text-themed-600 transition-opacity hover:opacity-80 dark:text-themed-300"
          />
        </NuxtLink>
        <NuxtLink href="/settings" title="Settings">
          <Icon
            name="heroicons:cog-8-tooth"
            class="h-8 w-8 text-themed-600 transition-opacity hover:opacity-80 dark:text-themed-300"
          />
        </NuxtLink>
        <DarkToggle class="text-themed-600 transition-opacity hover:opacity-80 dark:text-themed-300" />
      </div>
    </div>
    <div class="flex w-full flex-row justify-center pb-2 pt-4">
      <hr class="mx-2 w-full border-themed-400 md:mx-4 lg:mx-8" />
    </div>
  </header>
</template>
