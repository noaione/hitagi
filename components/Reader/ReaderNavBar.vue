<template>
  <div
    :class="`flex w-full min-w-[100vw] flex-row justify-between bg-gray-800 py-2 ${pinned ? 'fixed top-0 z-20' : ''}`"
  >
    <div class="ml-2 block">
      <NuxtLink :to="`/archive/${arcId}`">
        <Icon
          name="material-symbols:keyboard-backspace-rounded"
          class="h-6 w-6 text-hitagi-600 transition-opacity hover:opacity-80 dark:text-hitagi-300"
        />
      </NuxtLink>
    </div>
    <div class="flex flex-row items-center gap-3">
      <button
        class="group disabled:cursor-not-allowed"
        :disabled="reader.firstPages[0] === 1"
        @click="updatePage(reader.firstPages)"
      >
        <ReaderNavIcon name="mdi:chevron-double-left" />
      </button>
      <div class="inline-block">
        <button
          :disabled="reader.previousPage[0] === 1"
          class="group disabled:cursor-not-allowed"
          @click="updatePage(reader.previousPage)"
        >
          <ReaderNavIcon name="mdi:chevron-left" />
        </button>
      </div>
      <span class="text-sm text-hitagi-400">Page {{ fmtPage }}/{{ reader.maxPage }}</span>
      <div class="inline-block">
        <button
          :disabled="reader.nextPage[reader.nextPage.length - 1] === reader.maxPage"
          class="group disabled:cursor-not-allowed"
          @click="updatePage(reader.nextPage)"
        >
          <ReaderNavIcon name="mdi:chevron-right" />
        </button>
      </div>

      <button
        class="group disabled:cursor-not-allowed"
        :disabled="reader.pageIndicator[reader.pageIndicator.length - 1] === reader.maxPage"
        @click="updatePage(reader.lastPages)"
      >
        <ReaderNavIcon name="mdi:chevron-double-right" />
      </button>
    </div>
    <div class="mr-2 block" @click="$emit('openSettings')">
      <ReaderNavIcon name="heroicons:cog-8-tooth" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  arcId: string;
  pinned?: boolean;
}>();

defineEmits<{
  (e: "openSettings"): void;
}>();

const reader = useLRRReader();

function updatePage(pageNum: number[]) {
  reader.updatePage(pageNum);
}

const fmtPage = computed(() => {
  return reader.pageIndicator.join("-");
});
</script>
