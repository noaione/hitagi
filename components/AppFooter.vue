<template>
  <footer
    class="font-incosolata mt-auto flex flex-col items-center py-2 text-center text-sm font-semibold text-hitagi-600 dark:text-hitagi-300"
  >
    <hr class="mb-4 w-[90%] border-hitagi-400" />
    <p class="mx-2 md:mx-auto">
      <span class="text-hitagi-500">
        Hitagi <span class="glow-text-md shadow-hitagi-700 dark:shadow-hitagi-400">{{ versionString }}</span>
      </span>
      <span v-if="server.info !== undefined">
        /
        <a
          :href="server.host"
          target="_blank"
          rel="noopener noreferrer"
          class="glow-text-lg shadow-hitagi-600 hover:underline dark:shadow-hitagi-300"
        >
          {{ server.info.name }}
        </a>
      </span>
    </p>
    <div class="mx-2 mt-2 flex flex-col items-center text-xs md:mx-auto" v-if="server.info">
      <span v-if="serverVerLink === undefined">v{{ server.info.version }} — {{ server.info.versionName }}</span>
      <span v-else>
        <a
          :href="serverVerLink"
          target="_blank"
          rel="noopener noreferrer"
          class="glow-text shadow-hitagi-600 hover:underline dark:shadow-hitagi-300"
        >
          v{{ server.info.version }}
        </a>
        — {{ server.info.versionName }}
      </span>
      <span class="mt-0.5">{{ server.info.versionDesc }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const runtimeConf = useRuntimeConfig();
const server = useServerMeta();

const serverVerLink = computed(() => {
  if (server.info === undefined) return undefined;
  return `https://github.com/Difegue/LANraragi/releases/tag/v.${server.info.version}`;
});

const gitSHA = computed(() => {
  const sha = import.meta.env.VERCEL_GIT_COMMIT_SHA || import.meta.env.CF_PAGES_COMMIT_SHA;

  if (typeof sha !== "string") return undefined;
  if (sha.length === 0) return undefined;

  // cut of only to 7 chars
  return sha.slice(0, 7);
});

const versionString = computed(() => {
  const clientVer = runtimeConf.public.clientVersion;

  let packageVer = `v${clientVer}`;
  if (import.meta.env.DEV) {
    return `${packageVer}-dev`;
  }

  if (gitSHA.value !== undefined) {
    packageVer += `+g${gitSHA.value}`;
  }

  return packageVer;
});
</script>
