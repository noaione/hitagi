import type { InjectionKey, Ref } from "vue";

export type NumberStr = string;
export type BooleanStr = "true" | "false" | "none";

export const HitagiRefresher = Symbol("Hitagi Refresher") as InjectionKey<Ref<boolean>>;
export const LRRReaderPage = Symbol("Hitagi Reader Page") as InjectionKey<Ref<number>>;

export interface LoadedImage {
  url: string;
  blob?: Blob;
  width: number;
  height: number;
  // page number != index
  page: number;
  name: string;
}

export interface LRRArchiveMetadata {
  arcid: string;
  isnew: BooleanStr;
  pagecount: number;
  progress: number;
  tags: string;
  lastreadtime: number;
  title: string;
}

export interface LRRArchiveCategoryInfo {
  archives: string[];
  id: string;
  last_used: NumberStr;
  name: string;
  pinned: NumberStr;
  search: string;
}

export interface LRRArchiveCategories {
  categories: LRRArchiveCategoryInfo[];
  operation: "find_arc_categories";
  success: number;
}

export interface LRRArchiveFiles {
  job: number;
  pages: string[];
}

export interface LRRDatabaseStatsItem {
  namespace: string;
  text: string;
  weight: NumberStr;
}

export interface LRRSearchBase {
  data: LRRArchiveMetadata[];
}

export interface LRRSearchArchive extends LRRSearchBase {
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

export interface LRRMiscInfo {
  name: string;
  motd: string;
  version: string;
  version_name: string;
  version_desc: string;
  total_pages_read: number;
  has_password: NumberStr;
  debug_mode: NumberStr;
  nofun_mode: NumberStr;
  archives_per_page: NumberStr;
  server_resizes_images: NumberStr;
  server_tracks_progress: NumberStr;
  cache_last_cleared: NumberStr;
}

export interface LRRMinionJob {
  state: "finished" | "failed" | "active" | "inactive";
  task: string;
  error: string | null;
}

export interface LRRPluginsData {
  author: string;
  description: string;
  icon: string;
  name: string;
  namespace: string;
  oneshot_arg?: string;
  parameters: {
    desc: string;
    type: "bool" | "int" | "string";
  }[];
  type: "metadata" | "login" | "script";
  version: string;
}

/**
 * Convert a number string to number
 * @param str A number string
 * @returns number
 */
export function numStrToInt(str: NumberStr): number {
  return Number.parseInt(str);
}

export function boolStrToBool(str: BooleanStr): boolean {
  return str.toLowerCase() === "true";
}

type KVTags = Record<string, string[]>;

export const LRRTagColor: Record<string, string> = {
  artist: "cyan",
  magazine: "orange",
  series: "red",
  group: "emerald",
  female: "pink",
  male: "blue",
};

/**
 * Sort the key-value tags by key and value
 * @param keyValueTags Mapped key-value tags
 * @returns Sorted key-value tags
 */
function sortTags(keyValueTags: KVTags) {
  const sortedTags: Record<string, string[]> = {};

  for (const key of Object.keys(keyValueTags).sort()) {
    sortedTags[key] = keyValueTags[key].sort();
  }

  return sortedTags;
}

/**
 * Map a list of tags to a key-value tags.
 *
 * A tag without key will be put as "other" key.
 * @param tagsOrStrTag Tag string from API or an array of tags
 * @returns The key value tags
 */
export function mapTagsToKeyValues(tagsOrStrTag: string | string[]): KVTags {
  const tags: string[] = Array.isArray(tagsOrStrTag) ? tagsOrStrTag : tagsOrStrTag.split(",");

  const keyValueTags: KVTags = {};

  for (const tag of tags) {
    const [key, ...valueK] = tag.split(":");
    const actKey = valueK.length === 0 ? "other" : key;
    const values = keyValueTags[actKey] ?? [];

    values.push(valueK.length > 0 ? valueK.join(":") : key);
    keyValueTags[actKey] = values;
  }

  return sortTags(keyValueTags);
}

export function mapFilesIntoImages(files: string[]): LoadedImage[] {
  const copyOfFiles = [...files];

  return copyOfFiles.map((file, index) => {
    // page number are not available sometimes in files
    const page = index + 1;

    // find ?path=
    const pathIndex = file.indexOf("?path=");
    const fileName = pathIndex === -1 ? file : file.slice(pathIndex + 6);

    return {
      url: file,
      width: 0,
      height: 0,
      name: fileName,
      page,
    };
  });
}
