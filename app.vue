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

const isMounted = ref(false);
const splash = ref(true);

function shutOffSplash() {
  splash.value = false;
}

router.afterEach(() => {
  shutOffSplash();
});

onMounted(() => {
  useSeoMeta({
    title: "Hitagi",
    ogTitle: "Hitagi",
    description: `A "modern" LANraragi web client`,
    ogDescription: `A "modern" LANraragi web client`,
    ogImage: "/hitagi-hero.png",
    twitterCard: "summary_large_image"
  });

  isMounted.value = true;
  if (route.fullPath.startsWith("/server")) {
    shutOffSplash();
    return;
  }

  const envBasePath = runtimeConfig?.public?.baseHost;
  const basePath = envBasePath || serverMeta.host;

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
        if (isNone(serverMeta.apiKey)) {
          router.push("/login");
          return;
        }
        if (serverMeta.apiKey?.trim().length === 0) {
          router.push("/login");
          return;
        }
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
