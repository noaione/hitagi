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
const webConfig = useLRRConfig();
const serverSetting = useLRRSettings();

const isMounted = ref(false);
const splash = ref(true);

function shutOffSplash() {
  splash.value = false;
}

router.afterEach(() => {
  shutOffSplash();
});

function testForAPILogin() {
  if (!serverSetting.loggedIn && serverMeta.apiKey64) {
    serverSetting
      .loginFromState()
      // eslint-disable-next-line promise/no-nesting
      .then(() => {
        nextTick(() => {
          shutOffSplash();
        });
      })
      .catch(() => {
        serverMeta.setApiKey();
        serverSetting.loggedIn = false;

        nextTick(() => {
          shutOffSplash();
        });
      });
  } else {
    serverSetting.loggedIn = false;

    nextTick(() => {
      shutOffSplash();
    });
  }
}

router.beforeResolve((to) => {
  // properly check for the server settings

  // ignore following
  if (to.fullPath.startsWith("/server")) {
    return;
  }

  // check if host is set
  if (isNone(serverMeta.host)) {
    navigateTo("/server?redirect" + encodeURIComponent(to.fullPath));

    return;
  }

  // check if API key is set, and no fun mode is enabled
  if (isNone(serverMeta.apiKey) && serverMeta.info?.restrictedMode && !to.fullPath.startsWith("/login")) {
    navigateTo("/login?=redirect" + encodeURIComponent(to.fullPath));

    return;
  }

  // everything is fine, continue
});

onMounted(() => {
  useSeoMeta({
    title: "Hitagi",
    ogTitle: "Hitagi",
    description: `A "modern" LANraragi web client`,
    ogDescription: `A "modern" LANraragi web client`,
    ogImage: "/hitagi-hero.png",
    twitterCard: "summary_large_image",
  });
  webConfig.setThemeFromStorage();

  isMounted.value = true;

  const currentRoute = route.fullPath;

  if (currentRoute.startsWith("/server")) {
    shutOffSplash();

    return;
  }

  const envBasePath = runtimeConfig?.public?.baseHost;
  const basePath = envBasePath || serverMeta.host;
  const redirect = encodeURIComponent(currentRoute);

  if (typeof basePath !== "string") {
    router.push(`/server?redirect=${redirect}`);

    return;
  }

  if (basePath.trim().length === 0) {
    router.push(`/server?redirect=${redirect}`);

    return;
  }

  if (typeof envBasePath === "string" && envBasePath.trim().length > 0) {
    serverMeta.setApiHost(envBasePath);
  }

  $fetch<LRRMiscInfo>(basePath + "/api/info", {
    method: "GET",
  })
    .then((response) => {
      if (numStrToInt(response.nofun_mode) === 1) {
        if (currentRoute.startsWith("/login")) {
          return;
        }

        if (isNone(serverMeta.apiKey)) {
          router.push(`/login?redirect=${redirect}`);

          return;
        }

        if (serverMeta.apiKey?.trim().length === 0) {
          router.push(`/login?redirect=${redirect}`);

          return;
        }
      }

      serverMeta.setInfoFromAPI(response);
      testForAPILogin();
    })
    .catch((error) => {
      console.error(error);
      router.push(`/server?redirect=${redirect}`);
    });
});
</script>
