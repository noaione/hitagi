export interface HitagiToast {
  title?: string;
  message: string;
  type: "success" | "info" | "warning" | "error" | "default";
  duration: number;
  persist?: boolean;
}

export interface HitagiToastInternal extends HitagiToast {
  id: string;
}

interface ToastState {
  toasts: HitagiToastInternal[];
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export const useHitagiToast = defineStore("hitagi.toast", {
  state: (): ToastState => ({
    toasts: [],
  }),
  getters: {
    hasToast(): boolean {
      return this.toasts.length > 0;
    },
  },
  actions: {
    toast(toast: Optional<HitagiToast, "type" | "duration">): void {
      const mergedToast: HitagiToast = {
        type: "default",
        duration: 5000,
        ...toast,
      };

      if (mergedToast.duration < 1000) {
        mergedToast.duration = 1000;
      }

      const itemId = Date.now().toString();

      // put toast at start of array
      this.toasts = [
        {
          ...mergedToast,
          id: itemId,
        },
        ...this.toasts,
      ];
    },
    removeToast(toast: HitagiToastInternal | string): void {
      this.toasts =
        typeof toast === "string"
          ? this.toasts.filter((t) => t.id !== toast)
          : this.toasts.filter((t) => t.id !== toast.id);
    },
  },
});
