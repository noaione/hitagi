<template>
  <div class="h-screen flex flex-col items-center justify-center font-incosolata" ref="loginForm">
    <CrabIcon class="text-hitagi-600" />
    <h1 class="mt-2 text-hitagi-700 dark:text-hitagi-400 font-bold">Hitagi</h1>
    <hr class="server-width my-4 border-hitagi-500" />
    <div class="flex flex-col server-width">
      <label for="server" class="text-hitagi-700 dark:text-hitagi-300 font-medium">Server</label>
      <input
        id="server"
        type="text"
        class="form-input dark:bg-gray-800 border-hitagi-600 focus:border-hitagi-400 focus:ring-hitagi-500 rounded-md mt-1 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:border-hitagi-700 transition"
        v-model="serverForm"
        :disabled="submitting"
      />
    </div>
    <div class="flex flex-row server-width flex-wrap" v-if="typeof errorValidation === 'string'">
      <span class="mt-2 text-red-700 dark:text-red-300">{{ errorValidation }}</span>
    </div>
    <div class="flex flex-row server-width mt-4">
      <button
        :disabled="submitting || typeof errorValidation === 'string'"
        @click="submit"
        class="group bg-transparent w-full border-2 px-2 py-3 border-hitagi-500 hover:bg-hitagi-700 hover:border-hitagi-700 disabled:bg-hitagi-700 disabled:border-hitagi-700 disabled:animate-pulse disabled:cursor-not-allowed rounded-lg transition"
      >
        <span class="text-hitagi-700 dark:text-hitagi-300 group-hover:text-white transition group-disabled:text-white">
          Connect
        </span>
      </button>
    </div>
    <DarkToggle class="w-10 h-10 text-hitagi-600 dark:text-hitagi-400 mt-4" />
  </div>
</template>

<script setup lang="ts">
import autoAnimate from "@formkit/auto-animate";

const loginForm = ref();
const settings = useSettings();
const serverForm = ref();
const errorValidation = ref<string>();
const submitting = ref(false);

async function submit() {
  if (typeof errorValidation.value === "string") {
    return;
  }
  submitting.value = true;

  try {
    const url = new URL(serverForm.value);
    const response = await $fetch<LRRMiscInfo>(url.origin + "/api/info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log("RESPONSE:", response);
  } catch (e) {
    if (e instanceof Error) {
      errorValidation.value = `Failed to fetch: ${e.message}`;
    }
  } finally {
    submitting.value = false;
  }
}

watch(
  () => serverForm.value,
  (newValue) => {
    if (!newValue) {
      errorValidation.value = undefined;
      return;
    }
    try {
      const url = new URL(newValue);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errorValidation.value = "Invalid URL: Protocol must be HTTP or HTTPS";
      }
      errorValidation.value = undefined;
    } catch (e) {
      if (e instanceof Error) {
        errorValidation.value = `Invalid URL: ${e.message}`;
      }
    }
  }
);

onMounted(() => {
  autoAnimate(loginForm.value);
  settings.disposeEvery();
});

definePageMeta({
  layout: "clean"
});

useSeoMeta({
  title: "Hitagi",
  ogTitle: "Hitagi",
  description: `A "modern" LANraragi web client`,
  ogDescription: `A "modern" LANraragi web client`,
  ogImage: "/hitagi-hero.png",
  twitterCard: "summary_large_image"
});
</script>

<style scoped lang="postcss">
.server-width {
  @apply w-[90%] md:w-[60%] lg:w-[30%];
}
</style>
