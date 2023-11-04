import type { NuxtPage } from "nuxt/schema";
import pkg from "./package.json";

function getEnv(key: string): string | undefined {
  return import.meta.env[key] ?? process.env[key];
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  vue: {
    defineModel: true,
    propsDestructure: true
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-icon",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxtjs/eslint-module"
  ],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "dark"
  },
  runtimeConfig: {
    public: {
      baseHost: getEnv("BASE_HOST") ?? getEnv("NUXT_PUBLIC_BASE_HOST") ?? undefined,
      clientVersion: pkg.version,
      clientSHA: getEnv("VERCEL_GIT_COMMIT_SHA") ?? getEnv("CF_PAGES_COMMIT_SHA") ?? undefined
    }
  },
  googleFonts: {
    families: {
      Inter: true,
      Raleway: true,
      Incosolata: true
    }
  },
  eslint: {
    lintOnStart: false
  },
  app: {
    layoutTransition: {
      name: "layout-fade",
      mode: "out-in"
    }
  },
  imports: {
    imports: [
      {
        name: "default",
        as: "Grid",
        from: "vue-virtual-scroll-grid"
      },
      {
        name: "FetchError",
        from: "ofetch"
      }
    ]
  },
  hooks: {
    "pages:extend"(pages) {
      // remove routes
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
        for (const page of pagesToRemove) {
          pages.splice(pages.indexOf(page), 1);
        }
      }

      if (process.env.NODE_ENV === "production") {
        // Remove all pages that match the pattern in production
        console.log("Removing dev pages for production build...");
        removePagesMatching(/\/_testground/, pages);
      }
    }
  }
});
