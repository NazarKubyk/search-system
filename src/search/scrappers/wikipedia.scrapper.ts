import * as cheerio from 'cheerio';
import * as unirest from 'unirest';
import { FormattedResult, Scrapper, userAgent } from '.';
import { imageUrlToBase64String } from '../../utils';

export class WikipediaScrapper implements Scrapper {
  async scrap(
    url: string,
  ): Promise<Pick<FormattedResult, 'image' | 'summary'>> {
    const response = await unirest
      .get(url)
      .headers({ 'User-Agent': userAgent });

    const $ = cheerio.load(response.body);

    const firstParagraph = $(
      '.mw-parser-output > p:not(.mw-empty-elt):not([class=""])',
    )
      .first()
      .text();

    let image = null;
    const imgUrl = $('.infobox-image img.mw-file-element').first().attr('src');

    if (imgUrl?.startsWith('//upload.wikimedia.org')) {
      image = await imageUrlToBase64String('https:' + imgUrl);
    }

    return {
      image,
      summary: firstParagraph.replace(/(\[\d+\]|\n(?!\s))/g, ''),
    };
  }
}
