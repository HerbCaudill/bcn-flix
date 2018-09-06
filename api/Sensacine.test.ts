import * as Sensacine from './Sensacine'

// const THEATER_BALMES:string = require('../assets/balmes.html')
const MOVIE_KINGS = '' //require('../assets/kings.html')

it('scrapes a movie', () => {
  const $movie = cheerio.load(MOVIE_KINGS)
  const movie = Sensacine.scrapeMovie($movie)
  expect(movie.localTitle).toEqual('Kings')
})
