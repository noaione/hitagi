export interface StateServerInfo {
  name: string;
  motd: string;
  version: string;
  versionName: string;
  versionDesc: string;
  totalPagesRead: number;
  hasPassword: boolean;
  debugMode: boolean;
  restrictedMode: boolean;
  archivesPerPage: number;
  shouldResizeImage: boolean;
  shouldTrackProgress: boolean;
  cacheLastCleared: number;
}

export interface StateServerMeta {
  host?: string;
  apiKey?: string;
  info?: StateServerInfo;
}

export const useServerMeta = defineStore("servers", {
  state: (): StateServerMeta => ({
    host: undefined,
    apiKey: undefined,
    info: undefined
  }),
  persist: {
    storage: persistedState.localStorage,
    key: "hitagi.servers"
  },
  getters: {
    hostURL(): URL {
      return new URL(this.host || "");
    },
    apiKey64(): string | undefined {
      if (!this.apiKey) return undefined;

      return b64encode(this.apiKey);
    },
    infoAsLRR(): LRRMiscInfo | undefined {
      if (!this.info) return undefined;

      return {
        name: this.info.name,
        motd: this.info.motd,
        version: this.info.version,
        version_name: this.info.versionName,
        version_desc: this.info.versionDesc,
        total_pages_read: this.info.totalPagesRead,
        has_password: this.info.hasPassword ? "1" : "0",
        debug_mode: this.info.debugMode ? "1" : "0",
        nofun_mode: this.info.restrictedMode ? "1" : "0",
        archives_per_page: this.info.archivesPerPage.toString(),
        server_resizes_images: this.info.shouldResizeImage ? "1" : "0",
        server_tracks_progress: this.info.shouldTrackProgress ? "1" : "0",
        cache_last_cleared: this.info.cacheLastCleared.toString()
      };
    }
  },
  actions: {
    setApiKey(apiKey: string | undefined): void {
      this.apiKey = apiKey;
    },
    setApiHost(host: string | undefined): void {
      this.host = host;
    },
    setInfoFromAPI(apiData: LRRMiscInfo): void {
      this.info = {
        name: apiData.name,
        motd: apiData.motd,
        version: apiData.version,
        versionName: apiData.version_name,
        versionDesc: apiData.version_desc,
        totalPagesRead: apiData.total_pages_read,
        hasPassword: Boolean(numStrToInt(apiData.has_password)),
        debugMode: Boolean(numStrToInt(apiData.debug_mode)),
        restrictedMode: Boolean(numStrToInt(apiData.nofun_mode)),
        archivesPerPage: numStrToInt(apiData.archives_per_page),
        shouldResizeImage: Boolean(numStrToInt(apiData.server_resizes_images)),
        shouldTrackProgress: Boolean(numStrToInt(apiData.server_tracks_progress)),
        cacheLastCleared: numStrToInt(apiData.cache_last_cleared)
      };
    },
    async fetchInfoFromAPI(force?: boolean) {
      if (!this.host) return;
      if (this.info && !force) return;

      const url = new URL("/api/info", this.host);
      const headers = new Headers();

      if (this.apiKey) {
        headers.append("Authorization", `Bearer ${btoa(this.apiKey)}`);
      }

      const response = await $fetch<LRRMiscInfo>(url.toString(), {
        method: "GET",
        headers
      });

      this.setInfoFromAPI(response);
    },
    defaults(): void {
      this.apiKey = undefined;
      this.host = undefined;
      this.info = undefined;
    }
  }
});
