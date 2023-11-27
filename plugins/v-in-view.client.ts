// Binding can be a direct callable
// Or a tuple of [callable, options]

import type { DirectiveBinding } from "vue";

interface HTMLElementWithObserver extends HTMLElement {
  __vueInViewObserver?: IntersectionObserver;
}

type CallbackBind<T extends HTMLElementWithObserver> = (el: T) => void;

type BindingData<T extends HTMLElementWithObserver> = CallbackBind<T> | [CallbackBind<T>, IntersectionObserverInit];

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("in-view", {
    mounted<T extends HTMLElementWithObserver>(el: T, binding: DirectiveBinding<BindingData<T>>) {
      const options = typeof binding.value === "function" ? {} : binding.value[1] ?? {};
      const callback = typeof binding.value === "function" ? binding.value : binding.value[0] ?? (() => {});

      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          callback(el);
        }
      }, options);

      observer.observe(el);

      el.__vueInViewObserver = observer;
    },

    beforeUnmount<T extends HTMLElementWithObserver>(el: T) {
      el.__vueInViewObserver?.disconnect();
    },
  });
});
