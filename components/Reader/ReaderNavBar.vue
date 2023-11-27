<template>
  <Transition :name="bottom ? 'reader-bar' : 'reader-bar-2'">
    <div
      v-show="reader.navigationBar"
      :class="`flex w-full min-w-[100vw] flex-row bg-gray-800 py-2 ${
        pinned ? (bottom ? 'fixed top-0 z-20' : 'fixed bottom-0 z-20') : ''
      } ${bottom ? 'justify-between' : 'justify-center'}`"
    >
      <div v-if="bottom" class="ml-2 block">
        <NuxtLink :to="`/archive/${arcId}`">
          <Icon
            name="material-symbols:keyboard-backspace-rounded"
            class="h-6 w-6 text-themed-600 transition-opacity hover:opacity-80 dark:text-themed-300"
          />
        </NuxtLink>
      </div>
      <div class="flex flex-row items-center gap-3">
        <button
          class="group disabled:cursor-not-allowed"
          :disabled="reader.currentPairIndex === 0"
          @click="updatePage(reader.firstPages)"
        >
          <ReaderNavIcon name="mdi:chevron-double-left" />
        </button>
        <div class="inline-block">
          <button
            :disabled="reader.previousPage?.[0] === undefined"
            class="group disabled:cursor-not-allowed"
            @click="updatePage(reader.previousPage)"
          >
            <ReaderNavIcon name="mdi:chevron-left" />
          </button>
        </div>
        <span
          class="cursor-pointer text-sm text-themed-400 transition hover:text-opacity-75"
          @click="$emit('openPages')"
        >
          Page {{ fmtPage }}/{{ reader.maxPage }}
        </span>
        <div class="inline-block">
          <button
            :disabled="reader.nextPage.length === 0"
            class="group disabled:cursor-not-allowed"
            @click="updatePage(reader.nextPage)"
          >
            <ReaderNavIcon name="mdi:chevron-right" />
          </button>
        </div>

        <button
          class="group disabled:cursor-not-allowed"
          :disabled="reader.currentPairIndex === reader.pairedImages.length - 1"
          @click="updatePage(reader.lastPages)"
        >
          <ReaderNavIcon name="mdi:chevron-double-right" />
        </button>
      </div>
      <div v-if="$props.bottom" class="mr-2 block" @click="$emit('openSettings')">
        <ReaderNavIcon name="heroicons:cog-8-tooth" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  arcId: string;
  pinned?: boolean;
  bottom?: boolean;
}>();

defineEmits<{
  (e: "openSettings"): void;
  (e: "openPages"): void;
}>();

const reader = useLRRReader();

function updatePage(pageNum: number[]) {
  reader.updatePage(pageNum);
}

const fmtPage = computed(() => {
  return reader.pageIndicator.join("-");
});
</script>

<style scoped lang="postcss">
/* create animation going from top to bottom */
.reader-bar-enter-active,
.reader-bar-leave-active {
  transition: all 0.5s ease;
}

.reader-bar-enter-from,
.reader-bar-leave-to {
  transform: translateY(-100%);
}

/* reverse animation going from bottom to top */
.reader-bar-2-enter-active,
.reader-bar-2-leave-active {
  transition: all 0.5s ease;
}

.reader-bar-2-enter-from,
.reader-bar-2-leave-to {
  transform: translateY(100%);
}
</style>
