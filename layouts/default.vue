<template>
  <div class="mx-auto py-2 md:py-4 lg:py-8 font-inter h-full min-h-screen flex flex-col">
    <AppHeader />
    <main class="mx-2 md:mx-4 lg:mx-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
