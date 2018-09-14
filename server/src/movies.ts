import getLocalMovies from '../src/sensacine'
import getMetascores from './metacritic'
import tmdbLookup from './tmdb'
import { Movie } from '../@types/bcnflix'

const getMovies = async (): Promise<Movie[]> => {
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

  return movies
}

export default getMovies
