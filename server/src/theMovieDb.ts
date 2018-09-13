// Uses The Movie DB's API to look up the details of a movie.
// https://developers.themoviedb.org/3

import theMovieDbApi from 'themoviedb-javascript-library'
import { Movie } from '../@types/bcnflix'
import * as Joda from 'js-joda'

require('dotenv').config()

var movieCache = require('persistent-cache')()

theMovieDbApi.common.api_key = process.env.THE_MOVIE_DB_API_KEY || ''

const PromiseThrottle = require('promise-throttle')
const throttle = new PromiseThrottle({
  requestsPerSecond: 3,
  promiseImplementation: Promise,
})

const search = (query: string): Promise<any> =>
  new Promise((resolve, reject) =>
    theMovieDbApi.search.getMovie({ query }, resolve, reject)
  )

const getById = (id: string): Promise<any> =>
  new Promise((resolve, reject) =>
    theMovieDbApi.movies.getById({ id }, resolve, reject)
  )

const lookupMovie = async (title: string): Promise<Movie | undefined> => {
  // NEXT: mock this
  // const cachedMovie = movieCache.getSync(title)
  // if (cachedMovie) {
  //   console.log(`got from file cache: ${title}`)
  //   return Promise.resolve(cachedMovie)
  // }
  const searchResults: any = await throttle
    .add(search.bind(this, title))
    .catch((err: Error) => {
      throw err
    })
  if (searchResults.status_code)
    // rate limiting message - throw so we can try again
    throw `${title} search: ${searchResults.status_message}`
  else if (searchResults.total_results == 0) {
    // no results
    return undefined
  }
  const bestResult = searchResults.results[0]
  const id = bestResult.id

  const m: any = await throttle
    .add(getById.bind(this, id))
    .catch((err: Error) => {
      throw err
    })

  if (m.status_code)
    // rate limiting message - throw so we can try again
    throw `${title} ${id} getById: ${m.status_message}`

  // movieCache.put(title, movieFromApi, () => {})
  const movie: Movie = {
    id: m.id,
    localTitle: m.original_title || title,
    title: m.title || m.original_title || title,
    poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w1280${m.poster_path}`
      : undefined,
    description: m.overview,
    releaseDate: Joda.LocalDate.parse(m.release_date),
    language: m.original_language,
    productionCountries: m.production_countries,
    spokenLanguages: m.spoken_languages,
    runtime: Joda.Duration.ofMinutes(m.runtime),
    genres: m.genres,
    tmdbRating: m.vote_average,
  }
  return movie
}

export default lookupMovie
