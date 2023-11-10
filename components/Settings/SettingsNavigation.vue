<template>
  <NuxtLink
    :to="href"
    :external="outbound"
    :rel="outbound ? 'noopener noreferrer' : ''"
    :target="outbound ? '_blank' : ''"
    :no-prefetch="outbound"
  >
    <div
      class="flex w-full flex-row items-center justify-between rounded-md bg-gray-200 px-2 py-3 transition-opacity hover:opacity-80 dark:bg-gray-800"
    >
      <span class="ml-2 font-semibold">{{ name }}</span>
      <Icon v-if="outbound" name="heroicons:arrow-up-right" class="mr-2 block h-6 w-6" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  href: string;
  name: string;
}>();

const outbound = computed(() => {
  return props.href.startsWith("http");
});
</script>
