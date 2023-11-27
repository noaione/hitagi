export type HitagiThemeType = "hachikuji" | "hitagi" | "shinobu";

const ThemeMaps: Record<HitagiThemeType, string> = {
  hitagi: "ht-theme-hitagi",
  hachikuji: "ht-theme-hachikuji",
  shinobu: "ht-theme-shinobu",
};

function changeThemeInternal(theme: HitagiThemeType): void {
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

export const useLRRTheme = () => {
  const storage = useLocalStorage<HitagiThemeType>("hitagi.theme", "hitagi");

  function changeTheme(_theme?: HitagiThemeType): void {
    if (!_theme) {
      changeThemeInternal("hitagi");
      storage.value = "hitagi";

      return;
    }

    if (Object.keys(ThemeMaps).includes(_theme)) {
      storage.value = _theme;

      changeThemeInternal(_theme);
    }
  }

  const theme = computed({
    get: () => storage.value,
    set: (newValue) => {
      storage.value = newValue;
      changeTheme(newValue);
    },
  });

  return theme;
};
