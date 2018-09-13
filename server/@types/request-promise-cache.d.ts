declare module 'request-promise-cache' {
  type requestParams = {
    url: string
    headers?: any
    cacheKey?: string
    cacheTTL?: number
    limit?: number
  }

  export default function request(params: requestParams): any
}
