import { IsString } from 'class-validator';
import { FormattedResult } from './scrappers';

export namespace SearchDto {
  export class Query {
    @IsString()
    q: string;
  }

  export type Response = FormattedResult[];
}
