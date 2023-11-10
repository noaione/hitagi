<template>
  <SettingsContainer title="General">
    <HitagiRadioContainer class="w-full flex-wrap gap-2">
      <template #label>
        <span class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">Theme</span>
      </template>
      <HitagiRadioBlock
        v-for="kvKey in HitagiTheme"
        :key="kvKey"
        v-model="settingsTheme"
        class="rounded"
        :value="kvKey"
        filled
      >
        <div class="block px-2 py-2">
          {{ capitalize(kvKey) }}
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiRadioContainer class="w-full flex-wrap gap-2">
      <template #label>
        <span class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">List View</span>
      </template>
      <HitagiRadioBlock
        v-for="[kvKey, kvVal] in Object.entries(ListModeViewTextInfo)"
        :key="kvKey"
        v-model="settings.listMode"
        class="rounded"
        :value="kvKey"
        filled
      >
        <div class="block px-2 py-2">
          {{ kvVal }}
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiInput v-model="settings.listCompact" type="checkbox" swap container-class="items-center gap-1">
      <template #label>
        <label for="list-compact" class="text-themed-700 dark:text-themed-300 font-medium">Compact Mode</label>
      </template>
    </HitagiInput>
    <HitagiRadioContainer class="w-full flex-wrap gap-2">
      <template #label>
        <span class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">List Recommended</span>
      </template>
      <HitagiRadioBlock
        v-for="[kvKey, kvVal] in Object.entries(RecommendTextInfo)"
        :key="kvKey"
        v-model="settings.recommended"
        class="rounded"
        :value="kvKey"
        filled
      >
        <div class="block px-2 py-2">
          {{ kvVal }}
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiRadioContainer class="w-full flex-wrap gap-2">
      <template #label>
        <span class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">List Order</span>
      </template>
      <HitagiRadioBlock
        v-for="[kvKey, kvVal] in Object.entries(OrderByTextInfo)"
        :key="kvKey"
        v-model="settings.order"
        class="rounded"
        :value="kvKey"
        filled
      >
        <div class="block px-2 py-2">
          {{ kvVal }}
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiRadioContainer class="w-full flex-wrap gap-2">
      <template #label>
        <span class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">Thumbnail Fit</span>
      </template>
      <HitagiRadioBlock
        v-for="[kvKey, kvVal] in Object.entries(ThumbFitInfo)"
        :key="kvKey"
        v-model="settings.thumbFit"
        class="rounded"
        :value="kvKey"
        filled
      >
        <div class="block px-2 py-2">
          {{ kvVal }}
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiRadioContainer v-if="settings.thumbFit === 'cover'" class="w-full flex-wrap gap-2">
      <template #label>
        <span class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">Thumbnail Cover Show Side</span>
      </template>
      <HitagiRadioBlock
        v-for="kvKey in ThumbSideInfo"
        :key="kvKey"
        v-model="settings.thumbSide"
        class="rounded"
        :value="kvKey"
        filled
      >
        <div class="block px-2 py-2">
          {{ capitalize(kvKey) }}
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
  </SettingsContainer>
</template>

<script setup lang="ts">
const settings = useLRRConfig();

const HitagiTheme = ["hitagi", "hachikuji", "shinobu"];

const settingsTheme = computed({
  get: () => settings.theme,
  set: (newTheme) => {
    settings.changeTheme(newTheme);
  },
});

const ListModeViewTextInfo = {
  list: "List",
  grid: "Grid",
};

const RecommendTextInfo = {
  random: "Random",
  new: "Newly Added",
  untagged: "Untagged",
};

const OrderByTextInfo = {
  asc: "Ascending",
  desc: "Descending",
};

const ThumbFitInfo = {
  cover: "Cover",
  contain: "Contain",
};

const ThumbSideInfo = ["left", "center", "right"];

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>
