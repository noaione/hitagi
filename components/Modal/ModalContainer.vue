<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" ref="backdrop" class="modal-mask backdrop-blur-md" @click="backdropClick">
        <div :class="`modal-container ${$props.class ?? ''}`">
          <div class="modal-header">
            <slot name="header" />
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div class="float-right mt-auto">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  class?: string;
}>();

const emit = defineEmits<{
  (e: "update:show"): void;
  (e: "close"): void;
}>();

const backdrop = ref();

function backdropClick(e: Event) {
  if (backdrop && e.target === backdrop.value) {
    emit("close");
  }
}
</script>

<style scoped lang="postcss">
.modal-mask {
  @apply fixed left-0 top-0 z-[9998] flex h-full w-full bg-black bg-opacity-50 transition-opacity;
}

.modal-container {
  @apply m-auto flex flex-col rounded-md bg-gray-800 px-8 py-6 transition-all;
}

.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  @apply mx-0 my-5;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-leave-to .modal-container {
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
}
</style>
