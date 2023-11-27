<template>
  <NuxtLink v-slot="{ href }" :to="`/archive/${data.arcid}`" custom>
    <div
      :class="`relative flex max-w-[9rem] cursor-pointer flex-col rounded-md bg-themed-300 bg-opacity-40 align-middle dark:bg-themed-950 dark:bg-opacity-60 md:max-w-[11rem] ${
        $props.class ?? ''
      }`"
    >
      <ArchiveThumb
        ref="floatRef"
        :arc-id="data.arcid"
        class="mx-0 h-48 w-[9rem] md:h-64 md:w-44"
        inner-class="rounded-b-none"
        @pointermove="setFloatingPosition"
        @pointerenter="setFloatActive"
        @pointerleave="setFloatInactive"
        @touchmove="setFloatingPositionTouch"
        @touchstart="setFloatActiveTouch"
        @touchend="setFloatInactive"
      />
      <a
        :href="href"
        class="group w-full bg-themed-950 !bg-opacity-50 backdrop-blur"
        :class="{
          'absolute bottom-0 max-h-[1.8rem] hover:max-h-full': compact,
          'max-h-full': compact && activeFloat,
        }"
      >
        <h2
          class="select-none whitespace-pre-wrap px-2 py-1 text-center text-sm font-semibold text-themed-100 decoration-themed-200 transition group-hover:underline group-hover:opacity-80"
          :class="{
            'max-h-[1.8rem] max-w-full overflow-hidden text-ellipsis whitespace-nowrap': compact,
            'max-h-full': compact && activeFloat,
          }"
        >
          <span v-if="boolStrToBool(data.isnew)" class="text-blue-500">•</span>
          {{ data.title }}
        </h2>
      </a>
    </div>
  </NuxtLink>
  <Teleport to="body">
    <Transition name="tooltip-archive">
      <div
        v-if="activeFloat"
        ref="floatEl"
        class="z-50 rounded-md bg-themed-300 !bg-opacity-50 backdrop-blur-lg dark:bg-themed-950"
        :style="floatingStyles"
        :data-id="data.arcid"
      >
        <div class="flex flex-col gap-2 px-2 py-1 pt-2 shadow-md">
          <LinkablePill
            v-for="(artist, idx) in artistsTags"
            :key="idx"
            :color="LRRTagColor['artist']"
            class="px-1.5 lowercase"
            outlined
          >
            {{ `artist:${artist}` }}
          </LinkablePill>
          <LinkablePill
            v-for="(group, idx) in groupsTags"
            :key="idx"
            :color="LRRTagColor['group']"
            class="px-1.5 lowercase"
            outlined
          >
            {{ `group:${group}` }}
          </LinkablePill>
          <LinkablePill
            v-for="(magazine, idx) in magazineTags"
            :key="idx"
            :color="LRRTagColor['magazine']"
            class="px-1.5 lowercase"
            outlined
          >
            {{ `magazine:${magazine}` }}
          </LinkablePill>
          <ArchiveUnix
            v-if="dateAdded"
            :unix="dateAdded"
            text="Added on"
            class="text-sm text-themed-700 dark:text-themed-300"
            inner-class="font-semibold"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { autoPlacement } from "@floating-ui/dom";

const { data } = defineProps<{
  data: LRRArchiveMetadata;
  class?: string;
  compact?: boolean;
}>();

const floatRef = ref();
const floatEl = ref<HTMLDivElement>();

const activeFloat = ref(false);

const splitTags = computed(() => mapTagsToKeyValues(data.tags));

const artistsTags = computed(() => splitTags.value.artist ?? []);
const groupsTags = computed(() => splitTags.value.group ?? []);
const magazineTags = computed(() => splitTags.value.magazine ?? []);
const dateAdded = computed(() => {
  const date = splitTags.value?.date_added?.[0];

  if (date === undefined) return;

  return Number.parseInt(date);
});

const { floatingStyles } = useFloating(floatRef, floatEl, {
  middleware: [
    autoPlacement({
      alignment: "end",
      padding: 5,
    }),
  ],
});

function setFloatActive() {
  activeFloat.value = true;
}

function setFloatInactive() {
  activeFloat.value = false;
}

function setFloatingPosition({ clientX, clientY }: PointerEvent) {
  floatRef.value = {
    getBoundingClientRect() {
      return {
        width: 0,
        height: 0,
        x: clientX,
        y: clientY,
        left: clientX,
        top: clientY,
        right: clientX,
        bottom: clientY,
      };
    },
  };
}

function setFloatingPositionTouch({ targetTouches }: TouchEvent) {
  // get latest
  const { clientX, clientY } = targetTouches[targetTouches.length - 1];

  floatRef.value = {
    getBoundingClientRect() {
      return {
        width: 0,
        height: 0,
        x: clientX,
        y: clientY,
        left: clientX,
        top: clientY,
        right: clientX,
        bottom: clientY,
      };
    },
  };
}

function setFloatActiveTouch(ev: TouchEvent) {
  setFloatActive();
  setFloatingPositionTouch(ev);
}
</script>

<style scoped lang="postcss">
.tooltip-archive-enter-active,
.tooltip-archive-leave-active {
  transition: opacity 0.3s ease;
}

.tooltip-archive-enter-from,
.tooltip-archive-leave-to {
  opacity: 0;
}
</style>
