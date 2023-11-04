<template>
  <div :class="`flex flex-col gap-2 ${$props.class ?? ''}`">
    <div class="flex flex-row" :key="key" v-for="[key, tags] in Object.entries(tagsKV)">
      <div class="inline-block">
        <LinkablePill :color="LRRTagColor[key]" class="lowercase">
          {{ key.replaceAll("_", " ") }}
        </LinkablePill>
      </div>
      <div class="ml-3 flex flex-row flex-wrap gap-2">
        <div class="inline-block" :key="`${key}-${tag.toLowerCase()}`" v-for="tag in tags">
          <LinkablePill
            :color="LRRTagColor[key]"
            :href="`/search?q=${encodeURIComponent(key === 'other' ? tag : key + ':' + tag)}$`"
            :class="key === 'source' ? `whitespace-pre-wrap break-all` : '' + ' lowercase'"
            outlined
          >
            {{ tag }}
          </LinkablePill>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { tags, unrender } = defineProps<{
  tags: string[];
  class?: string;
  // Unrendere some tags, like "other" or "source"
  unrender?: string[];
}>();

const tagsKV = computed(() => {
  const sortedTags = mapTagsToKeyValues(tags);
  // put priority tags like this:
  // - artist
  // - group
  // - magazine
  // [...]
  // - source
  const ignoreKeys = ["artist", "group", "magazine", "series", "source"];
  if (Array.isArray(unrender)) {
    ignoreKeys.push(...unrender);
  }
  const resortedTags: Record<string, string[]> = {};
  if (sortedTags.artist) {
    resortedTags.artist = sortedTags.artist;
  }
  if (sortedTags.group) {
    resortedTags.group = sortedTags.group;
  }
  if (sortedTags.magazine) {
    resortedTags.magazine = sortedTags.magazine;
  }
  if (sortedTags.series) {
    resortedTags.series = sortedTags.series;
  }
  for (const [key, value] of Object.entries(sortedTags)) {
    if (ignoreKeys.includes(key)) continue;
    resortedTags[key] = value;
  }
  if (sortedTags.source) {
    resortedTags.source = sortedTags.source;
  }
  return resortedTags;
});
</script>
