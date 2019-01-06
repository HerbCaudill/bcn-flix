// Uses The Movie DB's API to look up the details of a movie.
// https://developers.themoviedb.org/3
import fetch from 'node-fetch'
import * as path from 'path'
import { URL } from 'url'

import { MovieInfo } from '../@types/bcnflix'
import sanitize from './utils/sanitize'

require('dotenv').config()

const persistentCache = require('persistent-cache')
const cache = persistentCache({
  duration: 1000 * 60 * 60 * 24 * 30, // 1 month
  base: path.join(__dirname, '../.cache'),
  name: 'tmdb',
})

// tmdb starts rejecting requests if more than 40/10 secs
const PromiseThrottle = require('promise-throttle')
const throttle = new PromiseThrottle({
  requestsPerSecond: 3,
  promiseImplementation: Promise,
})

const api_key = process.env.THE_MOVIE_DB_API_KEY || ''
const baseUrl = 'https://api.themoviedb.org/3'

const search = async (query: string): Promise<any> => {
  const url = new URL(`${baseUrl}/search/movie`)
  url.searchParams.append('api_key', api_key)
  url.searchParams.append('query', query)
  const response = await fetch(url.toString())
  return response.json()
}

const getById = async (id: string): Promise<any> => {
  const url = new URL(`${baseUrl}/movie/${id}`)
  url.searchParams.append('api_key', api_key)
  const response = await fetch(url.toString())
  return response.json()
}

// Looks up a movie on tmdb by title (in any language)
const getTmdbInfo = async (title: string): Promise<any> => {
  const cachedMovie: MovieInfo = cache.getSync(sanitize(title))
  if (cachedMovie) {
    console.log(`cached: ${title}`)
    return cachedMovie
  }

  // For titles of the form "Tiempos Violentos (Pulp Fiction)",
  // we assume that it might be the same title in two languages, and
  // we search for each of these first:
  //  - Tiempos Violentos
  //  - Pulp Fiction
  // If we get multiple results, we just return the first one.
  // If we get no results, we proceed to search for the full title.
  const matches = title.match(/(.+?)\s\((.+)\)/)
  if (matches) {
    const titles = Array.from(matches).slice(1)
    const searches = titles.map(async title => await getTmdbInfo(title))
    const results = await Promise.all(searches)
    const firstGoodResult = results.find(d => d) // Returns first truthy value
    if (firstGoodResult) return firstGoodResult
  }

  // Search using local title to find tmdb id
  const searchResults_response: string = await throttle
    .add(search.bind(this, title))
    .catch((err: Error) => {
      throw err
    })
  const searchResults: any = searchResults_response

  if (searchResults.status_code) {
    // rate limiting message - throw so we can try again
    const message = `${title} search: ${searchResults.status_message}`
    console.log(message)
    throw message
  }

  if (searchResults.results && searchResults.results.length > 0) {
    // Use the first result & hope it's right
    const bestResult = searchResults.results[0]
    const id = bestResult.id

    // Look up the details of the movie using that id
    const tmdbInfo = await throttle
      .add(getById.bind(this, id))
      .catch((err: Error) => {
        throw err
      })

    if (tmdbInfo.status_code) {
      // rate limiting message - throw so we can try again
      const message = `${title} ${id} getById: ${tmdbInfo.status_message}`
      console.log(message)
      throw message
    }

    console.log(`got from tmdb: ${title}`)
    cache.put(sanitize(title), tmdbInfo, () => {})
    return tmdbInfo
  } else return undefined
}

export default getTmdbInfo
