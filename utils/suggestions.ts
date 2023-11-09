import type { LRRDatabaseStatsItem } from "./lrr";

export interface LRRDatabaseStatsItemWithMatch extends LRRDatabaseStatsItem {
  startIndex: number;
  endIndex: number;
}

function makeNamespaceRegex(namespaces: string[]): RegExp {
  // namespace: "tag:xxx"
  namespaces = namespaces.filter((ns) => ns.trim().length > 0);

  // regex: (?:ns1|ns2|ns3):(.*)
  const regex = `(?:${namespaces.join("|")}):(.*)`;

  return new RegExp(regex, "i");
}

function doSearchFilter(query: string, tags: LRRDatabaseStatsItem[]): LRRDatabaseStatsItemWithMatch[] {
  const queryRe = new RegExp(query, "i");

  return tags
    .map((item) => {
      const { text } = item;
      const matched = text.match(queryRe);

      // get the first match
      if (matched?.index !== undefined) {
        return {
          ...item,
          startIndex: matched.index,
          endIndex: matched.index + query.length,
        };
      }
    })
    .filter((item) => item !== undefined) as LRRDatabaseStatsItemWithMatch[];
}

function sampleResults(
  rawResults: LRRDatabaseStatsItemWithMatch[],
  sampleCount: number
): LRRDatabaseStatsItemWithMatch[] {
  // do not use Math.random() because it is too predictable

  const typedArray = new Uint32Array(sampleCount);
  const randomValues = window.crypto.getRandomValues(typedArray);

  const selIndex = new Set<number>();

  for (const random of randomValues) {
    selIndex.add(random % rawResults.length);
  }

  // Clamp the value
  return rawResults.filter((_, index) => selIndex.has(index));
}

export function createSuggestions(currentQuery: string, sample?: number): LRRDatabaseStatsItemWithMatch[] {
  const search = useLRRSearch();

  sample = sample ?? 10;

  if (search.statsInformations.length === 0) return [];

  const statsSuggestions = [...search.statsInformations];
  const nsRe = makeNamespaceRegex(search.sortNamespaces);

  // see query if it formatted like "tag:xxx"
  const query = currentQuery.trim();

  console.log("Create suggestions", query, sample);

  if (!query) return [];

  const nsQuery = nsRe.exec(query);

  if (nsQuery) {
    const [, ns] = nsQuery;

    // Filter by namespace first
    const tags = statsSuggestions.filter((item) => item.namespace.toLowerCase() === ns.toLowerCase());

    return sampleResults(doSearchFilter(query, tags), sample);
  }

  return sampleResults(doSearchFilter(query, statsSuggestions), sample);
}
