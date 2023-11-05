export interface StateLRRReaderConfig {
  flow: "ltr" | "rtl" | "vertical";
  // single: single page mode
  // double: double page mode, first page is single
  // double-cover: double page mode, first page is double
  pagingMode: "single" | "double" | "double-cover";
  fitMode: "screen-height" | "screen-width";
  background: "gray" | "black" | "white";
}

export const useLRRReaderConfig = defineStore("lrrconfig.reader", {
  state: (): StateLRRReaderConfig => ({
    flow: "ltr",
    pagingMode: "single",
    fitMode: "screen-height",
    background: "gray",
  }),
  persist: {
    storage: persistedState.localStorage,
    key: "hitagi.reader.config",
  },
  actions: {
    defaults(): void {
      this.flow = "ltr";
      this.pagingMode = "single";
      this.fitMode = "screen-height";
      this.background = "gray";
    },
  },
});
