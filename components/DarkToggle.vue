<template>
  <button :class="'w-8 h-8 ' + ($props.class ?? '') + ' group '" @click="toggle">
    <Icon
      name="heroicons-outline:moon"
      class="w-[95%] h-[95%] group-hover:opacity-80 transition-opacity"
      v-if="colorMode.value === 'light'"
    />
    <Icon name="heroicons-outline:sun" class="w-full h-full group-hover:opacity-80 transition-opacity" v-else />
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
