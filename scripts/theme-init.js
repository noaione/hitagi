"use strict";

(function () {
  let theme = window.localStorage.getItem("hitagi.theme");

  const ThemeMaps = {
    hitagi: "ht-theme-hitagi",
    hachikuji: "ht-theme-hachikuji",
    shinobu: "ht-theme-shinobu",
  };

  if (!Object.keys(ThemeMaps).includes(theme)) {
    window.localStorage.setItem("hitagi.theme", "hitagi");
    theme = "hitagi";
  }

  if (theme && window.document) {
    const htmlQuery = window.document.querySelector("html");

    if (htmlQuery) {
      for (const _themeClass of Object.values(ThemeMaps)) {
        htmlQuery.classList.remove(_themeClass);
      }

      htmlQuery.classList.add(ThemeMaps[theme]);
    }

    const logoQuery = window.document.querySelector("link[rel='shortcut icon']");
    const appleTouchIconQuery = window.document.querySelector("link[rel='apple-touch-icon']");
    const icon32Query = window.document.querySelector("link[rel='icon'][sizes='32x32']");
    const icon16Query = window.document.querySelector("link[rel='icon'][sizes='16x16']");
    const maskIconQuery = window.document.querySelector("link[rel='mask-icon']");
    const msapplicationTileColorQuery = window.document.querySelector("meta[name='msapplication-TileColor']");
    const msapplicationTileImageQuery = window.document.querySelector("meta[name='msapplication-TileImage']");

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
})();
