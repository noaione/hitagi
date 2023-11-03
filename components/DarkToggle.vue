<template>
  <button :class="'h-8 w-8 ' + ($props.class ?? '') + ' group '" @click="toggle">
    <Icon
      name="heroicons-outline:moon"
      class="h-[95%] w-[95%] transition-opacity group-hover:opacity-80"
      v-if="colorMode.value === 'light'"
    />
    <Icon name="heroicons-outline:sun" class="h-full w-full transition-opacity group-hover:opacity-80" v-else />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

defineProps<{
  class?: string;
}>();

function toggle() {
  colorMode.preference = colorMode.value === "light" ? "dark" : "light";
}
</script>
