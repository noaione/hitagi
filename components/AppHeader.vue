<template>
  <header>
    <div class="flex flex-row justify-between mx-2 md:mx-4 lg:mx-8">
      <div class="flex flex-row items-center">
        <CrabIcon />
        <h1 class="text-2xl font-bold ml-2 select-none">Hitagi</h1>
      </div>
      <div class="flex flex-row items-center gap-2">
        <NuxtLink href="/" title="Home">
          <Icon name="heroicons-outline:home" class="w-8 h-8 hover:opacity-80 transition-opacity" />
        </NuxtLink>
        <NuxtLink href="/" title="Home">
          <Icon name="heroicons-outline:cog-6-tooth" class="w-8 h-8 hover:opacity-80 transition-opacity" />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
