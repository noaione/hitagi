export default defineNuxtRouteMiddleware((to) => {
  if (process.server) {
    return;
  }

  const settings = useServerMeta();
  const redirect = encodeURIComponent(to.fullPath);

  if (isNone(settings.apiKey64)) {
    return navigateTo("/login?redirect=" + redirect);
  }

  if (settings.apiKey64.trim().length === 0) {
    return navigateTo("/login?redirect=" + redirect);
  }
});
