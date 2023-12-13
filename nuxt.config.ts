import type { NuxtPage } from "nuxt/schema";
import pkg from "./package.json";
import pkgLock from "./package-lock.json";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

function getEnv(key: string): string | undefined {
  const metaKey = import.meta.env[key];
  const processKey = process.env[key];

  // Ensure empty strings are treated as undefined
  if (metaKey) return metaKey;

  if (processKey) return processKey;

  return;
}

function removePagesMatching(pattern: RegExp, pages: NuxtPage[] = []) {
  const pagesToRemove = [];

  for (const page of pages) {
    if (!page.file) continue;

    if (pattern.test(page.file)) {
      pagesToRemove.push(page);
    } else {
      removePagesMatching(pattern, page.children);
    }
  }

  if (pagesToRemove.length === 0) return;

  console.log("Removing dev pages:", pagesToRemove.map((p) => p.path).join(", "));

  for (const page of pagesToRemove) {
    pages.splice(pages.indexOf(page), 1);
  }
}

function getPackageInformation() {
  const piniaNuxtVer = pkgLock.packages["node_modules/@pinia/nuxt"].version;
  const piniaVer = pkgLock.packages["node_modules/pinia"].version;
  const piniaPersistVer = pkgLock.packages["node_modules/pinia-plugin-persistedstate"].version;

  const nuxtVer = pkgLock.packages["node_modules/nuxt"].version;
  const vueVer = pkgLock.packages["node_modules/vue"].version;

  const tailwindVer = pkgLock.packages["node_modules/tailwindcss"].version;

  return {
    pinia: {
      version: piniaVer,
      nuxt: piniaNuxtVer,
      persist: piniaPersistVer,
    },
    nuxt: nuxtVer,
    vue: vueVer,
    tailwind: tailwindVer,
  };
}

const BUILD_SCRIPTS_CACHE: Record<string, string> = {};

function readFromScript(filename: string): string {
  if (BUILD_SCRIPTS_CACHE[filename]) {
    return BUILD_SCRIPTS_CACHE[filename];
  }

  const currentDir = dirname(fileURLToPath(import.meta.url));

  const scriptsDir = join(currentDir, "scripts", filename);

  const scriptsContents = readFileSync(scriptsDir, "utf8");

  // minify
  // remove comments
  // remove newlines
  const minified = scriptsContents.replaceAll(/\/\/.*/g, "").replaceAll("\n", "");

  BUILD_SCRIPTS_CACHE[filename] = minified;

  return minified;
}

const plausibleApiHost = getEnv("NUXT_PUBLIC_PLAUSIBLE_API_HOST") ?? getEnv("PLAUSIBLE_API_HOST");
const plausibleDomain = getEnv("NUXT_PUBLIC_PLAUSIBLE_DOMAIN") ?? getEnv("PLAUSIBLE_DOMAIN");

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  vue: {
    defineModel: true,
    propsDestructure: true,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-icon",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image",
    "@nuxtjs/google-fonts",
    "@nuxtjs/eslint-module",
    "@vueuse/nuxt",
    "vue3-carousel-nuxt",
    "@nuxtjs/plausible",
  ],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "dark",
    storageKey: "hitagi.theme.dark",
  },
  runtimeConfig: {
    public: {
      baseHost: getEnv("BASE_HOST") ?? getEnv("NUXT_PUBLIC_BASE_HOST") ?? undefined,
      clientVersion: pkg.version,
      clientSHA: getEnv("VERCEL_GIT_COMMIT_SHA") ?? getEnv("CF_PAGES_COMMIT_SHA") ?? undefined,
      packagesVersion: getPackageInformation(),
    },
  },
  googleFonts: {
    families: {
      Inter: true,
      Raleway: true,
      Incosolata: true,
    },
  },
  eslint: {
    lintOnStart: false,
  },
  app: {
    layoutTransition: {
      name: "layout-fade",
      mode: "out-in",
    },
    head: {
      meta: [
        {
          "http-equiv": "x-ua-compatible",
          content: "IE=edge",
        },
        {
          name: "apple-mobile-web-app-title",
          content: "Hitagi",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "application-name",
          content: "Hitagi",
        },
        {
          name: "msapplication-TileColor",
          content: "#77236b",
        },
        {
          name: "msapplication-TileImage",
          content: "/icon/hitagi/mstile-144x144.png",
        },
      ],
      link: [
        {
          rel: "shortcut icon",
          href: "/icon/hitagi/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/icon/hitagi/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/icon/hitagi/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/icon/hitagi/favicon-16x16.png",
        },
        {
          rel: "manifest",
          href: "/site.webmanifest",
        },
        {
          rel: "mask-icon",
          href: "/icon/hitagi/safari-pinned-tab.svg",
          color: "#77236b",
        },
      ],
      script: [
        {
          type: "text/javascript",
          "data-script": "theme-init.js",
          innerHTML: readFromScript("theme-init.js"),
        },
      ],
    },
  },
  imports: {
    presets: [
      {
        from: "@floating-ui/vue",
        imports: ["useFloating", "VirtualElement"],
      },
    ],
    imports: [
      {
        name: "FetchError",
        from: "ofetch",
      },
    ],
  },
  hooks: {
    "pages:extend"(pages) {
      // remove routes
      if (process.env.NODE_ENV === "production") {
        // Remove all pages that match the pattern in production
        console.log("Removing dev pages for production build...");
        removePagesMatching(/\/_testground/, pages);
      }
    },
  },
  plausible: {
    apiHost: plausibleApiHost,
    domain: plausibleDomain,
    // enable auto page views if api host and domain are set
    autoPageviews: Boolean(plausibleApiHost && plausibleDomain),
  },
});
