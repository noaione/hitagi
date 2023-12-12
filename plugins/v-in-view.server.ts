// Stub plugin for server-side rendering

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("in-view", {
    mounted() {},
    beforeUnmount() {},
  });
});
