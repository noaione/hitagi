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
  }
})();
