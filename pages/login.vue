<template>
  <div ref="loginForm" class="font-incosolata flex h-screen flex-col items-center justify-center">
    <HitagiIconHeader class="text-themed-600" />
    <h1 class="mt-2 font-bold text-themed-700 dark:text-themed-400">Hitagi</h1>
    <hr class="server-width my-4 border-themed-500" />
    <HitagiInput
      v-model="apiToken"
      input-id="api-token"
      container-class="server-width"
      type="text"
      :minlength="1"
      :required="true"
      :disabled="submitting"
    >
      <template #label>
        <label for="api-token" class="font-medium text-themed-700 dark:text-themed-300">API Token</label>
      </template>
    </HitagiInput>
    <div v-if="errorValidation.length > 0" class="server-width flex flex-col flex-wrap">
      <span v-for="(error, idx) in errorValidation" :key="idx" class="mt-2 text-red-700 dark:text-red-300">
        {{ error }}
      </span>
    </div>
    <div v-if="typeof errorHTTP === 'string'" class="server-width flex flex-row flex-wrap">
      <span class="mt-2 text-red-700 dark:text-red-300">{{ errorHTTP }}</span>
    </div>
    <div class="server-width mt-4 flex flex-row">
      <HitagiButton
        :disabled="submitting || errorValidation.length > 0"
        :data-error="submitting ? 'network' : 'validate'"
        class="btn-server-submit"
        @click="submit"
      >
        Access
      </HitagiButton>
    </div>
    <div class="mt-4 flex flex-row gap-2">
      <DarkToggle class="h-10 w-10 text-themed-600 dark:text-themed-400" />
      <ThemeToggle class="h-10 w-10" />
    </div>
    <div class="server-width mt-4 text-center text-sm">
      <NuxtLink
        :to="baseHost"
        target="_blank"
        rel="noopener noreferrer"
        class="text-themed-600 shadow-themed-500 glow-text-md hover:underline dark:text-themed-300 dark:shadow-themed-200"
      >
        {{ baseHost }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import autoAnimate from "@formkit/auto-animate";

const route = useRoute();
const router = useRouter();
const serverMeta = useServerMeta();
const serverSetting = useLRRSettings();

const baseHost = ref<string>("");

const loginForm = ref();
const apiToken = ref<string>();
const errorValidation = ref<string[]>([]);
const errorHTTP = ref<string>();
const submitting = ref(false);
const needApiToken = ref(false);

function addValidateError(error: string) {
  const isExist = errorValidation.value.includes(error);

  if (isExist) return;

  errorValidation.value.push(error);
}

function removeValidationError(error: string) {
  const idx = errorValidation.value.indexOf(error);

  if (idx === -1) return;

  errorValidation.value.splice(idx, 1);
}

async function submit() {
  if (apiToken.value === undefined) {
    addValidateError("API Token is required");

    return;
  }

  if (errorValidation.value.length > 0) {
    return;
  }

  errorHTTP.value = undefined;
  submitting.value = true;

  const headers = new Headers();

  headers.append("Authorization", `Bearer ${b64encode(apiToken.value.trim())}`);

  try {
    const url = new URL(baseHost.value);
    const response = await $fetch<LRRMiscInfo>(url.origin + "/api/shinobu", {
      method: "GET",
      headers,
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
    await serverMeta.fetchInfoFromAPI(true);

    serverSetting.loggedIn = true;

    // redirect
    const redirect = route.query.redirect;

    if (typeof redirect === "string") {
      console.info("Redirecting to", decodeURIComponent(redirect));
      router.push(decodeURIComponent(redirect));
    } else {
      console.info("Redirecting to homepage...");
      router.push("/");
    }
  } catch (error) {
    if (error instanceof FetchError) {
      errorHTTP.value = [401, 403].includes(error.response?.status ?? -1)
        ? "Invalid API Token"
        : `Failed to fetch: ${error.response?.statusText}`;
    } else if (error instanceof Error) {
      errorHTTP.value = `Failed to fetch: ${error.message}`;
    }

    serverSetting.loggedIn = false;
  } finally {
    submitting.value = false;
  }
}

watch(
  () => apiToken.value,
  (apiToken) => {
    errorHTTP.value = undefined;

    if (apiToken) {
      removeValidationError("API Token is required");
    } else {
      addValidateError("API Token is required");
    }
  }
);

onMounted(() => {
  autoAnimate(loginForm.value);

  apiToken.value = "";
  errorValidation.value = [];
  addValidateError("API Token is required");
  errorHTTP.value = undefined;
  submitting.value = false;
  needApiToken.value = false;

  if (typeof serverMeta.host === "string" && serverMeta.host.trim().length > 0) {
    baseHost.value = serverMeta.host;

    return;
  }

  router.push("/server");
});

definePageMeta({
  layout: "clean",
});

useSeoMeta({
  title: "Hitagi",
  ogTitle: "Hitagi",
  description: `A "modern" LANraragi web client`,
  ogDescription: `A "modern" LANraragi web client`,
  ogImage: "/hitagi-hero.png",
  twitterCard: "summary_large_image",
});
</script>

<style scoped lang="postcss">
.server-width {
  @apply w-[90%] md:w-[60%] lg:w-[30%];
}

.btn-server-submit[data-error="network"] {
  @apply disabled:animate-pulse;
}
</style>
