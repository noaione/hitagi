import type { NitroFetchOptions } from "nitropack";

type HTTPMethod = "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";

function useLRRInternal<T>(path: string, options?: NitroFetchOptions<string, HTTPMethod>): Promise<T> {
  const settings = useServerMeta();

  path = path.startsWith("/") ? path : `/${path}`;

  if (path.startsWith("/api")) {
    path = path.slice(4);
  }

  const lrrURL = settings.hostURL.origin + "/api" + path;

  return $fetch<T>(lrrURL, options);
}

export const useLRR = useLRRInternal;
