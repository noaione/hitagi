<template>
  <div
    class="flex flex-col flex-wrap rounded-md bg-hitagi-300 bg-opacity-40 px-2 py-2 align-middle dark:bg-hitagi-950 dark:bg-opacity-60"
  >
    <div
      class="flex"
      :class="{
        'flex-row items-center': !compact,
        'flex-col md:flex-row': compact
      }"
    >
      <div class="flex flex-row items-start md:items-center">
        <LinkablePill color="blue" outlined>NEW</LinkablePill>
        <NuxtLink
          :to="`/archive/${data.arcid}`"
          class="ml-2 text-hitagi-800 decoration-hitagi-800 transition-opacity hover:underline hover:opacity-80 dark:text-hitagi-200 dark:decoration-hitagi-200"
        >
          {{ data.title }}
        </NuxtLink>
      </div>
      <div class="mt-2 flex flex-col gap-2 md:ml-2 md:mt-0 md:flex-row" v-if="compact">
        <LinkablePill
          :key="idx"
          :color="LRRTagColor['artist']"
          :href="`/search?q=${encodeURIComponent(`artist:${artist}$`)}`"
          v-for="(artist, idx) in artistsTags"
          class="px-1.5 lowercase"
          outlined
        >
          {{ `artist:${artist}` }}
        </LinkablePill>
        <LinkablePill
          :key="idx"
          :color="LRRTagColor['group']"
          :href="`/search?q=${encodeURIComponent(`group:${group}$`)}`"
          v-for="(group, idx) in groupsTags"
          class="px-1.5 lowercase"
          outlined
        >
          {{ `group:${group}` }}
        </LinkablePill>
        <span v-if="dateAdded" class="my-1 hidden text-sm text-hitagi-700 dark:text-hitagi-300 md:inline-block">|</span>
        <ArchiveUnix
          :unix="dateAdded"
          text="Added on"
          v-if="dateAdded"
          class="my-1 text-sm text-hitagi-700 dark:text-hitagi-300"
          inner-class="font-semibold"
        />
      </div>
    </div>
    <ArchiveTags
      :tags="$props.data.tags.split(',')"
      class="mb-2 mt-3"
      :unrender="['date_added', 'source']"
      v-if="!compact"
    />
    <ArchiveUnix
      :unix="dateAdded"
      text="Added on"
      v-if="dateAdded && !compact"
      class="my-1 text-sm text-hitagi-700 dark:text-hitagi-300"
      inner-class="font-semibold"
    />
  </div>
</template>

<script setup lang="ts">
const { data } = defineProps<{
  data: LRRArchiveMetadata;
  compact?: boolean;
}>();

const splitTags = computed(() => mapTagsToKeyValues(data.tags));

const artistsTags = computed(() => splitTags.value.artist ?? []);
const groupsTags = computed(() => splitTags.value.group ?? []);
const dateAdded = computed(() => {
  const date = splitTags.value?.date_added?.[0];
  if (date === undefined) return undefined;
  return Number.parseInt(date);
});
</script>
