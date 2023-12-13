<template>
  <div class="font-incosolata flex h-screen flex-col items-center justify-center">
    <HitagiIconHeader class="text-themed-600" />
    <h1 class="mt-2 font-bold text-themed-700 dark:text-themed-400">Hitagi</h1>
    <hr class="server-width my-4 border-themed-500" />
    <div class="server-width flex flex-col flex-wrap">
      <slot />
    </div>
    <DarkToggle class="mt-4 h-10 w-10 text-themed-600 dark:text-themed-400" />
  </div>
</template>
