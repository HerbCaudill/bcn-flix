import fetch from 'node-fetch'
import sanitize from './sanitize'
import * as path from 'path'

const persistentCache = require('persistent-cache')
const cache = persistentCache({
  duration: 1000 * 60 * 60 * 12, // 12 hours
  base: path.join(__dirname, '../../.cache'),
  name: 'scraped',
})

const PromiseThrottle = require('promise-throttle')
const throttle = new PromiseThrottle({
  requestsPerSecond: 3,
  promiseImplementation: Promise,
})

const IMA_BROWSER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'

const scrape = async (url: string): Promise<string> => {
  const cachedHtml = cache.getSync(sanitize(url))
  if (cachedHtml) {
    console.log(`cached: ${url}`)
    return cachedHtml
  }

  const pageRequest = async (url: string) => {
    const response = await fetch(url, {
      headers: { 'User-Agent': IMA_BROWSER },
    })
    return response.text()
  }

  const html = await throttle
    .add(pageRequest.bind(this, url))
    .catch((err: Error) => {
      // console.log(`Error loading ${url}:`, err.message)
      return ''
    })

  console.log(`new: ${url}`)
  cache.put(sanitize(url), html, () => {})
  return html
}

export default scrape
