<template>
  <footer
    class="font-incosolata mt-auto flex flex-col items-center py-2 text-center text-sm font-semibold text-hitagi-600 dark:text-hitagi-300"
  >
    <hr class="mb-4 w-[90%] border-hitagi-400" />
    <p class="mx-2 md:mx-auto">
      <span class="text-hitagi-500"> Hitagi </span>
      <span v-if="server.info !== undefined">
        / <a :href="server.host" class="hover:underline">{{ server.info.name }}</a>
      </span>
    </p>
    <div class="mx-2 mt-2 flex flex-col items-center text-xs md:mx-auto" v-if="server.info">
      <span v-if="serverVerLink === undefined">v{{ server.info.version }} — {{ server.info.versionName }}</span>
      <span v-else>
        <a :href="serverVerLink" target="_blank" rel="noopener noreferrer" class="hover:underline">
          v{{ server.info.version }}
        </a>
        — {{ server.info.versionName }}
      </span>
      <span class="mt-0.5">{{ server.info.versionDesc }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const server = useServerMeta();

const serverVerLink = computed(() => {
  if (server.info === undefined) return undefined;
  return `https://github.com/Difegue/LANraragi/releases/tag/v.${server.info.version}`;
});
</script>
