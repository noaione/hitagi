<template>
  <ModalContainer
    v-model:show="modalOpen"
    class="flex h-[80vh] w-screen flex-col !bg-gray-100 dark:!bg-gray-900 md:w-[80vw] lg:w-[60vw]"
    @close="$emit('update:open', false)"
  >
    <template #header>
      <div class="block text-lg font-bold">Navigate Page</div>
    </template>
    <template #footer>
      <div class="flex flex-col">
        <HitagiButton @click="$emit('update:open', false)">Close</HitagiButton>
      </div>
    </template>

    <HitagiRadioContainer
      class="mx-auto h-[60vh] w-full flex-grow flex-row flex-wrap items-center justify-start gap-4 overflow-x-hidden overflow-y-scroll"
      container-class="min-w-0 flex-grow min-h-0"
    >
      <HitagiRadioBlock
        v-for="pageData in pagedData"
        :key="`page-nav-home-${pageData}`"
        v-model="pageNumber"
        :value="pageData"
        filled
      >
        <div class="block h-10 w-10 p-2 text-center">
          {{ pageData }}
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
  </ModalContainer>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const searchEngine = useLRRSearch();

const modalOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const pagedData = computed(() => {
  return Array.from({ length: searchEngine.maxPage }).map((_, index) => index + 1);
});

const pageNumber = computed({
  get: () => searchEngine.currentPageIndex + 1,
  set: (pageValue) => {
    modalOpen.value = false;

    searchEngine.navigatePage(pageValue - 1);
  },
});
</script>
