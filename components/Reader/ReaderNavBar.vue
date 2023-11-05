<template>
  <div class="flex w-full min-w-[100vw] flex-row justify-between bg-gray-800 py-2">
    <div class="ml-2 block">
      <NuxtLink :to="`/archive/${arcId}`">
        <Icon
          name="material-symbols:keyboard-backspace-rounded"
          class="h-6 w-6 text-hitagi-600 transition-opacity hover:opacity-80 dark:text-hitagi-300"
        />
      </NuxtLink>
    </div>
    <div class="flex flex-row items-center gap-3">
      <button class="group disabled:cursor-not-allowed" :disabled="page === 1" @click="$emit('updatePage', 1)">
        <Icon name="mdi:chevron-double-left" class="reader-nav-btn" />
      </button>
      <div class="inline-block">
        <button
          :disabled="previousPage === undefined"
          class="group disabled:cursor-not-allowed"
          @click="$emit('updatePage', previousPage ?? page - 1)"
        >
          <Icon name="mdi:chevron-left" class="reader-nav-btn" />
        </button>
      </div>
      <span class="text-sm text-hitagi-400">Page {{ page }}/{{ maxPage }}</span>
      <div class="inline-block">
        <button
          :disabled="nextPage === undefined"
          class="group disabled:cursor-not-allowed"
          @click="$emit('updatePage', nextPage ?? page + 1)"
        >
          <Icon name="mdi:chevron-right" class="reader-nav-btn" />
        </button>
      </div>

      <button
        class="group disabled:cursor-not-allowed"
        :disabled="page === maxPage"
        @click="$emit('updatePage', maxPage)"
      >
        <Icon name="mdi:chevron-double-right" class="reader-nav-btn" />
      </button>
    </div>
    <div class="mr-2 block" @click="$emit('openSettings')">
      <Icon name="heroicons:cog-8-tooth" class="reader-nav-btn" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  arcId: string;
  page: number;
  maxPage: number;
}>();

defineEmits<{
  (e: "updatePage", page: number): void;
  (e: "openSettings"): void;
}>();

const previousPage = computed(() => {
  if (props.page <= 1) {
    return;
  }

  return props.page - 1;
});
const nextPage = computed(() => {
  if (props.page >= props.maxPage) {
    return;
  }

  return props.page + 1;
});
</script>

<style scoped lang="postcss">
.reader-nav-btn {
  @apply h-6 w-6 text-hitagi-600 transition-opacity hover:opacity-80 group-disabled:text-hitagi-900 group-disabled:opacity-60 group-disabled:hover:opacity-60 dark:text-hitagi-300;
}
</style>
