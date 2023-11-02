export default defineNuxtRouteMiddleware((to) => {
  // Check if /server
  if (to.path === "/server") {
    return;
  }
  const runtimeConfig = useRuntimeConfig();
  const serverMeta = useServerMeta();

  // Check if BASE_PATH is set
  const envBasePath = runtimeConfig?.public?.basePath;
  const basePath = envBasePath ?? serverMeta.host;
  if (typeof basePath !== "string") {
    return navigateTo("/server?redirect=" + encodeURIComponent(to.fullPath));
  }

  if (basePath.trim().length === 0) {
    return navigateTo("/server?redirect=" + encodeURIComponent(to.fullPath));
  }

  // if env base path is set, also set it in the settings
  if (typeof envBasePath === "string" && envBasePath.trim().length > 0) {
    serverMeta.setApiHost(envBasePath);
  }
});
