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
  }
});
