export interface StateLRRReaderConfig {
  flow: "ltr" | "rtl" | "vertical" | "webtoon";
  // single: single page mode
  // double: double page mode, first page is single
  // double-cover: double page mode, first page is double
  pagingMode: "single" | "double" | "double-cover";
  fitMode: "screen-height" | "screen-width";
  background: "gray" | "black" | "white";
  // prefetch pages
  // from current page, prefetch pages in both directions.
  preloadPage: number;
}

export const useLRRReaderConfig = defineStore("lrrconfig.reader", {
  state: (): StateLRRReaderConfig => ({
    flow: "ltr",
    pagingMode: "single",
    fitMode: "screen-height",
    background: "gray",
    preloadPage: 3,
  }),
  persist: {
    storage: persistedState.localStorage,
    key: "hitagi.reader.config",
  },
  getters: {
    isPaged(): boolean {
      // flow is not vertical or webtoon
      return this.flow !== "vertical" && this.flow !== "webtoon";
    },
    isDoublePage(): boolean {
      return this.pagingMode === "double" || this.pagingMode === "double-cover";
    },
    preloadCount(): number {
      // preload pages in both directions, if double page mode, preload * 1.5 (round up)
      return Math.ceil(this.preloadPage * (this.isDoublePage ? 1.5 : 1));
    },
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
