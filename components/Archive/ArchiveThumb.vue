<template>
  <div :class="`aspect-thumb block justify-center ${$props.class ?? ''}`">
    <NuxtLink v-if="!isNone(props.href)" :to="props.href">
      <img
        :src="thumbnail"
        alt="Thumbnail"
        loading="lazy"
        :class="`h-full rounded-md ${
          settings.thumbFit === 'contain' ? 'object-contain object-center' : 'object-cover object-right'
        } ${$props.innerClass ?? ''}`"
      />
    </NuxtLink>
    <img
      v-else
      :src="thumbnail"
      alt="Thumbnail"
      loading="lazy"
      :class="`h-full rounded-md ${
        settings.thumbFit === 'contain' ? 'object-contain object-center' : 'object-cover object-right'
      } ${$props.innerClass ?? ''}`"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  arcId: string;
  page?: number;
  class?: string;
  href?: string;
  innerClass?: string;
}>();

const settings = useLRRConfig();
const serverMeta = useServerMeta();

const thumbnail = computed(() => {
  let thumb = `${serverMeta.hostURL.origin}/api/archives/${props.arcId}/thumbnail`;
  if (!isNone(props.page)) {
    thumb += `?page=${props.page}`;
  }
  return thumb;
});
</script>
