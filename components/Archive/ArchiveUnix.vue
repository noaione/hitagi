<template>
  <span :class="$props.class">
    {{ text }}: <time :datetime="formatDatetime" :class="$props.innerClass">{{ formatUnix }}</time>
  </span>
</template>

<script setup lang="ts">
const { unix } = defineProps<{
  unix: number;
  text: string;
  class?: string;
  innerClass?: string;
}>();

const formatUnix = computed(() => {
  const date = new Date(unix * 1000);

  return date.toLocaleString();
});

const formatDatetime = computed(() => {
  const date = new Date(unix * 1000);

  return date.toISOString();
});
</script>
