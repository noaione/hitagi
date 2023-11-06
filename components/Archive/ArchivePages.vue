<template>
  <VirtualGrid
    v-if="items.length > 1"
    :length="items.length"
    :page-size="28"
    :page-provider="pageProvider"
    class="archive-pages-grid"
  >
    <template #probe>
      <ArchiveThumb
        :arc-id="arcId"
        :page="items[0]"
        :href="`/archive/${arcId}/read`"
        class="mx-auto hidden h-48 w-[9rem] rounded-lg transition-opacity hover:opacity-80 md:h-[22rem] md:w-[15.25rem]"
      />
    </template>
    <template #default="{ item, style }">
      <ArchiveThumb
        :arc-id="arcId"
        :page="item"
        :style="style"
        :href="`/archive/${arcId}/read?page=${item}`"
        class="mx-auto h-48 w-[9rem] rounded-lg transition-opacity hover:opacity-80 md:h-[22rem] md:w-[15.25rem]"
        auto-refresh
      />
    </template>
  </VirtualGrid>
</template>

<script setup lang="ts">
import VirtualGrid from "vue-virtual-scroll-grid";

const props = defineProps<{
  arcId: string;
  totalPages: number;
}>();

const items = Array.from({ length: props.totalPages })
  .fill(0)
  .map((_, i) => i + 1);

function pageProvider(pageNumber: number, pageSize: number) {
  const slice = items.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);

  return Promise.resolve(slice);
}
</script>

<style scoped lang="postcss">
.archive-pages-grid {
  @apply grid items-center justify-center gap-2;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
}

@media (min-width: 768px) {
  .archive-pages-grid {
    grid-template-columns: repeat(auto-fill, minmax(15.25rem, 1fr));
  }
}
</style>
