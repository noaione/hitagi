export type NumberStr = string;
export type BooleanStr = "true" | "false";

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
