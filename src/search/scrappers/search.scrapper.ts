import * as cheerio from 'cheerio';
import * as unirest from 'unirest';
import { FormattedResult, Scrapper, userAgent } from '.';

export class SearchScrapper implements Scrapper {
  async scrap(query: string): Promise<FormattedResult[]> {
    const url = 'https://google.com/search?q=' + query + '&gl=us&hl=en';

    const response = await unirest
      .get(url)
      .headers({ 'User-Agent': userAgent });

    const $ = cheerio.load(response.body);

    const images = [];
    const titles = [];
    const links = [];
    const summaries = [];

    $('.yuRUbf > div img.XNo5Ab').each((index, element) => {
      images.push($(element).attr('src'));
    });

    $('.yuRUbf > div > a > h3').each((index, element) => {
      titles.push($(element).text());
    });

    $('.yuRUbf > div > a').each((index, element) => {
      links.push($(element).attr('href'));
    });

    $('.g .VwiC3b').each((index, element) => {
      summaries.push($(element).text());
    });

    const organicResults = [];

    for (let i = 0; i < titles.length; i++) {
      organicResults.push({
        image: images[i],
        title: titles[i],
        link: links[i],
        summary: summaries[i],
      });
    }

    return organicResults;
  }
}
