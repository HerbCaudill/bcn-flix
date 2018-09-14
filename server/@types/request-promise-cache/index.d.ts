type requestParams = {
  url: string
  headers?: any
  cacheKey?: string
  cacheTTL?: number
  limit?: number
}

declare function request(params: requestParams): any
export = request
