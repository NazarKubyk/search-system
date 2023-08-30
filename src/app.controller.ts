import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { SearchDto } from './search/search.dto';
import { SearchQueryHandler } from './search/search.handler';
import { SearchQuery } from './search/search.query';
import { RequestHandler, ResponseHandler } from './types';

@Controller()
export class AppController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('search')
  @UseInterceptors(CacheInterceptor)
  async search(@Query() query: SearchDto.Query): Promise<SearchDto.Response> {
    type Request = RequestHandler<SearchQueryHandler>;
    type Response = ResponseHandler<SearchQueryHandler>;

    const results = await this.queryBus.execute<Request, Response>(
      new SearchQuery(query),
    );

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return results;
  }
}
