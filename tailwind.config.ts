import type { Config } from "tailwindcss";
import type { PluginCreator } from "tailwindcss/types/config";
import forms from "@tailwindcss/forms";
import colors from "tailwindcss/colors";

import postcss from "postcss";
import postcssJS from "postcss-js";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 *
 * @param cssPath
 */
function cssImportPlugin(cssPath: string): PluginCreator {
  // get current file dir, do not use process.cwd() because it will be different
  // and we can't use import.meta.url because it's not a module

  // eslint-disable-next-line unicorn/prefer-module
  const fullPath = join(__dirname, cssPath);

  if (!fullPath.endsWith(".css")) {
    throw new Error("cssImportPlugin: path must be a .css file");
  }

  if (!existsSync(fullPath)) {
    throw new Error(`cssImportPlugin: file not found at ${fullPath}`);
  }

  return ({ addBase, addComponents, addUtilities }) => {
    const css = readFileSync(fullPath, "utf8");

    const root = postcss.parse(css);
    const jss = postcssJS.objectify(root);

    if (jss["@layer base"]) {
      addBase(jss["@layer base"]);
    }

    if (jss["@layer components"]) {
      addComponents(jss["@layer components"]);
    }

    if (jss["@layer utilities"]) {
      addUtilities(jss["@layer utilities"]);
    }
  };
}

export default <Partial<Config>>{
  content: [
    "./assets/**/*.{js,css,scss,html}",
    "./components/**/*.{js,ts,vue}",
    "./composables/**/*.{js,ts,vue}",
    "./layouts/**/*.{js,ts,vue}",
    "./middleware/**/*.{js,ts,vue}",
    "./pages/**/*.{js,ts,vue}",
    "./utils/**/*.{js,ts,vue}",
    "./app.vue",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
        hitagi: {
          50: "#fcf7fc",
          100: "#f9eef8",
          200: "#f2dcf0",
          300: "#e7c0e3",
          400: "#d79bd0",
          500: "#c372b9",
          600: "#a6539a",
          700: "#7f3e74",
          800: "#703866",
          900: "#5d3254",
          950: "#3b1734",
        },
        themed: {
          50: "rgb(var(--hitagi-theme-50) / <alpha-value>)",
          100: "rgb(var(--hitagi-theme-100) / <alpha-value>)",
          200: "rgb(var(--hitagi-theme-200) / <alpha-value>)",
          300: "rgb(var(--hitagi-theme-300) / <alpha-value>)",
          400: "rgb(var(--hitagi-theme-400) / <alpha-value>)",
          500: "rgb(var(--hitagi-theme-500) / <alpha-value>)",
          600: "rgb(var(--hitagi-theme-600) / <alpha-value>)",
          700: "rgb(var(--hitagi-theme-700) / <alpha-value>)",
          800: "rgb(var(--hitagi-theme-800) / <alpha-value>)",
          900: "rgb(var(--hitagi-theme-900) / <alpha-value>)",
          950: "rgb(var(--hitagi-theme-950) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [
    forms({ strategy: "class" }),
    cssImportPlugin("./assets/css/components/archives.css"),
    cssImportPlugin("./assets/css/components/font.css"),
    cssImportPlugin("./assets/css/components/shadowy-text.css"),
  ],
  safelist: [
    "object-right",
    "object-left",
    "object-center",
    {
      pattern: /(bg|text|shadow|border|decoration)-themed-(\d{2,3})/,
    },
  ],
};
