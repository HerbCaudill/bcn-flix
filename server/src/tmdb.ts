// Uses The Movie DB's API to look up the details of a movie.
// https://developers.themoviedb.org/3

import tmdbApi = require('themoviedb-javascript-library')
import { Movie } from '../@types/bcnflix'
import * as Joda from 'js-joda'
import PromiseThrottle = require('promise-throttle')

require('dotenv').config()

tmdbApi.common.api_key = process.env.THE_MOVIE_DB_API_KEY || ''

// tmdb gets tetchy about repeated requests,
// so we use promise-throttle to slow down and retry if rejected
const throttle = new PromiseThrottle({
  requestsPerSecond: 3,
  promiseImplementation: Promise,
})

const search = (query: string): Promise<any> =>

const getById = (id: string): Promise<any> =>
  

// Looks up a movie on tmdb by title (in any language)
const tmdbLookup = async (title: string): Promise<Movie | undefined> => {
  // Search using local title to find tmdb id
  const searchResults_response: string = await throttle
    .add(search.bind(this, title))
    .catch((err: Error) => {
      throw err
    })
  const searchResults = JSON.parse(searchResults_response)

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
  const movie_response: any = await throttle
    .add(getById.bind(this, id))
    .catch((err: Error) => {
      throw err
    })
  const _movie = JSON.parse(movie_response)

  if (_movie.status_code) {
    // rate limiting message - throw so we can try again
    const message = `${title} ${id} getById: ${_movie.status_message}`
    console.log(message)
    throw message
  }

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
    runtime: _movie.runtime,
    genres: _movie.genres
      ? _movie.genres.map((d: any) => d.name)
      : undefined,
    tmdbRating: _movie.vote_average,
  }
}

export default tmdbLookup
