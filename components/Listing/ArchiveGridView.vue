<template>
  <div v-if="searchEngine.currentSearchSlice.length > 0" class="flex flex-row flex-wrap justify-center gap-2">
    <ArchiveGridInfo
      v-for="item in searchEngine.currentSearchSlice"
      :key="item.arcid"
      :data="item"
      :compact="config.listCompact"
    />
  </div>
</template>

<script setup lang="ts">
const searchEngine = useLRRSearch();
const config = useLRRConfig();
</script>
