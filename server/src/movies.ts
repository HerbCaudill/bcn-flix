import getLocalMovies from '../src/sensacine'
import getMetascores from './metacritic'
import tmdbLookup from './tmdb'
import { Movie } from '../@types/bcnflix'
import * as path from 'path'

const persistentCache = require('persistent-cache')
const cache = persistentCache({
  duration: 1000 * 60 * 60 * 12, // 12 hours
  base: path.join(__dirname, '../.cache'),
})

const getMovies = async (): Promise<Movie[]> => {
  const cachedMovies = cache.getSync('movies')
  if (cachedMovies) {
    console.log(`cached: movies`)
    return cachedMovies
  }

  const enhance = async (_movie: Movie): Promise<Movie> => {
    // enhance with tmdb info
    const tmdbInfo = await tmdbLookup(_movie.localTitle)
    const movie = Object.assign(_movie, tmdbInfo)
    // enhance with metascore
    if (movie.title) movie.metascore = metascores[movie.title]
    else movie.metascore = metascores[movie.localTitle]
    return movie
  }

  var movies = await getLocalMovies()
  const metascores = await getMetascores()

  movies = await Promise.all(movies.map(enhance))

  console.log(`new: movies`)
  cache.put('movies', movies, () => {})
  return movies
}

export default getMovies
