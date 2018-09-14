import request = require('request-promise-cache')
import PromiseThrottle = require('promise-throttle')

const IMA_BROWSER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'

const throttle = new PromiseThrottle({
  requestsPerSecond: 3,
  promiseImplementation: Promise,
})

const scrape = async (url: string): Promise<string> => {
  const pageRequest = (url: string) => {
    return request({
      url,
      headers: { 'User-Agent': IMA_BROWSER },
      cacheKey: url,
      cacheTTL: 60 * 60 * 1000,
      limit: 0,
    })
  }

  const html = await throttle
    .add(pageRequest.bind(this, url))
    .catch((err: Error) => {
      console.log(`Error loading ${url}:`, err.message)
      return ''
    })
  return html
}

export default scrape
