export interface StateLRRReaderConfig {
  flow: "ltr" | "rtl" | "vertical";
  doublePage: boolean;
  fitMode: "screen-height" | "screen-width";
}

export const useLRRReaderConfig = defineStore("lrrconfig.reader", {
  state: (): StateLRRReaderConfig => ({
    flow: "ltr",
    doublePage: false,
    fitMode: "screen-height"
  }),
  persist: {
    storage: persistedState.localStorage,
    key: "hitagi.reader.config"
  },
  actions: {
    defaults(): void {
      this.flow = "ltr";
      this.doublePage = false;
      this.fitMode = "screen-height";
    }
  }
});
