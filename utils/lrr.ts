export type NumberStr = string;

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
