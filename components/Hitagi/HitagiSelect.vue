<template>
  <div :class="`flex flex-col ${containerClass ?? ''}`">
    <slot name="label" />
    <select v-bind="$attrs" :id="inputId" v-model="inputModel" :class="inputFormClass" :disabled="disabled">
      <slot />
    </select>
  </div>
</template>

<script setup lang="ts">
import clsx from "clsx";

const props = defineProps<{
  inputId?: string;
  class?: string;
  modelValue?: any;
  containerClass?: string;
  disabled?: boolean;
  color?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const slots = useSlots();

const inputModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const validColors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
  "hitagi",
  "orange",
  "cyan",
  "emerald",
  "themed",
] as const;

type ValidColor = (typeof validColors)[number];

const selectedColor = computed(() => {
  const col = props.color ?? "themed";

  return validColors.includes(col as ValidColor) ? col : "themed";
});

const inputFormClass = clsx(
  "form-select rounded-md bg-white transition disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-gray-800 disabled:dark:bg-gray-900",
  `input-hb-${selectedColor.value}`,
  slots.label ? "mt-1" : "mt-0",
  props.class
);
</script>

<style scoped lang="postcss">
.input-hb-themed {
  @apply border-themed-600 focus:border-themed-400 focus:ring-themed-500 disabled:border-themed-700;
}

.input-hb-hitagi {
  @apply border-hitagi-600 focus:border-hitagi-400 focus:ring-hitagi-500 disabled:border-hitagi-700;
}

.input-hb-gray {
  @apply border-gray-600 focus:border-gray-400 focus:ring-gray-500 disabled:border-gray-700;
}

.input-hb-red {
  @apply border-red-600 focus:border-red-400 focus:ring-red-500 disabled:border-red-700;
}

.input-hb-yellow {
  @apply border-yellow-600 focus:border-yellow-400 focus:ring-yellow-500 disabled:border-yellow-700;
}

.input-hb-green {
  @apply border-green-600 focus:border-green-400 focus:ring-green-500 disabled:border-green-700;
}

.input-hb-blue {
  @apply border-blue-600 focus:border-blue-400 focus:ring-blue-500 disabled:border-blue-700;
}

.input-hb-indigo {
  @apply border-indigo-600 focus:border-indigo-400 focus:ring-indigo-500 disabled:border-indigo-700;
}

.input-hb-purple {
  @apply border-purple-600 focus:border-purple-400 focus:ring-purple-500 disabled:border-purple-700;
}

.input-hb-pink {
  @apply border-pink-600 focus:border-pink-400 focus:ring-pink-500 disabled:border-pink-700;
}

.input-hb-orange {
  @apply border-orange-600 focus:border-orange-400 focus:ring-orange-500 disabled:border-orange-700;
}

.input-hb-cyan {
  @apply border-cyan-600 focus:border-cyan-400 focus:ring-cyan-500 disabled:border-cyan-700;
}

.input-hb-emerald {
  @apply border-emerald-600 focus:border-emerald-400 focus:ring-emerald-500 disabled:border-emerald-700;
}
</style>
