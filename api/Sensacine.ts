// Scrapes Sensacine for showtimes, one theater at a time

import * as cheerio from 'cheerio'
import * as request from 'request-promise-cache'
import * as Joda from 'js-joda'

const CACHE_DURATION = 60 * 60 * 1000

type MovieAndTimes = {
  movie: Movie
  times: Joda.LocalTime[]
}

const theaters: Theater[] = [
  { id: 'E0091', name: 'Aribau Multicines' },
  { id: 'E0092', name: 'Aribau Club' },
  { id: 'E0136', name: 'Bosque Multicines' },
  { id: 'E0381', name: 'Cinesa Diagonal' },
  { id: 'E0426', name: 'Cinema Comedia' },
  { id: 'E0447', name: 'Gran Sarrià Multicines' },
  { id: 'E0480', name: 'Méliès Cinemes' },
  { id: 'E0544', name: 'Sala Phenomena Experience' },
  { id: 'E0557', name: 'Palau Balaña Multicines' },
  { id: 'E0581', name: 'Renoir Floridablanca' },
  { id: 'E0608', name: 'Cines Verdi Barcelona' },
  { id: 'E0613', name: 'Yelmo Cines Icaria' },
  { id: 'E0682', name: 'Maldà Arts Forum' },
  { id: 'E0747', name: 'Cinemes Girona' },
  { id: 'E0764', name: 'Arenas Multicines' },
  { id: 'E0802', name: 'Boliche Cinemes' },
  { id: 'E0808', name: 'Balmes Multicines' },
  { id: 'E0850', name: 'Zumzeig Cinema' },
  { id: 'E0873', name: 'Cinemes Texas' },
]
const baseUrl = 'http://www.sensacine.com/cines/cine'

async function getTheaterPage(theater: Theater): Promise<string> {
  const resp: any = await request({
    url: `${baseUrl}/${theater.id}`,
    cacheKey: theater.id,
    cacheTTL: CACHE_DURATION,
    limit: 0,
  })
  // TODO: Handle errors
  return resp.body
}

export const scrapeMovie = ($: CheerioStatic): Movie => {
  const movie: Movie = {
    localTitle: $('span.meta-title a')
      .text()
      .trim(),
    localPoster: $('img.thumbnail-img')
      .attr('data-src')
      .replace('http:', 'https:'),
    localDescription: $('div.synopsis')
      .text()
      .trim(),
    trailerLink: `http://www.sensacine.com/${$(
      'a.thumbnail-container'
    ).attr('href')}`,
    localRating: +$('div.rating-item:contains("Medios")')
      .find('span.stareval-note')
      .text()
      .trim()
      .replace(',', '.'),
  }
  return movie
}

export const scrapeTimes = ($: CheerioStatic): Joda.LocalTime[] => {
  const TODAY = 1
  const times: Joda.LocalTime[] = []
  const $times = $('div.js-showtimes-pane')
    .eq(TODAY)
    .find('div.showtimes-format:contains("Versión Original")')
    .find('span.hours-item-value')

  $times.each((i: number, t: CheerioElement) => {
    const time = Joda.LocalTime.parse($(t).text())
    times.push(time)
  })
  return times
}

export const scrapeMoviesAndTimes = (
  theaterHtml: string
): MovieAndTimes[] => {
  const moviesAndTimes: MovieAndTimes[] = []
  const $ = cheerio.load(theaterHtml)

  const $movies = $('div.hred')
  $movies.each((i: number, element: CheerioElement) => {
    const html = $(element).html()
    if (html) {
      const $movie = cheerio.load(html)
      const times = scrapeTimes($movie)
      if (times.length) {
        const movie = scrapeMovie($movie)
        moviesAndTimes.push({ movie, times })
      }
    }
  })
  return moviesAndTimes
}

export const getMovies = async (): Promise<Movie[]> => {
  const movieLookup: Map<string, Movie> = new Map()

  for (const theater of theaters) {
    const theaterPage = await getTheaterPage(theater)
    const theaterMovies = scrapeMoviesAndTimes(theaterPage)

    for (const scrapedMovieAndTimes of theaterMovies) {
      const key = scrapedMovieAndTimes.movie.localTitle
      const newMovieEntry = Object.assign(
        { showtimes: [] },
        movieLookup.get(key),
        scrapedMovieAndTimes.movie
      )
      const newShowtimesEntry = {
        theater,
        times: scrapedMovieAndTimes.times,
      }
      newMovieEntry.showtimes.push(newShowtimesEntry)
      movieLookup.set(key, newMovieEntry)
    }
  }
  return Array.from(movieLookup.values())
}
