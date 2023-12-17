<template>
  <div :class="`group flex flex-col ${containerClass ?? ''}`" :disabled="disabled" @click="setClickdiv">
    <input :id="inputId" v-model="inputModel" type="radio" :value="value" class="peer hidden" :disabled="disabled" />
    <label :class="inputFormClass" :for="inputId">
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
import clsx from "clsx";

const props = defineProps<{
  value: any;
  inputId?: string;
  class?: string;
  modelValue: any;
  containerClass?: string;
  color?: string;
  filled?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const inputModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function setClickdiv() {
  if (props.disabled) {
    return;
  }

  inputModel.value = props.value;
}

const validColors = [
  "hitagi",
  "hachikuji",
  "shinobu",
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
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

const inputFormClass = computed(() => {
  return clsx(
    "radio-hb inline-flex w-full cursor-pointer items-center justify-between rounded-md transition disabled:cursor-not-allowed peer-disabled:cursor-not-allowed",
    props.filled ? `radio-hf radio-hf-${selectedColor.value}` : `radio-hb-${selectedColor.value}`,
    props.class
  );
});
</script>

<style scoped lang="postcss">
.radio-hb {
  @apply border bg-white disabled:bg-gray-100 group-hover:opacity-75 group-hover:disabled:opacity-100 group-hover:peer-checked:opacity-100 peer-disabled:bg-opacity-80 dark:bg-gray-800;
}

.radio-hb-themed {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:!border-themed-600 peer-checked:peer-disabled:!border-themed-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-hitagi {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:!border-hitagi-600 peer-checked:peer-disabled:!border-hitagi-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-hachikuji {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:!border-hachikuji-600 peer-checked:peer-disabled:!border-hachikuji-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-shinobu {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:!border-shinobu-600 peer-checked:peer-disabled:!border-shinobu-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-gray {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-gray-600 peer-checked:peer-disabled:!border-gray-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-red {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-red-600 peer-checked:peer-disabled:!border-red-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-yellow {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-yellow-600 peer-checked:peer-disabled:!border-yellow-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-green {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-green-600 peer-checked:peer-disabled:!border-green-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-blue {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-blue-600 peer-checked:peer-disabled:!border-blue-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-indigo {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-indigo-600 peer-checked:peer-disabled:!border-indigo-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-purple {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-purple-600 peer-checked:peer-disabled:!border-purple-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-pink {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-pink-600 peer-checked:peer-disabled:!border-pink-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-orange {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-orange-600 peer-checked:peer-disabled:!border-orange-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-cyan {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-cyan-600 peer-checked:peer-disabled:!border-cyan-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

.radio-hb-emerald {
  @apply border-gray-100 disabled:border-gray-200 peer-checked:border-emerald-600 peer-checked:peer-disabled:!border-emerald-700 dark:border-gray-700 peer-disabled:dark:border-gray-800;
}

/* filled mode */
.radio-hf {
  @apply border-0 bg-white text-black peer-checked:text-white dark:text-white;
}

.radio-hf-themed {
  @apply peer-checked:bg-themed-600 peer-checked:peer-disabled:!bg-themed-700;
}

.radio-hf-hitagi {
  @apply peer-checked:bg-hitagi-600 peer-checked:peer-disabled:!bg-hitagi-700;
}

.radio-hf-hachikuji {
  @apply peer-checked:bg-hachikuji-600 peer-checked:peer-disabled:!bg-hachikuji-700;
}

.radio-hf-shinobu {
  @apply peer-checked:bg-shinobu-600 peer-checked:peer-disabled:!bg-shinobu-700;
}

.radio-hf-gray {
  @apply peer-checked:bg-gray-600 peer-checked:peer-disabled:!bg-gray-700;
}

.radio-hf-red {
  @apply peer-checked:bg-red-600 peer-checked:peer-disabled:!bg-red-700;
}

.radio-hf-yellow {
  @apply peer-checked:bg-yellow-600 peer-checked:peer-disabled:!bg-yellow-700;
}

.radio-hf-green {
  @apply peer-checked:bg-green-600 peer-checked:peer-disabled:!bg-green-700;
}

.radio-hf-blue {
  @apply peer-checked:bg-blue-600 peer-checked:peer-disabled:!bg-blue-700;
}

.radio-hf-indigo {
  @apply peer-checked:bg-indigo-600 peer-checked:peer-disabled:!bg-indigo-700;
}

.radio-hf-purple {
  @apply peer-checked:bg-purple-600 peer-checked:peer-disabled:!bg-purple-700;
}

.radio-hf-pink {
  @apply peer-checked:bg-pink-600 peer-checked:peer-disabled:!bg-pink-700;
}

.radio-hf-orange {
  @apply peer-checked:bg-orange-600 peer-checked:peer-disabled:!bg-orange-700;
}

.radio-hf-cyan {
  @apply peer-checked:bg-cyan-600 peer-checked:peer-disabled:!bg-cyan-700;
}

.radio-hf-emerald {
  @apply peer-checked:bg-emerald-600 peer-checked:peer-disabled:!bg-emerald-700;
}
</style>
