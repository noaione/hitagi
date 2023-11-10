type RecommendedConfig = "random" | "new" | "untagged";
type OrderByConfig = "asc" | "desc";
type ThumbnailFitConfig = "contain" | "cover";
type ThumbnailCoverFitSideConfig = "left" | "right" | "center";
type ListModeConfig = "list" | "grid";

export type LRRThemeConfigType = "hachikuji" | "hitagi" | "shinobu";

const ThemeMaps: Record<LRRThemeConfigType, string> = {
  hitagi: "ht-theme-hitagi",
  hachikuji: "ht-theme-hachikuji",
  shinobu: "ht-theme-shinobu",
};

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
    const theme = ref<LRRThemeConfigType>("hitagi");

    function changeThemeInternal(theme: LRRThemeConfigType): void {
      const themeClass = ThemeMaps[theme];

      if (document) {
        const htmlQuery = document.querySelector("html");

        if (htmlQuery) {
          for (const _themeClass of Object.values(ThemeMaps)) {
            htmlQuery.classList.remove(_themeClass);
          }

          htmlQuery.classList.add(themeClass);
        }
      }
    }

    function setThemeFromStorage() {
      changeThemeInternal(theme.value);
    }

    function changeTheme(_theme?: LRRThemeConfigType): void {
      if (!_theme) {
        changeThemeInternal("hitagi");
        theme.value = "hitagi";

        return;
      }

      if (Object.keys(ThemeMaps).includes(_theme)) {
        theme.value = _theme;

        changeThemeInternal(_theme);
      }
    }

    function setDefaults(): void {
      recommended.value = "random";
      sortBy.value = "title";
      order.value = "asc";
      thumbFit.value = "contain";
      thumbSide.value = "right";
      listMode.value = "grid";
      listCompact.value = false;
      theme.value = "hitagi";

      changeThemeInternal("hitagi");
    }

    return {
      recommended,
      sortBy,
      order,
      thumbFit,
      thumbSide,
      listMode,
      listCompact,
      theme,
      changeTheme,
      setThemeFromStorage,
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
