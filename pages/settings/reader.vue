<template>
  <SettingsContainer title="Reader">
    <HitagiRadioContainer class="w-full flex-wrap gap-2">
      <template #label>
        <span class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">Reading Direction</span>
      </template>
      <HitagiRadioBlock
        v-for="[flowKey, flowVal] in Object.entries(FlowTextInfo)"
        :key="flowKey"
        v-model="settings.flow"
        class="rounded"
        :value="flowKey"
        filled
      >
        <div class="block px-2 py-2">
          {{ flowVal }}
        </div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiRadioContainer class="w-full flex-wrap gap-2">
      <template #label>
        <span class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">Paging Mode</span>
      </template>
      <HitagiRadioBlock v-model="settings.pagingMode" class="rounded" value="single" filled>
        <div class="block px-2 py-2">Single</div>
      </HitagiRadioBlock>
      <HitagiRadioBlock v-model="settings.pagingMode" class="rounded" value="double" filled>
        <div class="block px-2 py-2">Double</div>
      </HitagiRadioBlock>
      <HitagiRadioBlock v-model="settings.pagingMode" class="rounded" value="double-cover" filled>
        <div class="block px-2 py-2">Double (cover)</div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiRadioContainer class="w-full flex-wrap gap-2">
      <template #label>
        <span class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">Background Color</span>
      </template>
      <HitagiRadioBlock v-model="settings.background" class="rounded" value="gray" filled>
        <div class="block px-2 py-2">Gray-ish</div>
      </HitagiRadioBlock>
      <HitagiRadioBlock v-model="settings.background" class="rounded" value="black" filled>
        <div class="block px-2 py-2">Black</div>
      </HitagiRadioBlock>
      <HitagiRadioBlock v-model="settings.background" class="rounded" value="white" filled>
        <div class="block px-2 py-2">White</div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiRadioContainer class="w-full flex-wrap gap-2">
      <template #label>
        <span class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">Fit mode</span>
      </template>
      <HitagiRadioBlock v-model="settings.fitMode" class="rounded" value="screen-height" filled>
        <div class="block px-2 py-2">Screen Height</div>
      </HitagiRadioBlock>
      <HitagiRadioBlock v-model="settings.fitMode" class="rounded" value="screen-width" filled>
        <div class="block px-2 py-2">Screen Width</div>
      </HitagiRadioBlock>
    </HitagiRadioContainer>
    <HitagiSelect v-model="settings.preloadPage" class="w-full flex-wrap gap-2" input-id="hitagi-reader-preload">
      <template #label>
        <label for="hitagi-reader-preload" class="dark:text-themed-300 text-themed-700 mb-2 font-semibold">
          Image Preload
        </label>
      </template>

      <option :value="0">Disable</option>
      <option :value="1">1 page</option>
      <option :value="2">2 pages</option>
      <option :value="3">3 pages</option>
      <option :value="4">4 pages</option>
      <option :value="5">5 pages</option>
    </HitagiSelect>
  </SettingsContainer>
</template>

<script setup lang="ts">
const settings = useLRRReaderConfig();

// Text data
const FlowTextInfo = {
  ltr: "Left-to-Right",
  rtl: "Right-to-Left",
  // vertical: "Vertical",
};
</script>
