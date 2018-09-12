jest.mock('request-promise-cache')

import * as Sensacine from '../src/sensacine'
import * as cheerio from 'cheerio'

import { readAsset } from './_utils/assets'

const BALMES = () => readAsset('sensacine/E0808.html')

function CARMEN_Y_LOLA() {
  const $BALMES = cheerio.load(BALMES())
  const firstListing =
    $BALMES('div.hred')
      .first()
      .html() || ''
  return cheerio.load(firstListing)
}

const TEST_THEATERS = [
  { id: 'E0764', name: 'Arenas Multicines' },
  { id: 'E0802', name: 'Boliche Cinemes' },
  { id: 'E0808', name: 'Balmes Multicines' },
]

it('scrapes a movie', () => {
  const $movie = CARMEN_Y_LOLA()
  const movie = Sensacine.parseMovie($movie)
  expect(movie).toEqual({
    localTitle: 'Carmen y Lola',
    localDescription: expect.stringContaining('Carmen y Lola son'),
    localPoster: expect.stringContaining('18/08/29/12/27/5602471.jpg'),
    trailerLink: expect.stringContaining('257121/trailer-19558331/'),
    localRating: 3.4,
  })
})

it('scrapes showtimes', async () => {
  const $movie = CARMEN_Y_LOLA()
  const showtimes = Sensacine.parseTimes($movie)
  expect(showtimes.map(d => d.toString())).toEqual([
    '16:00',
    '18:05',
    '20:10',
    '22:15',
  ])
})

it('scrapes a theater', async () => {
  const moviesAndTimes = Sensacine.parseTheater(BALMES())
  expect(moviesAndTimes.map(d => d.movie.localTitle)).toEqual([
    'Carmen y Lola',
    'Un océano entre nosotros (The Mercy)',
    'Las distancias',
    'Mary y la flor de la bruja',
    'Yucatán',
    'Kings',
    'Rodin',
    'Promesa al amanecer',
    'El viaje de Nisha',
    'The Equalizer 2',
    'El rehén',
    'Misión: Imposible - Fallout',
    'Mamma Mia! Una y otra vez',
    'El mejor verano de mi vida',
    "Ocean's 8",
    'Hereditary',
    'Jurassic World: El reino caído',
    'Campeones',
  ])
})

it('scrapes several theaters', async () => {
  const moviesAndTimes = await Sensacine.getMovies(TEST_THEATERS)
  expect(moviesAndTimes.map(d => d.localTitle)).toEqual([
    'Cuando los ángeles duermen',
    'Yucatán',
    'Los Futbolísimos',
    'El pacto',
    'El mejor verano de mi vida',
    'Campeones',
    'Casi 40',
    'Carmen y Lola',
    'Un océano entre nosotros (The Mercy)',
    'Las distancias',
    'Mary y la flor de la bruja',
    'Kings',
    'Rodin',
    'Promesa al amanecer',
    'El viaje de Nisha',
    'The Equalizer 2',
    'El rehén',
    'Misión: Imposible - Fallout',
    'Mamma Mia! Una y otra vez',
    "Ocean's 8",
    'Hereditary',
    'Jurassic World: El reino caído',
  ])
})
