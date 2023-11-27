<template>
  <div
    class="flex flex-col flex-wrap rounded-md bg-themed-300 bg-opacity-40 px-2 py-2 align-middle dark:bg-themed-950 dark:bg-opacity-60"
  >
    <div
      class="flex"
      :class="{
        'flex-row items-center': !compact,
        'flex-col md:flex-row': compact,
      }"
    >
      <div class="flex flex-row items-start md:items-center">
        <LinkablePill v-if="boolStrToBool(data.isnew)" color="blue" class="mr-2" outlined>NEW</LinkablePill>
        <NuxtLink
          :to="`/archive/${data.arcid}`"
          class="text-themed-800 decoration-themed-800 transition-opacity hover:underline hover:opacity-80 dark:text-themed-200 dark:decoration-themed-200"
        >
          {{ data.title }}
        </NuxtLink>
      </div>
      <div v-if="compact" class="mt-2 flex flex-col gap-2 md:ml-2 md:mt-0 md:flex-row">
        <LinkablePill
          v-for="(artist, idx) in artistsTags"
          :key="idx"
          :color="LRRTagColor['artist']"
          :href="`/search?q=${encodeURIComponent(`artist:${artist}$`)}`"
          class="px-1.5 lowercase"
          outlined
        >
          {{ `artist:${artist}` }}
        </LinkablePill>
        <LinkablePill
          v-for="(group, idx) in groupsTags"
          :key="idx"
          :color="LRRTagColor['group']"
          :href="`/search?q=${encodeURIComponent(`group:${group}$`)}`"
          class="px-1.5 lowercase"
          outlined
        >
          {{ `group:${group}` }}
        </LinkablePill>
        <span v-if="dateAdded" class="my-1 hidden text-sm text-themed-700 dark:text-themed-300 md:inline-block">|</span>
        <ArchiveUnix
          v-if="dateAdded"
          :unix="dateAdded"
          text="Added on"
          class="my-1 text-sm text-themed-700 dark:text-themed-300"
          inner-class="font-semibold"
        />
      </div>
    </div>
    <ArchiveTags
      v-if="!compact"
      :tags="$props.data.tags.split(',')"
      class="mb-2 mt-3"
      :unrender="['date_added', 'source']"
    />
    <ArchiveUnix
      v-if="dateAdded && !compact"
      :unix="dateAdded"
      text="Added on"
      class="my-1 text-sm text-themed-700 dark:text-themed-300"
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

  if (date === undefined) return;

  return Number.parseInt(date);
});
</script>
