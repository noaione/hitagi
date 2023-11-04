import type { NuxtPage } from "nuxt/schema";
import pkg from "./package.json";

function getEnv(key: string): string | undefined {
  return import.meta.env[key] ?? process.env[key];
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
    "@nuxtjs/google-fonts",
    "@nuxtjs/eslint-module",
    "@vueuse/nuxt",
    "vue3-carousel-nuxt",
  ],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "dark",
  },
  runtimeConfig: {
    public: {
      baseHost: getEnv("BASE_HOST") ?? getEnv("NUXT_PUBLIC_BASE_HOST") ?? undefined,
      clientVersion: pkg.version,
      clientSHA: getEnv("VERCEL_GIT_COMMIT_SHA") ?? getEnv("CF_PAGES_COMMIT_SHA") ?? undefined,
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
});
