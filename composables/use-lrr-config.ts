type RecommendedConfig = "random" | "new" | "untagged" | "latest";
type OrderByConfig = "asc" | "desc";
type ThumbnailFitConfig = "contain" | "cover";
type ThumbnailCoverFitSideConfig = "left" | "right" | "center";
type ListModeConfig = "list" | "grid";

export const useLRRConfig = defineStore(
  "lrr.configV2",
  () => {
    const recommended = ref<RecommendedConfig>("random");
    // namespace
    const sortBy = ref<string>("title");
    const order = ref<OrderByConfig>("asc");
    const thumbFit = ref<ThumbnailFitConfig>("contain");
    const thumbSide = ref<ThumbnailCoverFitSideConfig>("right");
    const listMode = ref<ListModeConfig>("grid");
    const listCompact = ref<boolean>(false);

    function setDefaults(): void {
      recommended.value = "random";
      sortBy.value = "title";
      order.value = "asc";
      thumbFit.value = "contain";
      thumbSide.value = "right";
      listMode.value = "grid";
      listCompact.value = false;
    }

    return {
      recommended,
      sortBy,
      order,
      thumbFit,
      thumbSide,
      listMode,
      listCompact,
      defaults: setDefaults,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
      key: "hitagi.config",
    },
  }
);
