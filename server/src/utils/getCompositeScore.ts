import { MovieInfo } from 'bcnflix'

// Metascore is from 0-100, local rating is from 0-5.
// We might have one or the other or both or neither.
// This returns a score from 0-100 that averages the two, if we have both.
function getCompositeScore(movie: MovieInfo) {
  const scores = []
  // Put all scores on 0-100 scale
  if (movie.metascore) scores.push(movie.metascore) //          originally on 1-100 scale
  if (movie.localRating) scores.push(movie.localRating * 20) // originally on 1-5 scale
  if (movie.tmdbRating) scores.push(movie.tmdbRating * 10) //   originally on 1-10 scale
  if (scores.length > 0) {
    const average = (a: number[]): number =>
      a.reduce((p, c) => p + c, 0) / a.length
    return average(scores)
  } else return undefined
}

export default getCompositeScore

