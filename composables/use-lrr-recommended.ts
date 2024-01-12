export const useLRRRecommended = defineStore("lrrrecommendedV2", () => {
  const config = useLRRConfig();
  const toaster = useHitagiToast();
  const search = useLRRSearch();

  // State
  const loading = ref<boolean>(false);
  const data = ref<LRRArchiveMetadata[]>();
  const error = ref<Error>();
  const searchState = ref<string>("");

  async function internalGetRandom(keyState: string) {
    // default: dedupe mode
    if (loading.value) return;

    loading.value = true;

    if (config.recommended === "random") {
      const randomLRR = await useLRR<LRRSearchBase>(`/search/random`, {
        params: {
          filter: search.filter,
          category: search.category,
          count: 25,
        },
      });

      loading.value = false;
      searchState.value = keyState;

      return randomLRR.data;
    } else {
      const params: Record<string, string | number> = {
        filter: search.filter,
        category: search.category ?? "",
        start: -1,
        order: "desc",
        sortby: "date_added",
        count: 25,
      };

      if (config.recommended === "untagged") {
        params.untaggedonly = "true";
      } else if (config.recommended === "new") {
        params.newonly = "true";
      }

      const searchLRR = await useLRR<LRRSearchArchive>(`/search`, {
        params,
      });

      loading.value = false;
      searchState.value = keyState;

      return searchLRR.data;
    }
  }

  async function fetchRandomCommon(reload: boolean = false) {
    const keyState = `recommended-${config.recommended}-${search.filter}-${search.category}`;

    if (searchState.value === keyState) return;

    if (reload) {
      data.value = undefined;
    }

    try {
      const results = await internalGetRandom(keyState);

      data.value = results ?? [];
    } catch (error_) {
      error.value = error_ instanceof Error ? error_ : new Error("Unknown error");

      if (error_ instanceof Error) {
        // check caused by
        // - FetchError
        if (error_.cause instanceof FetchError) {
          const errorMsg: string = error_.cause.response?._data?.error ?? error.value.message;

          toaster.toast({
            title: "Failed to load recommendation",
            message: errorMsg,
            type: "error",
          });
        } else {
          toaster.toast({
            title: "Unknown error",
            message: "Please see the console for more information.",
            type: "error",
          });
          console.error(error.value);
        }
      }
    }
  }

  async function fetchRandom() {
    await fetchRandomCommon();
  }

  async function reload() {
    console.log("Reloading recommended");
    await fetchRandomCommon(true);
  }

  return {
    loading,
    data,
    error,
    reload,
    fetchRandom,
  };
});
