import * as path from 'path'
import { MovieInfo } from '../@types/bcnflix'
import getLocalMovies from '../src/sensacine'
import getMetascores from './metacritic'
import shortenCountry from './utils/shortenCountry'
import enhanceWithTmdbInfo from './tmdb'
import getCompositeScore from './utils/getCompositeScore'
import calculateDisplayTitles from './utils/calculateDisplayTitles'

const persistentCache = require('persistent-cache')
const cache = persistentCache({
  duration: 1000 * 60 * 60 * 12, // 12 hours
  base: path.join(__dirname, '../.cache'),
})

const getMovies = async (): Promise<MovieInfo[]> => {
  const cachedMovies = cache.getSync('movies')
  if (cachedMovies) {
    console.log(`cached: movies`)
    return cachedMovies
  }

  const enhance = async (localInfo: MovieInfo): Promise<MovieInfo> => {
    // enhance with tmdb info
    const tmdbInfo = await enhanceWithTmdbInfo(localInfo)
    const movie = Object.assign(localInfo, tmdbInfo)
    // enhance with metascore
    if (movie.title) movie.metascore = metascores[movie.title]
    else movie.metascore = metascores[movie.localTitle]
    // calculate composite score
    movie.compositeScore = getCompositeScore(movie)
    // sort out titles
    calculateDisplayTitles(movie)
    // shorten country names
    if (movie.countries)
      movie.countries = movie.countries.map(shortenCountry)

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
