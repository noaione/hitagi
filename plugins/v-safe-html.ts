import type { DirectiveBinding } from "vue";
import DOMPurify from "dompurify";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("safe-html", {
    mounted<T extends HTMLElement>(el: T, binding: DirectiveBinding<string>) {
      el.innerHTML = DOMPurify.sanitize(binding.value, { USE_PROFILES: { html: true } });
    },
  });
});
