export interface StateLRRConfig {
  recommended: "random" | "new" | "untagged";
  // namespace
  sortBy: string;
  order: "asc" | "desc";
  thumbFit: "contain" | "cover";
  // list will show no cover
  // grid will show cover with all information like tags
  // list-compact will show minimal tags information
  // grid-compact will show cover with only title and author/group
  listMode: "list" | "grid";
  listCompact: boolean;
}

export const useLRRConfig = defineStore("lrrconfig", {
  state: (): StateLRRConfig => ({
    recommended: "random",
    sortBy: "title",
    order: "asc",
    thumbFit: "contain",
    listMode: "grid",
    listCompact: false,
  }),
  persist: {
    storage: persistedState.localStorage,
    key: "hitagi.config",
  },
  actions: {
    defaults(): void {
      this.recommended = "random";
      this.sortBy = "title";
      this.order = "asc";
      this.thumbFit = "contain";
      this.listMode = "grid";
    },
  },
});
