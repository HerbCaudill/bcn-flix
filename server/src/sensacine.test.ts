import * as Sensacine from './Sensacine'
import * as cheerio from 'cheerio'
import * as fs from 'fs-extra'

function readModuleFile(path: string) {
  const filename = require.resolve(path)
  return fs.readFile(filename, 'utf8')
}

it('scrapes a movie', async () => {
  const MOVIE_KINGS = await readModuleFile('../assets/kings.html')
  const $movie = cheerio.load(MOVIE_KINGS)
  const movie = Sensacine.scrapeMovie($movie)
  expect(movie).toEqual({
    localTitle: 'Kings',
    localPoster:
      'https://es.web.img2.acsta.net/c_160_213/pictures/18/07/31/15/42/3049867.jpg',
    localDescription:
      '1992. En Los Ángeles se producen fuertes disturbios a raíz de la absolución de varios policías implicados en la paliza al taxista negro Rodney King. En medio de ese caos vive una madre divorciada (Halle Berry) de familia afroamericana, que intentará encontrar y proteger a sus hijos en una ciudad en la que reinan los conflictos y la violencia. Para ello,...',
    trailerLink:
      'http://www.sensacine.com//peliculas/pelicula-247864/trailer-19558287/',
    localRating: 2,
  })
})

it('scrapes showtimes', async () => {
  const MOVIE_KINGS = await readModuleFile('../assets/kings.html')
  const $movie = cheerio.load(MOVIE_KINGS)
  const showtimes = Sensacine.scrapeTimes($movie)
  expect(showtimes.map(d => d.toString())).toEqual([
    '16:00',
    '16:10',
    '18:10',
    '20:00',
    '20:10',
    '22:00',
  ])
})

it('scrapes a theater', async () => {
  const THEATER_BALMES = await readModuleFile('../assets/balmes.html')
  const moviesAndTimes = Sensacine.scrapeMoviesAndTimes(THEATER_BALMES)
  expect(moviesAndTimes.map(d => d.movie.localTitle)).toEqual([
    'Kings',
    '¿Quién está matando a los moñecos?',
    'Rodin',
    'Promesa al amanecer',
    'El viaje de Nisha',
    'The Equalizer 2',
    'Mentes poderosas',
    'Buenos vecinos',
    'El rehén',
    'Misión: Imposible - Fallout',
    'Mamma Mia! Una y otra vez',
    "Ocean's 8",
    'Hereditary',
    'Jurassic World: El reino caído',
  ])
})
