export default defineNuxtRouteMiddleware((to) => {
  // Check if /server
  if (to.path === "/server") {
    return;
  }
  const runtimeConfig = useRuntimeConfig();

  // Check if BASE_PATH is set
  const basePath = runtimeConfig?.public?.basePath;
  if (typeof basePath !== "string") {
    return navigateTo("/server?redirect=" + encodeURIComponent(to.fullPath));
  }

  if (basePath.trim().length === 0) {
    return navigateTo("/server?redirect=" + encodeURIComponent(to.fullPath));
  }

  const settings = useSettings();
  settings.host = basePath;
  return;
});
