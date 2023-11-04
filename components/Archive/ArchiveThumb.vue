<template>
  <div :class="`aspect-thumb block justify-center ${$props.class ?? ''}`">
    <img
      :src="thumbnail"
      alt="Thumbnail"
      :class="`h-full rounded-md ${
        settings.thumbFit === 'contain' ? 'object-contain object-center' : 'object-cover object-right'
      } ${$props.innerClass ?? ''}`"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  arcId: string;
  class?: string;
  innerClass?: string;
}>();

const settings = useLRRConfig();
const serverMeta = useServerMeta();

const thumbnail = computed(() => {
  return `${serverMeta.hostURL.origin}/api/archives/${props.arcId}/thumbnail`;
});
</script>
