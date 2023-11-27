<template>
  <div v-if="!search.unfetched" :class="`flex flex-row items-center ${containerClass ?? ''}`">
    <button class="group disabled:cursor-not-allowed" :disabled="search.currentPageIndex === 0" @click="updatePage(0)">
      <ReaderNavIcon name="mdi:chevron-double-left" />
    </button>
    <div class="inline-block">
      <button
        :disabled="search.currentPageIndex < 1"
        class="group ml-2 disabled:cursor-not-allowed"
        @click="updatePage(search.currentPageIndex - 1)"
      >
        <ReaderNavIcon name="mdi:chevron-left" />
      </button>
    </div>
    <button
      class="mx-2 text-sm text-themed-400 transition hover:text-opacity-80 disabled:text-opacity-80"
      :disabled="search.loading"
      @click="$emit('openPage')"
    >
      {{ search.loading ? "Loading..." : `Page ${search.currentPageIndex + 1}/${search.maxPage}` }}
    </button>
    <div class="inline-block">
      <button
        :disabled="search.currentPageIndex >= search.maxPage - 1"
        class="group mr-2 disabled:cursor-not-allowed"
        @click="updatePage(search.currentPageIndex + 1)"
      >
        <ReaderNavIcon name="mdi:chevron-right" />
      </button>
    </div>

    <button
      class="group disabled:cursor-not-allowed"
      :disabled="search.currentPageIndex === search.maxPage - 1"
      @click="updatePage(search.maxPage - 1)"
    >
      <ReaderNavIcon name="mdi:chevron-double-right" />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  containerClass?: string;
}>();

defineEmits<{
  (e: "openPage"): void;
}>();

const search = useLRRSearch();

function updatePage(pageIndex: number) {
  search.navigatePage(pageIndex);
}
</script>
