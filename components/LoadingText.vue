<template>
  <span :class="$props.class">Loading{{ ".".repeat(dotNots) }}</span>
</template>

<script setup lang="ts">
const dotNots = ref(1);

const props = defineProps<{
  delay?: number;
  class?: string;
}>();

function startAnimation() {
  setInterval(() => {
    if (dotNots.value === 3) {
      dotNots.value = 1;
    } else {
      dotNots.value++;
    }
  }, props.delay ?? 500);
}

onMounted(() => {
  startAnimation();
});
</script>
