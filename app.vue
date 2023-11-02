<template>
  <SplashScreen v-if="splash" />
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const serverMeta = useServerMeta();
const runtimeConfig = useRuntimeConfig();

const splash = ref(true);

function shutOffSplash() {
  splash.value = false;
}

router.afterEach((to) => {
  if (to.fullPath.startsWith("/server")) {
    shutOffSplash();
  }
});

onMounted(() => {
  if (route.fullPath.startsWith("/server")) {
    shutOffSplash();
    return;
  }

  const envBasePath = runtimeConfig?.public?.basePath;
  const basePath = envBasePath ?? serverMeta.host;

  console.log(basePath);

  if (typeof basePath !== "string") {
    router.push("/server");
    return;
  }

  if (basePath.trim().length === 0) {
    router.push("/server");
    return;
  }

  if (typeof envBasePath === "string" && envBasePath.trim().length > 0) {
    serverMeta.setApiHost(envBasePath);
  }

  $fetch<LRRMiscInfo>(basePath + "/api/info", {
    method: "GET"
  })
    .then((response) => {
      if (numStrToInt(response.nofun_mode) === 1) {
        router.push("/server");
        return;
      }

      serverMeta.setInfoFromAPI(response);

      nextTick(() => {
        shutOffSplash();
      });
    })
    .catch((err) => {
      console.error(err);
      router.push("/server");
    });
});
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
