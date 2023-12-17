<template>
  <Teleport to="body">
    <div :class="`fixed ${location} mx-4 my-4 flex flex-col items-end`" data-hitagi="toaster">
      <TransitionGroup name="toast">
        <HitagiToast
          v-for="toast in toasts.toasts"
          :id="toast.id"
          :key="toast.id"
          :color="typeToColor(toast.type)"
          :message="toast.message"
          :title="toast.title"
          :duration="toast.duration"
          :persist="toast.persist"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import clsx from "clsx";

const props = defineProps<{
  location: "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}>();

const toasts = useHitagiToast();

const location = computed(() => {
  return clsx(
    props.location === "top-left" && "left-0 top-0",
    props.location === "top-right" && "right-0 top-0",
    props.location === "bottom-left" && "bottom-0 left-0",
    props.location === "bottom-right" && "bottom-0 right-0",
    props.location === "top" && "left-1/2 top-0 -translate-x-1/2",
    props.location === "bottom" && "bottom-0 left-1/2 -translate-x-1/2"
  );
});

function typeToColor(type: "success" | "error" | "warning" | "info" | "default"): string {
  switch (type) {
    case "success": {
      return "green";
    }
    case "error": {
      return "red";
    }
    case "warning": {
      return "yellow";
    }
    case "info": {
      return "blue";
    }
    default: {
      return "themed";
    }
  }
}
</script>

<style scoped lang="postcss">
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
