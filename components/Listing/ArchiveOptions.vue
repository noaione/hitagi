<template>
  <div class="flex flex-row items-center gap-2">
    <div class="block" title="Compact mode">
      <HitagiIconButton
        v-if="!config.listCompact && config.listMode === 'list'"
        name="heroicons:bars-2"
        class="h-5 w-5"
        @click="config.listCompact = true"
      />
      <HitagiIconButton
        v-else-if="config.listCompact && config.listMode === 'list'"
        name="heroicons:bars-4"
        class="h-5 w-5"
        @click="config.listCompact = false"
      />
      <HitagiIconButton
        v-if="!config.listCompact && config.listMode === 'grid'"
        name="mdi:view-grid-outline"
        class="h-5 w-5"
        @click="config.listCompact = true"
      />
      <HitagiIconButton
        v-else-if="config.listCompact && config.listMode === 'grid'"
        name="mdi:view-grid-compact"
        class="h-5 w-5"
        @click="config.listCompact = false"
      />
    </div>
    <div class="block" title="List mode">
      <HitagiIconButton
        v-if="config.listMode === 'grid'"
        name="heroicons:square-3-stack-3d"
        class="h-5 w-5"
        @click="config.listMode = 'list'"
      />
      <HitagiIconButton v-else name="heroicons:list-bullet" class="h-5 w-5" @click="config.listMode = 'grid'" />
    </div>
    <div class="block" title="Order">
      <HitagiIconButton v-if="config.order === 'asc'" name="heroicons:arrow-up" class="h-5 w-5" @click="toggleOrder" />
      <HitagiIconButton v-else name="heroicons:arrow-down" class="h-5 w-5" @click="toggleOrder" />
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useLRRConfig();
const search = useLRRSearch();

function toggleOrder() {
  const target = config.order === "asc" ? "desc" : "asc";

  config.order = target;

  const pageIndex = toRaw(search.currentPageIndex);

  search.searchDebounced(pageIndex, true, true);
}
</script>
