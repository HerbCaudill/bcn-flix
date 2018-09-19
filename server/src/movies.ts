import * as path from 'path'
import { MovieInfo } from '../@types/bcnflix'
import getLocalMovies from '../src/sensacine'
import getMetascores from './metacritic'
import shortenCountry from './utils/shortenCountry'
import getTmdbInfo from './tmdb'
import getCompositeScore from './utils/getCompositeScore'
import calculateDisplayTitles from './utils/calculateDisplayTitles'
import * as Joda from 'js-joda'

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
  var movies = await getLocalMovies()
  const metascores = await getMetascores()

  const enhance = async (localInfo: MovieInfo): Promise<MovieInfo> => {
    // enhance with tmdb info
    const tmdbInfo = await getTmdbInfo(localInfo.localTitle)
    var movie = Object.assign({}, localInfo)
    if (tmdbInfo) {
      movie = Object.assign(movie, {
        id: tmdbInfo.id,
        title: tmdbInfo.title,
        originalTitle: tmdbInfo.original_title,
        poster:
          tmdbInfo.poster_path &&
          `https://image.tmdb.org/t/p/w1280${tmdbInfo.poster_path}`,
        description: tmdbInfo.overview,
        releaseDate: tmdbInfo.release_date
          ? Joda.LocalDate.parse(tmdbInfo.release_date)
          : undefined,
        language: tmdbInfo.original_language,
        countries:
          tmdbInfo.production_countries &&
          tmdbInfo.production_countries.map((d: any) => d.name),
        languages:
          tmdbInfo.spoken_languages &&
          tmdbInfo.spoken_languages.map((d: any) => d.name),
        runtime: tmdbInfo.runtime,
        genres: tmdbInfo.genres && tmdbInfo.genres.map((d: any) => d.name),
        tmdbRating: tmdbInfo.vote_average,
      })
    }

    // enhance with metascore
    movie.metascore =
      metascores[movie.title || movie.originalTitle || movie.localTitle]
    // calculate composite score
    movie.compositeScore = getCompositeScore(movie)
    // sort out titles
    calculateDisplayTitles(movie)
    // shorten country names
    if (movie.countries)
      movie.countries = movie.countries.map(shortenCountry)

    return movie
  }

  movies = await Promise.all(movies.map(enhance))

  console.log(`new: movies`)
  cache.put('movies', movies, () => {})
  return movies
}

export default getMovies
