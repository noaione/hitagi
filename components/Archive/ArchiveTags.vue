<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row" :key="key" v-for="[key, tags] in Object.entries(tagsKV)">
      <div class="inline-block">
        <LinkablePill :color="KVColor[key]">
          {{ key.replaceAll("_", " ") }}
        </LinkablePill>
      </div>
      <div class="ml-3 flex flex-row flex-wrap gap-2">
        <div class="inline-block" :key="`${key}-${tag.toLowerCase()}`" v-for="tag in tags">
          <LinkablePill
            :color="KVColor[key]"
            :href="`/search?q=${encodeURIComponent(key === 'other' ? tag : key + ':' + tag)}`"
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
const { tags } = defineProps<{
  tags: string[];
}>();

type KVTags = Record<string, string[]>;

const KVColor: Record<string, string> = {
  artist: "cyan",
  magazine: "orange",
  series: "red",
  group: "emerald",
  female: "pink",
  male: "blue"
};

function sortTags(keyValueTags: KVTags) {
  const sortedTags: Record<string, string[]> = {};

  for (const key of Object.keys(keyValueTags).sort()) {
    sortedTags[key] = keyValueTags[key].sort();
  }

  return sortedTags;
}

const tagsKV = computed(() => {
  const kvTags: Record<string, string[]> = {};

  for (const tag of tags) {
    const [key, ...valueK] = tag.split(":");
    const actKey = valueK.length === 0 ? "other" : key;
    const values = kvTags[actKey] ?? [];
    values.push(valueK.length > 0 ? valueK.join(":") : key);
    kvTags[actKey] = values;
  }

  return sortTags(kvTags);
});
</script>
