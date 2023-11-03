<template>
  <div class="font-incosolata flex h-screen flex-col items-center justify-center" ref="loginForm">
    <CrabIcon class="text-hitagi-600" />
    <h1 class="mt-2 font-bold text-hitagi-700 dark:text-hitagi-400">Hitagi</h1>
    <hr class="server-width my-4 border-hitagi-500" />
    <div class="server-width flex flex-col">
      <label for="api-token" class="font-medium text-hitagi-700 dark:text-hitagi-300">API Token</label>
      <input
        id="api-token"
        type="text"
        class="form-input mt-1 rounded-md border-hitagi-600 transition focus:border-hitagi-400 focus:ring-hitagi-500 disabled:cursor-not-allowed disabled:border-hitagi-700 disabled:bg-gray-100 dark:bg-gray-800 disabled:dark:bg-gray-900"
        v-model="apiToken"
        :minlength="1"
        :required="true"
        :disabled="submitting"
      />
    </div>
    <div class="server-width flex flex-col flex-wrap" v-if="errorValidation.length > 0">
      <span class="mt-2 text-red-700 dark:text-red-300" :key="idx" v-for="(error, idx) in errorValidation">
        {{ error }}
      </span>
    </div>
    <div class="server-width flex flex-row flex-wrap" v-if="typeof errorHTTP === 'string'">
      <span class="mt-2 text-red-700 dark:text-red-300">{{ errorHTTP }}</span>
    </div>
    <div class="server-width mt-4 flex flex-row">
      <button
        :disabled="submitting || errorValidation.length > 0"
        :data-error="submitting ? 'network' : 'validate'"
        @click="submit"
        class="btn-server-submit group w-full rounded-lg border-2 bg-transparent px-2 py-3 transition disabled:cursor-not-allowed"
      >
        <span class="text-hitagi-700 transition group-hover:text-white group-disabled:text-white dark:text-hitagi-300">
          Access
        </span>
      </button>
    </div>
    <DarkToggle class="mt-4 h-10 w-10 text-hitagi-600 dark:text-hitagi-400" />
    <div class="server-width mt-4 text-center text-sm">
      <a
        :href="baseHost"
        target="_blank"
        rel="noopener noreferrer"
        class="glow-text-md text-hitagi-600 shadow-hitagi-500 hover:underline dark:text-hitagi-300 dark:shadow-hitagi-200"
      >
        {{ baseHost }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import autoAnimate from "@formkit/auto-animate";

const route = useRoute();
const router = useRouter();
const serverMeta = useServerMeta();

const baseHost = ref<string>("");

const loginForm = ref();
const apiToken = ref<string>();
const errorValidation = ref<string[]>([]);
const errorHTTP = ref<string>();
const submitting = ref(false);
const needApiToken = ref(false);

function addValidateError(error: string) {
  const isExist = errorValidation.value.findIndex((e) => e === error) !== -1;
  if (isExist) return;
  errorValidation.value.push(error);
}

function removeValidationError(error: string) {
  const idx = errorValidation.value.findIndex((e) => e === error);
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
      headers
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
      console.info("Redirecting to", decodeURIComponent(redirect));
      router.push(decodeURIComponent(redirect));
    } else {
      console.info("Redirecting to homepage...");
      router.push("/");
    }
  } catch (e) {
    if (e instanceof FetchError) {
      if ([401, 403].includes(e.response?.status ?? -1)) {
        errorHTTP.value = "Invalid API Token";
      } else {
        errorHTTP.value = `Failed to fetch: ${e.response?.statusText}`;
      }
    } else if (e instanceof Error) {
      errorHTTP.value = `Failed to fetch: ${e.message}`;
    }
  } finally {
    submitting.value = false;
  }
}

watch(
  () => apiToken.value,
  (apiToken) => {
    errorHTTP.value = undefined;
    if (!apiToken) {
      addValidateError("API Token is required");
    } else {
      removeValidationError("API Token is required");
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
