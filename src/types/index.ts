import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type RequestHandler<T extends ICommandHandler | IQueryHandler> =
  Parameters<T['execute']>[0];
export type ResponseHandler<T extends ICommandHandler | IQueryHandler> =
  Awaited<ReturnType<T['execute']>>;
