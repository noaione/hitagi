<template>
  <button :class="'h-8 w-8 ' + ($props.class ?? '') + ' group '" @click="toggle">
    <IconCrab
      v-if="theme === 'hitagi'"
      class="h-[95%] w-[95%] text-hachikuji-700 transition-opacity group-hover:opacity-80 dark:text-hachikuji-300"
    />
    <IconSnail
      v-else-if="theme === 'hachikuji'"
      class="h-[95%] w-[95%] text-shinobu-700 transition-opacity group-hover:opacity-80 dark:text-shinobu-300"
    />
    <IconBat
      v-else-if="theme === 'shinobu'"
      class="h-[95%] w-[95%] text-hitagi-700 transition-opacity group-hover:opacity-80 dark:text-hitagi-300"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  class?: string;
}>();

const themeCycles: HitagiThemeType[] = ["hitagi", "hachikuji", "shinobu"];
const theme = useLRRTheme();

function toggle() {
  const idx = themeCycles.indexOf(theme.value);
  const nextIdx = (idx + 1) % themeCycles.length;

  theme.value = themeCycles[nextIdx];
}
</script>
