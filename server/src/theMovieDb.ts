// Uses The Movie DB's API to look up the details of a movie.
// https://developers.themoviedb.org/3

import * as theMovieDbApi from '../lib/theMovieDb'

import * as dotenv from 'dotenv'
dotenv.config()

import cache from 'persistent-cache'
var movieCache = cache()

theMovieDbApi.common.api_key = process.env.THE_MOVIE_DB_API_KEY || ''

const PromiseThrottle = require('promise-throttle')

const throttle = new PromiseThrottle({
  requestsPerSecond: 3,
  promiseImplementation: Promise,
})

const lookupMovie = (title: string) => {
  const cachedMovie = movieCache.getSync(title)
  if (cachedMovie) {
    console.log(`got from file cache: ${title}`)
    return Promise.resolve(cachedMovie)
  }
  return throttle
    .add(
      theMovieDbApi.search.getMovie.bind(this, {
        query: encodeURIComponent(title),
      })
    )
    .then((r: any) => {
      const page = JSON.parse(r.body)

      if (page.status_code)
        // rate limiting message - throw so we can try again
        throw `${title} search: ${page.status_message}`
      else if (page.total_results == 0) {
        // no results, return empty object
        return {}
      } else {
        const bestResult = page.results[0]
        const id = bestResult.id

        return throttle
          .add(theMovieDbApi.movies.getById.bind(this, { id }))
          .then((r: any) => {
            const movie = JSON.parse(r.body)

            if (movie.status_code)
              // rate limiting message - throw so we can try again
              throw `${title} ${id} lookup: ${movie.status_message}`

            movieCache.put(title, movie, () => {})
            return movie
          })
          .catch((err: Error) => {
            throw err
          })
      }
    })
    .catch((err: Error) => {
      throw err
    })
}

module.exports = lookupMovie
