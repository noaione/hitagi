<template>
  <div class="font-inter mx-auto flex h-full min-h-screen flex-col py-2 md:py-4 lg:py-8">
    <AppHeader />
    <main class="mx-2 md:mx-4 lg:mx-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
