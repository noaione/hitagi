export default defineNuxtRouteMiddleware((to) => {
  // Check if path is admin prefix
  if (!to.path.startsWith("/admin")) {
    return;
  }

  // Check if user is logged in
  const settings = useServerMeta();

  if (isNone(settings.apiKey)) {
    return navigateTo("/login?redirect=" + encodeURIComponent(to.fullPath));
  }

  // Check if string is empty
  if (settings.apiKey.trim().length === 0) {
    return navigateTo("/login?redirect=" + encodeURIComponent(to.fullPath));
  }

  // Is admin
  return;
});
