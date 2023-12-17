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

const inputFormClass = computed(() => {
  return clsx(
    props.type === "checkbox" ? "form-checkbox" : "form-input",
    "rounded-md bg-white transition disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-gray-800 disabled:dark:bg-gray-900",
    "border-themed-600 checked:!bg-themed-600 focus:border-themed-400 focus:ring-themed-500 disabled:border-themed-700 disabled:checked:bg-themed-700",
    slots.label ? "mt-1" : "mt-0",
    props.class
  );
});
</script>
