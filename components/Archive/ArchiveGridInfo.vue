<template>
  <NuxtLink :to="`/archive/${data.arcid}`" custom v-slot="{ href }">
    <div
      class="flex max-w-[9rem] cursor-pointer flex-col rounded-md bg-hitagi-300 bg-opacity-40 align-middle dark:bg-hitagi-950 dark:bg-opacity-60 md:max-w-[11rem]"
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
        class="decoration-hitagi-800 transition hover:underline hover:opacity-80 dark:decoration-hitagi-200"
      >
        <h2
          class="select-none whitespace-pre-wrap px-2 py-1 text-center text-sm font-semibold text-hitagi-800 dark:text-hitagi-200"
        >
          <span class="text-blue-500" v-if="boolStrToBool(data.isnew)">•</span>
          {{ data.title }}
        </h2>
      </a>
    </div>
  </NuxtLink>
  <Teleport to="body">
    <Transition name="tooltip-archive">
      <div
        ref="floatEl"
        v-if="activeFloat"
        class="z-50 rounded-md bg-hitagi-300 !bg-opacity-50 backdrop-blur-lg dark:bg-hitagi-950"
        :style="floatingStyles"
        :data-id="data.arcid"
      >
        <div class="flex flex-col gap-2 px-2 py-1 pt-2 shadow-md">
          <LinkablePill
            :key="idx"
            :color="LRRTagColor['artist']"
            v-for="(artist, idx) in artistsTags"
            class="px-1.5 lowercase"
            outlined
          >
            {{ `artist:${artist}` }}
          </LinkablePill>
          <LinkablePill
            :key="idx"
            :color="LRRTagColor['group']"
            v-for="(group, idx) in groupsTags"
            class="px-1.5 lowercase"
            outlined
          >
            {{ `group:${group}` }}
          </LinkablePill>
          <LinkablePill
            :key="idx"
            :color="LRRTagColor['magazine']"
            v-for="(magazine, idx) in magazineTags"
            class="px-1.5 lowercase"
            outlined
          >
            {{ `magazine:${magazine}` }}
          </LinkablePill>
          <ArchiveUnix
            :unix="dateAdded"
            text="Added on"
            class="text-sm text-hitagi-700 dark:text-hitagi-300"
            inner-class="font-semibold"
            v-if="dateAdded"
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
  if (date === undefined) return undefined;
  return Number.parseInt(date);
});

const { floatingStyles } = useFloating(floatRef, floatEl, {
  middleware: [
    autoPlacement({
      alignment: "end",
      padding: 5
    })
  ]
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
        bottom: clientY
      };
    }
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
        bottom: clientY
      };
    }
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