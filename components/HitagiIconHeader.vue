<template>
  <IconCrab v-if="theme === 'hitagi'" :class="$props.class" />
  <IconSnail v-else-if="theme === 'hachikuji'" :class="$props.class" />
  <IconBat v-else-if="theme === 'shinobu'" :class="$props.class" />
</template>

<script setup lang="ts">
defineProps<{
  class?: string;
}>();

const theme = useLRRTheme();
</script>
