<template>
  <div class="font-incosolata flex h-screen flex-col items-center justify-center" ref="loginForm">
    <CrabIcon class="text-hitagi-600" />
    <h1 class="mt-2 font-bold text-hitagi-700 dark:text-hitagi-400">Hitagi</h1>
    <hr class="server-width my-4 border-hitagi-500" />
    <div class="server-width flex flex-col">
      <label for="server" class="font-medium text-hitagi-700 dark:text-hitagi-300">Server</label>
      <input
        id="server"
        type="text"
        class="form-input mt-1 rounded-md border-hitagi-600 transition focus:border-hitagi-400 focus:ring-hitagi-500 disabled:cursor-not-allowed disabled:border-hitagi-700 disabled:bg-gray-900 dark:bg-gray-800"
        v-model="serverForm"
        :disabled="submitting"
      />
    </div>
    <div class="server-width flex flex-col" v-if="needApiToken">
      <label for="api-token" class="font-medium text-hitagi-700 dark:text-hitagi-300">API Token</label>
      <input
        id="api-token"
        type="text"
        class="form-input mt-1 rounded-md border-hitagi-600 transition focus:border-hitagi-400 focus:ring-hitagi-500 disabled:cursor-not-allowed disabled:border-hitagi-700 disabled:bg-gray-900 dark:bg-gray-800"
        v-model="apiToken"
        :minlength="1"
        :required="true"
        :disabled="submitting"
      />
    </div>
    <div class="server-width flex flex-row flex-wrap" v-if="typeof errorValidation === 'string'">
      <span class="mt-2 text-red-700 dark:text-red-300">{{ errorValidation }}</span>
    </div>
    <div class="server-width flex flex-row flex-wrap" v-if="typeof errorHTTP === 'string'">
      <span class="mt-2 text-red-700 dark:text-red-300">{{ errorHTTP }}</span>
    </div>
    <div class="server-width mt-4 flex flex-row">
      <button
        :disabled="submitting || typeof errorValidation === 'string'"
        :data-error="submitting ? 'network' : 'validate'"
        @click="submit"
        class="btn-server-submit group w-full rounded-lg border-2 bg-transparent px-2 py-3 transition disabled:cursor-not-allowed"
      >
        <span class="text-hitagi-700 transition group-hover:text-white group-disabled:text-white dark:text-hitagi-300">
          Connect
        </span>
      </button>
    </div>
    <DarkToggle class="mt-4 h-10 w-10 text-hitagi-600 dark:text-hitagi-400" />
  </div>
</template>

<script setup lang="ts">
import autoAnimate from "@formkit/auto-animate";

const route = useRoute();
const router = useRouter();
const serverMeta = useServerMeta();

const loginForm = ref();
const serverForm = ref<string>();
const apiToken = ref<string>();
const errorValidation = ref<string>();
const errorHTTP = ref<string>();
const submitting = ref(false);
const needApiToken = ref(false);

async function submit() {
  if (serverForm.value === undefined) {
    errorValidation.value = "Server URL is required";
    return;
  }
  if (typeof errorValidation.value === "string") {
    return;
  }
  errorHTTP.value = undefined;
  submitting.value = true;

  const headers = new Headers();
  if (typeof apiToken.value === "string" && apiToken.value.trim().length > 0) {
    headers.append("Authorization", `Bearer ${b64encode(apiToken.value.trim())}`);
  }

  try {
    const url = new URL(serverForm.value);
    const response = await $fetch<LRRMiscInfo>(url.origin + "/api/info", {
      method: "GET"
    });
    if (numStrToInt(response.nofun_mode) === 1) {
      needApiToken.value = true;
      return;
    }

    // set server
    serverMeta.setApiHost(url.origin);
    if (typeof apiToken.value === "string" && apiToken.value.trim().length > 0) {
      serverMeta.setApiKey(apiToken.value.trim());
    }

    console.info("Assigning server info...");
    serverMeta.setInfoFromAPI(response);

    // redirect
    const redirect = route.query.redirect;
    if (typeof redirect === "string") {
      console.info("Redirecting to", redirect);
      router.push(redirect);
    } else {
      console.info("Redirecting to homepage...");
      router.push("/");
    }
  } catch (e) {
    if (e instanceof Error) {
      errorHTTP.value = `Failed to fetch: ${e.message}`;
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
  needApiToken.value = false;
  errorValidation.value = undefined;
  errorHTTP.value = undefined;
  submitting.value = false;
  apiToken.value = undefined;
  serverMeta.defaults();
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

.btn-server-submit {
  @apply border-hitagi-500 hover:border-hitagi-700 hover:bg-hitagi-700 disabled:border-hitagi-700;
}

.btn-server-submit[data-error="network"] {
  @apply disabled:animate-pulse disabled:bg-hitagi-700;
}

.btn-server-submit[data-error="validate"] {
  @apply disabled:bg-hitagi-700;
}
</style>
