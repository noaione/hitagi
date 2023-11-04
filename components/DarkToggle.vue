<template>
  <button :class="'h-8 w-8 ' + ($props.class ?? '') + ' group '" @click="toggle">
    <Icon
      v-if="colorMode.value === 'light'"
      name="heroicons-outline:moon"
      class="h-[95%] w-[95%] transition-opacity group-hover:opacity-80"
    />
    <Icon v-else name="heroicons-outline:sun" class="h-full w-full transition-opacity group-hover:opacity-80" />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  class?: string;
}>();

const colorMode = useColorMode();

function toggle() {
  colorMode.preference = colorMode.value === "light" ? "dark" : "light";
}
</script>
