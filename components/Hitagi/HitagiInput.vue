<template>
  <div :class="`flex ${type === 'checkbox' ? 'flex-row' : 'flex-col'} ${containerClass ?? ''}`">
    <slot v-if="!swap" name="label" />
    <input
      v-bind="$attrs"
      :id="inputId"
      v-model="inputModel"
      :class="inputFormClass"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
    />
    <slot v-if="swap" name="label" />
  </div>
</template>

<script setup lang="ts">
import clsx from "clsx";
import type { InputHTMLAttributes } from "vue";

const props = defineProps<{
  type?: InputHTMLAttributes["type"];
  inputId?: string;
  class?: string;
  modelValue?: any;
  containerClass?: string;
  disabled?: boolean;
  placeholder?: string;
  color?: string;
  swap?: boolean;
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
] as const;

type ValidColor = (typeof validColors)[number];

const selectedColor = computed(() => {
  const col = props.color ?? "hitagi";

  return validColors.includes(col as ValidColor) ? col : "hitagi";
});

const inputFormClass = clsx(
  props.type === "checkbox" ? "form-checkbox" : "form-input",
  "rounded-md bg-white transition disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-gray-800 disabled:dark:bg-gray-900",
  `input-hb-${selectedColor.value}`,
  slots.label ? "mt-1" : "mt-0",
  props.class
);
</script>

<style scoped lang="postcss">
.input-hb-hitagi {
  @apply border-hitagi-600 checked:bg-hitagi-600 focus:border-hitagi-400 focus:ring-hitagi-500 disabled:border-hitagi-700 disabled:checked:bg-hitagi-700;
}

.input-hb-gray {
  @apply border-gray-600 checked:bg-gray-600 focus:border-gray-400 focus:ring-gray-500 disabled:border-gray-700 disabled:checked:bg-gray-700;
}

.input-hb-red {
  @apply border-red-600 checked:bg-red-600 focus:border-red-400 focus:ring-red-500 disabled:border-red-700 disabled:checked:bg-red-700;
}

.input-hb-yellow {
  @apply border-yellow-600 checked:bg-yellow-600 focus:border-yellow-400 focus:ring-yellow-500 disabled:border-yellow-700 disabled:checked:bg-yellow-700;
}

.input-hb-green {
  @apply border-green-600 checked:bg-green-600 focus:border-green-400 focus:ring-green-500 disabled:border-green-700 disabled:checked:bg-green-700;
}

.input-hb-blue {
  @apply border-blue-600 checked:bg-blue-600 focus:border-blue-400 focus:ring-blue-500 disabled:border-blue-700 disabled:checked:bg-blue-700;
}

.input-hb-indigo {
  @apply border-indigo-600 checked:bg-indigo-600 focus:border-indigo-400 focus:ring-indigo-500 disabled:border-indigo-700 disabled:checked:bg-indigo-700;
}

.input-hb-purple {
  @apply border-purple-600 checked:bg-purple-600 focus:border-purple-400 focus:ring-purple-500 disabled:border-purple-700 disabled:checked:bg-purple-700;
}

.input-hb-pink {
  @apply border-pink-600 checked:bg-pink-600 focus:border-pink-400 focus:ring-pink-500 disabled:border-pink-700 disabled:checked:bg-pink-700;
}

.input-hb-orange {
  @apply border-orange-600 checked:bg-orange-600 focus:border-orange-400 focus:ring-orange-500 disabled:border-orange-700 disabled:checked:bg-orange-700;
}

.input-hb-cyan {
  @apply border-cyan-600 checked:bg-cyan-600 focus:border-cyan-400 focus:ring-cyan-500 disabled:border-cyan-700 disabled:checked:bg-cyan-700;
}

.input-hb-emerald {
  @apply border-emerald-600 checked:bg-emerald-600 focus:border-emerald-400 focus:ring-emerald-500 disabled:border-emerald-700 disabled:checked:bg-emerald-700;
}
</style>
