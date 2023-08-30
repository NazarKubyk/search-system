export const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36';

export interface FormattedResult {
  image: string;
  title: string;
  link: string;
  summary: string;
}

/**
 * The scrapper interface
 */
export interface Scrapper {
  /**
   * Scrap the search results from the google.com
   *
   * @param query the search query
   * @returns the formatted search results
   */
  scrap: (
    query: string,
  ) => Promise<FormattedResult[] | Pick<FormattedResult, 'image' | 'summary'>>;
}

export * from './search.scrapper';
export * from './wikipedia.scrapper';
