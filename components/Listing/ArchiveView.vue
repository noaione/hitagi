<template>
  <div v-if="!search.loading" :class="`block ${$props.class ?? ''}`">
    <ListingArchiveGridView v-if="config.listMode === 'grid'" />
    <ListingArchiveListView v-else />
  </div>
  <ListingLoadingIndicator v-else :pending="search.loading" :class="$props.class" />
</template>

<script setup lang="ts">
defineProps<{
  class?: string;
}>();

const search = useLRRSearch();
const config = useLRRConfig();
</script>
