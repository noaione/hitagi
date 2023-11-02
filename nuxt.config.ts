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
      baseHost: process.env.BASE_HOST ?? process.env.NUXT_PUBLIC_BASE_HOST ?? undefined
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
  }
});
