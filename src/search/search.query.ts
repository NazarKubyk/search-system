interface SearchQueryPayload {
  q: string;
}

export class SearchQuery {
  constructor(public readonly payload: SearchQueryPayload) {}
}
