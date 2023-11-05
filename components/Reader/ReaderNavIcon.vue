<template>
  <Icon
    :name="name"
    class="h-6 w-6 text-hitagi-600 transition-opacity hover:opacity-80 group-disabled:text-hitagi-900 group-disabled:opacity-60 group-disabled:hover:opacity-60 dark:text-hitagi-300"
  />
</template>

<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>
