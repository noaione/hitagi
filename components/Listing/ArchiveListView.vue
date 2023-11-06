<template>
  <div v-if="searchEngine.currentSearchSlice.length > 0" class="flex w-full flex-col gap-2">
    <ArchiveListInfo
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
