// Uses The Movie DB's API to look up the details of a movie.
// https://developers.themoviedb.org/3

import { MovieInfo } from '../@types/bcnflix'
import * as Joda from 'js-joda'
import fetch from 'node-fetch'
import { URL } from 'url'
import sanitize from './utils/sanitize'
import * as path from 'path'

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
const enhanceWithTmdbInfo = async (
  localInfo: MovieInfo
): Promise<MovieInfo | undefined> => {
  const title = localInfo.localTitle
  const cachedMovie: MovieInfo = cache.getSync(sanitize(title))
  if (cachedMovie) {
    console.log(`got movie from file cache: ${title}`)
    return cachedMovie
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

  if (searchResults.total_results == 0)
    // no results - return the movie we were given
    return localInfo

  // Use the first result & hope it's right
  const bestResult = searchResults.results[0]
  const id = bestResult.id

  // Look up the details of the movie using that id
  const tmdbInfo: any = await throttle
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

  const movie = {
    id: tmdbInfo.id,
    title: tmdbInfo.title,
    localTitle: title,
    originalTitle: tmdbInfo.original_title,
    poster: tmdbInfo.poster_path
      ? `https://image.tmdb.org/t/p/w1280${tmdbInfo.poster_path}`
      : localInfo.poster,
    description: tmdbInfo.overview || localInfo.description,
    releaseDate: tmdbInfo.release_date
      ? Joda.LocalDate.parse(tmdbInfo.release_date)
      : undefined,
    language: tmdbInfo.original_language,
    countries: tmdbInfo.production_countries
      ? tmdbInfo.production_countries.map((d: any) => d.name)
      : [],
    languages: tmdbInfo.spoken_languages
      ? tmdbInfo.spoken_languages.map((d: any) => d.name)
      : [],
    runtime: tmdbInfo.runtime,
    genres: tmdbInfo.genres
      ? tmdbInfo.genres.map((d: any) => d.name)
      : undefined,
    tmdbRating: tmdbInfo.vote_average,
  }
  console.log(`got from tmdb: ${title}`)
  cache.put(sanitize(title), movie, () => {})
  return movie
}

export default enhanceWithTmdbInfo
