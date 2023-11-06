<template>
  <div class="flex w-full flex-col flex-wrap justify-center">
    <div class="flex flex-row items-center justify-center gap-4">
      <div class="font-incosolata flex flex-col items-center">
        <CrabIcon class="mx-auto h-16 w-16 text-hitagi-700 dark:text-hitagi-300" />
        <span class="text-hitagi-600 dark:text-hitagi-400">Hitagi</span>
      </div>
      <div class="flex flex-col items-center">
        <NuxtImg src="/images/lrr-logo.png" class="mx-auto h-16 w-16" />
        <p class="font-semibold">
          <span class="text-cyan-500">LAN</span>
          <span class="text-green-400">rara</span>
          <span class="text-pink-300">gi</span>
        </p>
      </div>
    </div>
    <div class="mt-4 flex flex-col">
      <p class="font-semibold text-hitagi-600 dark:text-hitagi-400">
        Server:
        <NuxtLink
          :to="serverMeta.hostURL.origin"
          class="glow-text text-hitagi-700 shadow-hitagi-300 hover:underline dark:text-hitagi-300 dark:shadow-hitagi-500"
          target="_blank"
          rel="noopener noreferrer"
          external
        >
          {{ serverMeta?.info?.name }}
        </NuxtLink>
      </p>
      <p class="text-hitagi-700 dark:text-hitagi-300">
        &nbsp;v{{ serverMeta?.info?.version }} — {{ serverMeta?.info?.versionName }}
      </p>
      <p class="text-hitagi-700 dark:text-hitagi-300">&nbsp;{{ serverMeta?.info?.versionDesc }}</p>
    </div>
    <div class="mt-4 flex flex-col">
      <p class="font-semibold text-hitagi-600 dark:text-hitagi-400">
        Client: <span class="text-hitagi-700 dark:text-hitagi-300"> {{ versionString }}</span>
      </p>
      <p v-if="gitSHA" class="text-hitagi-600 dark:text-hitagi-400">
        &nbsp;Git SHA:&nbsp;
        <NuxtLink class="whitespace-pre-wrap break-all text-hitagi-700 dark:text-hitagi-300">{{ gitSHA }}</NuxtLink>
      </p>
      <p class="font-semibold text-hitagi-600 dark:text-hitagi-400">&nbsp;Packages:</p>
      <p class="text-hitagi-600 dark:text-hitagi-400">
        &nbsp; - Nuxt:
        <span class="text-hitagi-700 dark:text-hitagi-300">
          v{{ runtimeConf.public.packagesVersion.nuxt }} (Vue v{{ runtimeConf.public.packagesVersion.vue }})
        </span>
      </p>
      <p class="text-hitagi-600 dark:text-hitagi-400">
        &nbsp; - Pinia:
        <span class="text-hitagi-700 dark:text-hitagi-300">
          v{{ runtimeConf.public.packagesVersion.pinia.version }} (Plugin v{{
            runtimeConf.public.packagesVersion.pinia.nuxt
          }})
        </span>
      </p>
      <p class="text-hitagi-600 dark:text-hitagi-400">
        &nbsp;&nbsp;&nbsp; - Persisted State:
        <span class="text-hitagi-700 dark:text-hitagi-300">
          v{{ runtimeConf.public.packagesVersion.pinia.persist }}
        </span>
      </p>
      <p class="text-hitagi-600 dark:text-hitagi-400">
        &nbsp; - TailwindCSS:
        <span class="text-hitagi-700 dark:text-hitagi-300"> v{{ runtimeConf.public.packagesVersion.tailwind }} </span>
      </p>
    </div>

    <div v-if="serverSettings.loggedIn" class="mt-4 flex flex-col items-center">
      <p class="font-semibold text-hitagi-600 dark:text-hitagi-400">API Key</p>
      <p class="select-all whitespace-pre-wrap break-all text-hitagi-700 dark:text-hitagi-300" @copy="copyAPIKey">
        {{ redactAPIKey(serverMeta.apiKey ?? "") }}
      </p>
    </div>

    <div class="mt-4 flex flex-col items-center">
      <NuxtLink v-if="!serverSettings.loggedIn" :to="`/login?redirect=${encodeURIComponent('/settings')}`">
        <HitagiButton class="w-full md:w-auto">Login</HitagiButton>
      </NuxtLink>
      <HitagiButton
        v-if="serverSettings.loggedIn"
        class="w-full md:w-auto"
        :disabled="!logoutBtn"
        @click="performLogout"
      >
        Logout
      </HitagiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const serverSettings = useLRRSettings();
const serverMeta = useServerMeta();

const runtimeConf = useRuntimeConfig();

const router = useRouter();
const logoutBtn = ref(true);

const { copy: copyClipboard } = useClipboard();

const gitSHA = computed(() => {
  const sha = runtimeConf.public.clientSHA;

  if (typeof sha !== "string") return;

  if (sha.length === 0) return;

  return sha;
});

const versionString = computed(() => {
  const clientVer = runtimeConf.public.clientVersion;

  let packageVer = `v${clientVer}`;

  if (import.meta.env.DEV) {
    return `${packageVer}-dev`;
  }

  if (gitSHA.value !== undefined) {
    packageVer += `+g${gitSHA.value.slice(0, 7)}`;
  }

  return packageVer;
});

function redactAPIKey(apiKey: string) {
  // only show the first 4 chars (check for length too)
  if (apiKey.length < 4) return "*".repeat(apiKey.length);

  return `${apiKey.slice(0, 4)}${"*".repeat(apiKey.length - 4)}`;
}

function copyAPIKey(ev: ClipboardEvent) {
  ev.preventDefault();

  const apiKey = serverMeta.apiKey ?? "";

  copyClipboard(apiKey);
}

function performLogout() {
  logoutBtn.value = false;

  serverMeta.setApiKey();
  serverSettings.loggedIn = false;

  if (serverMeta.info?.restrictedMode) {
    router.push(`/login?redirect=${encodeURIComponent("/settings")}`);
  }
}

onMounted(() => {
  logoutBtn.value = true;
});
</script>
