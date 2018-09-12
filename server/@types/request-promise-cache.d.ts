declare module 'request-promise-cache' {
  type requestParams = {
    url: string
    cacheKey?: string
    cacheTTL?: number
    limit?: number
  }

  export default function request(params: requestParams): any
}
