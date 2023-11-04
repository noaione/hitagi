export interface StateLRRSearch {
  filter: string;
  category: string;
}

export const useLRRSearch = defineStore("lrrsearch", {
  state: (): StateLRRSearch => {
    return {
      filter: "",
      category: "",
    };
  },
  actions: {
    clear(): void {
      this.filter = "";
    },
    setFilter(filter: string): void {
      this.filter = filter;
    },
    setCategory(category: string): void {
      this.category = category;
    },
  },
});
