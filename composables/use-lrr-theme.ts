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

function changeThemeLogo(theme: HitagiThemeType): void {
  // logo located in the following:
  // <meta name="msapplication-TileImage" content="/img/icons/mstile-150x150.png">
  // <link rel="shortcut icon">
  // <link rel="apple-touch-icon" sizes="180x180">
  // <link rel="icon" type="image/png" sizes="32x32">
  // <link rel="icon" type="image/png" sizes="16x16">
  // <link rel="mask-icon" />

  const logoQuery = document.querySelector("link[rel='shortcut icon']");
  const appleTouchIconQuery = document.querySelector("link[rel='apple-touch-icon']");
  const icon32Query = document.querySelector("link[rel='icon'][sizes='32x32']");
  const icon16Query = document.querySelector("link[rel='icon'][sizes='16x16']");
  const maskIconQuery = document.querySelector("link[rel='mask-icon']");
  const msapplicationTileColorQuery = document.querySelector("meta[name='msapplication-TileColor']");
  const msapplicationTileImageQuery = document.querySelector("meta[name='msapplication-TileImage']");

  if (logoQuery) {
    logoQuery.setAttribute("href", `/icon/${theme}/favicon.ico`);
  }

  if (appleTouchIconQuery) {
    appleTouchIconQuery.setAttribute("href", `/icon/${theme}/apple-touch-icon.png`);
  }

  if (icon32Query) {
    icon32Query.setAttribute("href", `/icon/${theme}/favicon-32x32.png`);
  }

  if (icon16Query) {
    icon16Query.setAttribute("href", `/icon/${theme}/favicon-16x16.png`);
  }

  if (maskIconQuery) {
    maskIconQuery.setAttribute("href", `/icon/${theme}/safari-pinned-tab.svg`);
  }

  if (msapplicationTileImageQuery) {
    msapplicationTileImageQuery.setAttribute("content", `/icon/${theme}/mstile-144x144.png`);
  }

  const colorMap = {
    hitagi: "#77236b",
    hachikuji: "#4c5f2c",
    shinobu: "#9c5e0c",
  };

  if (msapplicationTileColorQuery) {
    msapplicationTileColorQuery.setAttribute("content", colorMap[theme] ?? colorMap.hitagi);
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
      changeThemeLogo(_theme);
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
