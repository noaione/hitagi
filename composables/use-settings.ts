export interface StateSettings {
  host?: string;
  apiKey?: string;
  readingDirection: "ltr" | "rtl";
  prefetch: number;
}

export const useSettings = defineStore("settings", {
  state: (): StateSettings => ({
    host: undefined,
    apiKey: undefined,
    readingDirection: "ltr",
    prefetch: 3
  }),
  persist: {
    storage: persistedState.localStorage,
    key: "hitagi:settings"
  },
  actions: {
    setApiKey(apiKey: string): void {
      this.apiKey = apiKey;
    },
    setReadingDirection(readingDirection: "ltr" | "rtl"): void {
      this.readingDirection = readingDirection;
    },
    setPrefetch(prefetch: number): void {
      this.prefetch = prefetch;
    },
    defaults(): void {
      this.apiKey = undefined;
      this.readingDirection = "ltr";
      this.prefetch = 3;
    },
    disposeEvery(): void {
      this.defaults();
      this.host = undefined;
    }
  }
});
