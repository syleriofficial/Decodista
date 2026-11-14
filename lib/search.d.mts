/** Public types for the pure JavaScript search shared by Node tests and React. */
export declare const SEARCH_QUERY_LIMIT: number;

export declare function normalizeSearchQuery(value: unknown): string;

export interface SearchableRecord {
  title: string;
  description: string;
  categoryName: string;
  contentTypeName: string;
  tags: string[];
}

export declare function searchPublishedRecords<T extends SearchableRecord>(
  records: T[],
  rawQuery: unknown,
): T[];
