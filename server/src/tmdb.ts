// Uses The Movie DB's API to look up the details of a movie.
// https://developers.themoviedb.org/3

import tmdbApi from 'themoviedb-javascript-library'
import { Movie } from '../@types/bcnflix'
import * as Joda from 'js-joda'
import PromiseThrottle from 'promise-throttle'

require('dotenv').config()

tmdbApi.common.api_key = process.env.THE_MOVIE_DB_API_KEY || ''

// tmdb gets tetchy about repeated requests,
// so we use promise-throttle to slow down and retry if rejected
const throttle = new PromiseThrottle({
  requestsPerSecond: 3,
  promiseImplementation: Promise,
})

// Promisify tmdb title search
const search = (query: string): Promise<any> =>
  new Promise((resolve, reject) =>
    tmdbApi.search.getMovie({ query }, resolve, reject)
  )

// Promisify tmdb id lookup
const getById = (id: string): Promise<any> =>
  new Promise((resolve, reject) =>
    tmdbApi.movies.getById({ id }, resolve, reject)
  )

// Looks up a movie on tmdb by title (in any language)
const tmdbLookup = async (title: string): Promise<Movie | undefined> => {
  // Search using local title to find tmdb id
  const searchResults: any = await throttle
    .add(search.bind(this, title))
    .catch((err: Error) => {
      throw err
    })

  if (searchResults.status_code)
    // rate limiting message - throw so we can try again
    throw `${title} search: ${searchResults.status_message}`

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

  if (_movie.status_code)
    // rate limiting message - throw so we can try again
    throw `${title} ${id} getById: ${_movie.status_message}`

  return {
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
    runtime: Joda.Duration.ofMinutes(_movie.runtime),
    genres: _movie.genres,
    tmdbRating: _movie.vote_average,
  }
}

export default tmdbLookup
