export default defineNuxtPlugin(() => {
  const settings = useServerMeta();

  addRouteMiddleware(
    "admin-guard",
    (to) => {
      // check if path is admin prefix (and ensure that is not just /admin or /admin/)
      const isAdminIndex = to.path === "/admin" || to.path === "/admin/";

      if (!to.path.startsWith("/admin") || isAdminIndex) {
        return;
      }

      const redirect = encodeURIComponent(to.fullPath);

      if (isNone(settings.apiKey64)) {
        return navigateTo("/login?redirect=" + redirect);
      }

      if (settings.apiKey64.trim().length === 0) {
        return navigateTo("/login?redirect=" + redirect);
      }

      // Is admin, continue
    },
    { global: true }
  );
});
