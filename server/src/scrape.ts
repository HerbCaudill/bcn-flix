import fetch from 'node-fetch'

const PromiseThrottle = require('promise-throttle')

const IMA_BROWSER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'

const throttle = new PromiseThrottle({
  requestsPerSecond: 3,
  promiseImplementation: Promise,
})

const scrape = async (url: string): Promise<string> => {
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
  return html
}

export default scrape
