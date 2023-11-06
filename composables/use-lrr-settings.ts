export const useLRRSettings = defineStore("lrr.serverSettings", () => {
  const serverMeta = useServerMeta();

  // State
  // Logged in state: True, False, or undefined (unknown)
  const loggedIn = ref<boolean | undefined>(undefined);

  // Getters

  // Actions
  async function loginFromState() {
    if (!serverMeta.apiKey64) {
      throw new Error("No API key set");
    }

    await $fetch(serverMeta.hostURL.origin + "/api/shinobu", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + serverMeta.apiKey64,
      },
    });

    loggedIn.value = true;
  }

  return {
    loggedIn,
    loginFromState,
  };
});
