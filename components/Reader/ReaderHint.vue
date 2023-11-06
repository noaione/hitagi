<template>
  <Teleport to="body">
    <Transition name="reader-hint">
      <div
        v-if="readerConfig.firstTimeHint"
        ref="backdrop"
        class="fixed top-0 z-[1002] h-screen w-screen bg-black bg-opacity-30 backdrop-blur-md"
        data-reader-hint="1"
        @click="backdropClick"
      >
        <div
          class="reader-hint-container mx-auto flex w-screen translate-y-5 flex-col rounded-lg bg-gray-800 px-6 py-4 text-white md:w-[80vw] lg:w-[60vw]"
        >
          <div class="my-2 flex justify-center text-center text-xl font-semibold">Welcome!</div>
          <div class="flex flex-col">
            <h3 class="font-semibold">Keyboard Shortcut</h3>
            <div class="mt-4 flex min-w-0 flex-col gap-2">
              <div class="flex items-center gap-2">
                <SimpleKbd>← / A</SimpleKbd>
                <SimpleKbd>↑ / W</SimpleKbd>
                <span>Navigate Left/Up</span>
              </div>
              <div class="flex items-center gap-2">
                <SimpleKbd>→ / D</SimpleKbd>
                <SimpleKbd>↓ / S</SimpleKbd>
                <span>Navigate Right/Bottom</span>
              </div>
              <div class="flex items-center gap-2">
                <SimpleKbd>P</SimpleKbd>
                <span>Change flow (single/double/double cover)</span>
              </div>
              <div class="flex items-center gap-2">
                <SimpleKbd>R</SimpleKbd>
                <span>Swap LTR/RTL</span>
              </div>
              <div class="flex items-center gap-2">
                <SimpleKbd>F</SimpleKbd>
                <span>Swap Fit Mode</span>
              </div>
              <div class="flex items-center gap-2">
                <SimpleKbd>L</SimpleKbd>
                <span>Swap Background</span>
              </div>
              <div class="flex items-center gap-2">
                <SimpleKbd>N</SimpleKbd>
                <span>Toggle Navigation</span>
              </div>
              <div class="flex items-center gap-2">
                <SimpleKbd>C</SimpleKbd>
                <span>Open Settings</span>
              </div>
              <div class="flex items-center gap-2">
                <SimpleKbd>H</SimpleKbd>
                <span>Open Hint</span>
              </div>
              <div class="flex items-center gap-2">
                <SimpleKbd>ESC</SimpleKbd>
                <span>Close modal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const readerConfig = useLRRReaderConfig();

const backdrop = ref();

function backdropClick(e: Event) {
  if (backdrop && e.target === backdrop.value) {
    readerConfig.firstTimeHint = false;
  }
}
</script>

<style scoped lang="postcss">
.reader-hint-enter-active,
.reader-hint-leave-active {
  transition: all 0.5s ease;
}

.reader-hint-enter-active .reader-hint-container,
.reader-hint-leave-active .reader-hint-container {
  transition: all 0.8s ease;
}

.reader-hint-enter-from,
.reader-hint-leave-to {
  opacity: 0;
}

.reader-hint-enter-from .reader-hint-container,
.reader-hint-leave-to .reader-hint-container {
  transform: translateY(-100%) scale(1.1);
}
</style>
