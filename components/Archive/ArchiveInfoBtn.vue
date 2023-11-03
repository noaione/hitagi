<template>
  <div :class="`flex flex-row items-center gap-2 ${$props.class ?? ''}`">
    <NuxtLink
      :href="`/archive/${arcId}/read`"
      class="rounded-md bg-hitagi-600 px-2 py-1 text-sm text-white transition-opacity hover:opacity-80"
    >
      Read
    </NuxtLink>
    <NuxtLink
      :href="archiveDown"
      class="rounded-md bg-gray-600 px-2 py-1 text-sm text-white transition-opacity hover:opacity-80"
    >
      Download
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
</script>
