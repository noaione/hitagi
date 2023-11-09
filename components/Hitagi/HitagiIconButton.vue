<template>
  <NuxtLink v-if="href" :to="href" :class="$props.containerClass" title="Settings">
    <Icon
      :name="name"
      :class="`h-8 w-8 text-hitagi-600 transition-opacity hover:opacity-80 dark:text-hitagi-300 ${$props.class ?? ''}`"
    />
  </NuxtLink>
  <button v-else :class="$props.containerClass" @click="$emit('click')">
    <Icon
      :name="name"
      :class="`h-8 w-8 text-hitagi-600 transition-opacity hover:opacity-80 dark:text-hitagi-300 ${$props.class ?? ''}`"
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
