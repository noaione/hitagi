<template>
  <Icon
    :name="name"
    class="h-6 w-6 text-themed-600 transition-opacity hover:opacity-80 group-disabled:text-themed-900 group-disabled:opacity-60 group-disabled:hover:opacity-60 dark:text-themed-300"
  />
</template>

<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>
