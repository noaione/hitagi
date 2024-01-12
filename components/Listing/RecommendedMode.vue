<template>
  <div class="relative inline-block">
    <button
      ref="reference"
      class="h-8 w-8 text-themed-700 shadow-themed-400 transition glow-text-lg hover:opacity-80 dark:text-themed-300"
      @click="buttonActive = !buttonActive"
    >
      <Icon v-if="config.recommended === 'random'" class="h-8 w-8" name="mdi:dice-6-outline" />
      <Icon v-else-if="config.recommended === 'latest'" class="h-8 w-8" name="mdi:clock-outline" />
      <Icon v-else-if="config.recommended === 'new'" class="h-8 w-8" name="mdi:plus-circle-outline" />
      <Icon v-else-if="config.recommended === 'untagged'" class="h-8 w-8" name="mdi:tag-off-outline" />
    </button>
    <Transition name="recommend-popup">
      <div
        v-if="buttonActive"
        ref="floating"
        class="z-50 origin-top-right"
        data-id="recommended-mode"
        :style="floatingStyles"
      >
        <div v-show="buttonActive" class="mt-2 flex flex-col items-end rounded-md bg-themed-300 dark:bg-themed-700">
          <button
            v-for="[key, text] of Object.entries(RecommendTextInfo)"
            :key="key"
            class="recommend-mode-value w-full overflow-hidden whitespace-nowrap text-right hover:opacity-80"
            @click="assignConfig(key)"
          >
            {{ text }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { flip, inline } from "@floating-ui/vue";

type RecommendedConfig = "random" | "new" | "untagged" | "latest";

const buttonActive = ref(false);
const reference = ref<HTMLButtonElement>();
const floating = ref<HTMLDivElement>();

const config = useLRRConfig();
const recommended = useLRRRecommended();

const { floatingStyles } = useFloating(reference, floating, {
  placement: "bottom-end",
  strategy: "absolute",
  middleware: [inline(), flip()],
});

onClickOutside(floating, (ev) => {
  // check if click is inside the reference element
  // if so, do nothing
  if (reference.value?.contains(ev.target as Node)) return;

  buttonActive.value = false;
});

const RecommendTextInfo: Record<RecommendedConfig, string> = {
  random: "Random",
  latest: "Latest",
  new: "Newly Added",
  untagged: "Untagged",
};

function assignConfig(key: RecommendedConfig | string) {
  if (Object.keys(RecommendTextInfo).includes(key)) {
    config.recommended = key as RecommendedConfig;
    buttonActive.value = false;

    nextTick(() => {
      recommended.reload();
    });
  }
}
</script>

<style scoped lang="postcss">
.recommend-mode-value {
  @apply bg-inherit px-2 py-1.5 transition hover:bg-themed-400 dark:hover:bg-themed-600;
}

.recommend-popup-enter-active,
.recommend-popup-leave-active {
  transition: opacity 0.3s ease;
}

.recommend-popup-enter-from,
.recommend-popup-leave-to {
  opacity: 0;
}
</style>
