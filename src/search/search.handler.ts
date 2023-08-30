import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FormattedResult } from './scrappers';
import { SearchScrapper } from './scrappers/search.scrapper';
import { WikipediaScrapper } from './scrappers/wikipedia.scrapper';
import { SearchQuery } from './search.query';

@QueryHandler(SearchQuery)
export class SearchQueryHandler implements IQueryHandler<SearchQuery> {
  async execute(query: SearchQuery) {
    const { q: searchQuery } = query.payload;

    const searchScrapper = new SearchScrapper();
    const results = await searchScrapper.scrap(searchQuery);

    await Promise.all(
      results.map((result, index) => {
        if (index > 9) return result;
        return this.checkIfWikipediaResult(result);
      }),
    );

    return results;
  }

  private async checkIfWikipediaResult(item: FormattedResult) {
    if (!item.link.includes('wikipedia.org/wiki/')) return item;

    const wikipediaScrapper = new WikipediaScrapper();
    const { image, summary } = await wikipediaScrapper.scrap(item.link);

    item.image = image || item.image;
    item.summary = summary || item.summary;

    return item;
  }
}
