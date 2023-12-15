<template>
  <div :class="`flex flex-row flex-wrap gap-2 rounded-md px-2 py-1 ${containerClass ?? ''}`">
    <div v-for="tag in tags" :key="tag" class="flex flex-row items-center gap-0">
      <LinkablePill
        size="md"
        :class="(tag.startsWith('source:') ? `whitespace-pre-wrap break-all` : '') + ' lowercase'"
        :color="getColorTag(tag)"
        outlined
      >
        {{ tag }}
        <button class="ml-1 transition hover:opacity-70" @click="removeTag(tag)">
          <Icon name="mdi:close" class="mb-1" />
        </button>
      </LinkablePill>
    </div>
    <!-- Input area after every other tag, we do not want to add any border or stuff since this will be inline -->
    <div class="flex w-fit flex-grow flex-row gap-0">
      <input
        v-model="newTag"
        class="w-full border-none bg-transparent px-2 py-1 text-base outline-none"
        @keydown="addTag"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tags: string[];
  containerClass?: string;
}>();

const emit = defineEmits<{
  (e: "update:tags", value: string[]): void;
}>();

const newTag = ref("");
const tags = computed({
  get() {
    return props.tags;
  },
  set(value: string[]) {
    emit("update:tags", value);
  },
});

function addTag(payload: KeyboardEvent) {
  if (payload.key !== "Enter") return;

  payload.preventDefault();

  if (newTag.value.length === 0) return;

  // Check if tag already exists
  if (tags.value.includes(newTag.value)) {
    newTag.value = "";

    return;
  }

  tags.value = [...tags.value, newTag.value];
  newTag.value = "";
}

function removeTag(tagName: string) {
  tags.value = tags.value.filter((tag) => tag !== tagName);
}

function getColorTag(tagName: string) {
  const [key, ...valueK] = tagName.split(":");
  const actKey = valueK.length === 0 ? "other" : key;

  return LRRTagColor[actKey];
}
</script>
