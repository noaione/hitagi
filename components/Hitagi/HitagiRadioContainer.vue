<template>
  <div :class="`flex flex-col ${containerClass ?? ''}`">
    <slot name="label" />
    <div :class="`flex ${$slots.label ? 'mt-1' : ''} ${$props.class ?? ''}`">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  containerClass?: string;
  class?: string;
}>();
</script>
