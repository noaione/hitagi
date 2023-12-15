import debounce from "lodash.debounce";

const SearchResultStub = Symbol("SearchResultStub");

interface SearchResultMetadata {
  pageIndex: number;
  data: LRRArchiveMetadata[] | typeof SearchResultStub;
}

export const useLRRSearch = defineStore("lrrsearchV2", () => {
  const serverMeta = useServerMeta();
  const config = useLRRConfig();

  // State
  const filter = ref<string>("");
  const category = ref<string>();
  const sortBy = ref<"title" | string>("title");
  const sortNamespaces = ref<string[]>([]); // available namespaces

  const loading = ref<boolean>(false);
  const error = ref<Error>();

  const _lastFilter = ref<string>("");
  const _lastCategory = ref<string>();

  const searchResults = ref<SearchResultMetadata[]>([]);
  const searchRecords = ref<number>(0);
  const archiveRecords = ref<number>(0);
  const currentPageIndex = ref<number>(0);

  // Used to output to user
  const statsInformations = ref<LRRDatabaseStatsItem[]>([]);

  // Getters
  const perPage = computed(() => {
    return serverMeta.info?.archivesPerPage ?? 100;
  });
  const hasMore = computed(() => {
    if (searchResults.value) {
      const hasStub = searchResults.value.findIndex((item) => item.data === SearchResultStub);

      return hasStub === -1;
    }

    return false;
  });
  const maxPage = computed(() => {
    return Math.ceil(searchRecords.value / perPage.value);
  });
  const unfetched = computed(() => {
    return searchResults.value.length === 0 && filter.value === "";
  });
  const currentSearchSlice = computed(() => {
    const findPage = searchResults.value.find((item) => item.pageIndex === currentPageIndex.value);

    if (!findPage) return [];

    if (findPage.data === SearchResultStub) return [];

    return findPage.data;
  });

  // Actions
  function currentPageSliceHasStub(page: number) {
    const findPage = searchResults.value.find((item) => item.pageIndex === page);

    if (!findPage) return true;

    return findPage.data === SearchResultStub;
  }
  function internalPrefillSearch(data: LRRArchiveMetadata[], pageIndex: number, maxPage: number) {
    for (let i = 0; i < maxPage; i++) {
      if (i === pageIndex) {
        searchResults.value[i] = {
          pageIndex,
          data,
        };
      } else {
        if (isNone(searchResults.value[i])) {
          searchResults.value[i] = {
            pageIndex: i,
            data: SearchResultStub,
          };
        }
      }
    }
  }
  async function search(page: number, clearResults?: boolean, navigateFinish?: boolean) {
    console.info(
      "Searching",
      filter.value,
      category.value,
      searchRecords.value,
      sortBy.value,
      config.order,
      clearResults
    );

    if (_lastFilter.value !== filter.value || _lastCategory.value !== category.value || clearResults) {
      // Reset state
      searchResults.value = [];
      searchRecords.value = 0;
      archiveRecords.value = 0;
      currentPageIndex.value = 0;
    }

    if (!currentPageSliceHasStub(page)) {
      console.info("Page", page, "has no stub, skipping");

      return;
    }

    loading.value = true;
    error.value = undefined;

    try {
      const req = await useLRR<LRRSearchArchive>("/search", {
        params: {
          filter: filter.value,
          category: category.value,
          start: page * perPage.value,
          sortby: sortBy.value,
          order: config.order,
        },
      });

      _lastCategory.value = category.value;
      _lastFilter.value = filter.value;

      searchRecords.value = req.recordsFiltered;
      archiveRecords.value = req.recordsTotal;

      const maximumPage = Math.ceil(searchRecords.value / perPage.value);

      internalPrefillSearch(req.data, page, maximumPage);

      if (navigateFinish) {
        navigatePage(page);
      }
    } catch (error_) {
      error.value = error_ instanceof Error ? error_ : new Error("Unknown error");
    } finally {
      loading.value = false;
    }
  }
  async function getAvailableTags(force?: boolean) {
    if (!force && sortNamespaces.value.length > 0) return;

    try {
      const req = await useLRR<LRRDatabaseStatsItem[]>("/database/stats", {
        params: {
          minweight: 2,
        },
      });

      // Get all namespace and dedupe
      const namespaces = new Set<string>();

      for (const item of req) {
        namespaces.add(item.namespace);
      }

      sortNamespaces.value = [...namespaces];
      statsInformations.value = req;
    } catch (error_) {
      if (error_ instanceof Error) {
        console.error(error_);
      }
    }
  }
  function navigatePage(targetPage: number) {
    if (targetPage < 0) return;

    if (targetPage > maxPage.value) return;

    currentPageIndex.value = targetPage;

    search(targetPage);
  }

  // Actions + Getters
  const searchDebounced = debounce(search, 500);

  // Extra
  const pageSelectorIndex = computed({
    get: () => currentPageIndex.value,
    set: (value) => {
      navigatePage(value);
    },
  });

  return {
    // State
    filter,
    category,
    sortBy,
    sortNamespaces,
    loading,
    error,
    searchResults,
    searchRecords,
    archiveRecords,
    currentPageIndex,
    statsInformations,

    // Getters
    hasMore,
    unfetched,
    perPage,
    maxPage,
    currentSearchSlice,
    pageSelectorIndex,

    // Actions
    search,
    searchDebounced,
    navigatePage,
    getAvailableTags,
  };
});
