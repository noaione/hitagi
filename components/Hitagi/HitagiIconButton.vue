<template>
  <NuxtLink v-if="href" :to="href" :class="$props.containerClass" title="Settings">
    <Icon
      :name="name"
      :class="`text-themed-600 dark:text-themed-300 h-8 w-8 transition-opacity hover:opacity-80 ${$props.class ?? ''}`"
    />
  </NuxtLink>
  <button v-else :class="$props.containerClass" @click="$emit('click')">
    <Icon
      :name="name"
      :class="`text-themed-600 dark:text-themed-300 h-8 w-8 transition-opacity hover:opacity-80 ${$props.class ?? ''}`"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  href?: string;
  containerClass?: string;
  class?: string;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>
