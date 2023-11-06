<template>
  <div :class="`block ${$props.class ?? ''}`">
    <ListingArchiveGridView v-if="config.listMode === 'grid'" />
    <ListingArchiveListView v-else />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  class?: string;
}>();

const config = useLRRConfig();
</script>
