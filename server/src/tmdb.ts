// Uses The Movie DB's API to look up the details of a movie.
// https://developers.themoviedb.org/3

import { Movie } from '../@types/bcnflix'
import * as Joda from 'js-joda'
import fetch from 'node-fetch'
import { URL } from 'url'
import { sanitize } from './sanitize'
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
const tmdbLookup = async (title: string): Promise<Movie | undefined> => {
  const cachedMovie: Movie = cache.getSync(sanitize(title))
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
    // no results
    return undefined

  // Use the first result & hope it's right
  const bestResult = searchResults.results[0]
  const id = bestResult.id

  // Look up the details of the movie using that id
  const _movie: any = await throttle
    .add(getById.bind(this, id))
    .catch((err: Error) => {
      throw err
    })

  if (_movie.status_code) {
    // rate limiting message - throw so we can try again
    const message = `${title} ${id} getById: ${_movie.status_message}`
    console.log(message)
    throw message
  }

  const movie = {
    id: _movie.id,
    localTitle: _movie.original_title || title,
    title: _movie.title || _movie.original_title || title,
    poster: _movie.poster_path
      ? `https://image.tmdb.org/t/p/w1280${_movie.poster_path}`
      : undefined,
    description: _movie.overview,
    releaseDate: Joda.LocalDate.parse(_movie.release_date),
    language: _movie.original_language,
    productionCountries: _movie.production_countries,
    spokenLanguages: _movie.spoken_languages,
    runtime: _movie.runtime,
    genres: _movie.genres
      ? _movie.genres.map((d: any) => d.name)
      : undefined,
    tmdbRating: _movie.vote_average,
  }
  console.log(`got from tmdb: ${title}`)
  cache.put(sanitize(title), movie, () => {})
  return movie
}

export default tmdbLookup
