<template>
  <div :class="`flex flex-row items-center gap-2 ${$props.class ?? ''}`">
    <NuxtLink
      :href="`/archive/${arcId}/read`"
      class="flex flex-row items-center gap-0.5 rounded-md bg-themed-600 px-2 py-1 text-sm font-semibold text-white transition-opacity hover:opacity-80"
    >
      <Icon class="mr-0.5 mt-0.5 h-4 w-4" name="mdi:book-open-page-variant-outline" />
      <span>Read</span>
    </NuxtLink>
    <NuxtLink
      v-if="settings.apiKey64"
      :href="`/archive/${arcId}/edit`"
      class="flex flex-row items-center gap-0.5 rounded-md bg-cyan-600 px-2 py-1 text-sm font-semibold text-white transition-opacity hover:opacity-80"
    >
      <Icon class="mr-0.5 mt-0.5 h-4 w-4" name="mdi:book-edit-outline" />
      <span>Edit</span>
    </NuxtLink>
    <NuxtLink
      :href="archiveDown"
      class="flex flex-row items-center gap-0.5 rounded-md bg-gray-600 px-2 py-1 text-sm font-semibold text-white transition-opacity hover:opacity-80"
      @click="dispatchPlausible"
    >
      <Icon class="mt-0.5 h-4 w-4" name="mdi:file-download-outline" />
      <span>Download</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { arcId } = defineProps<{
  arcId: string;
  class?: string;
}>();

const settings = useServerMeta();

const archiveDown = computed(() => {
  return settings.hostURL.origin + "/api/archives/" + arcId + "/download";
});

function dispatchPlausible() {
  useTrackEvent("Archive Download", {
    props: {
      method: "HTTP",
      archiveId: arcId,
    },
  });
}
</script>
