// Scrapes Sensacine for showtimes, one theater at a time

import * as cheerio from 'cheerio'
import * as Joda from 'js-joda'
import { Movie, Theater } from '../@types/bcnflix'

import request from 'request-promise-cache'
const CACHE_DURATION = 60 * 60 * 1000

const ALL_THEATERS: Theater[] = [
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

type response = { err?: Error; data?: any }

export const withErrorHandling = (promise: Promise<any>) =>
  promise
    .then((data: any): response => ({ data }))
    .catch((err: Error): response => ({ err }))

export const scrapeTheater = async (theater: Theater): Promise<string> => {
  const resp = request({
    url: `${baseUrl}/${theater.id}`,
    cacheKey: theater.id,
    cacheTTL: CACHE_DURATION,
    limit: 0,
  })
  const { err, data } = await withErrorHandling(resp)
  if (err) {
    console.log(err)
    return ''
  }
  return data
}

export const parseMovie = ($: CheerioStatic): Movie => {
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

export const parseTimes = ($: CheerioStatic): Joda.LocalTime[] => {
  function isSpanishSpeakingCountry(country: string): boolean {
    const SPANISH_SPEAKING = ['Espa&#xF1;a', 'España']
    return SPANISH_SPEAKING.indexOf(country) !== -1
  }

  const TODAY = 1
  const times: Joda.LocalTime[] = []

  const nationality: string = $('span.nationality')
    .text()
    .trim()
  const format = isSpanishSpeakingCountry(nationality)
    ? 'Versión Española'
    : 'Versión Original'
  const $times = $('div.js-showtimes-pane')
    .eq(TODAY)
    .find(`div.showtimes-format:contains("${format}")`)
    .find('span.hours-item-value')

  $times.each((i: number, t: CheerioElement) => {
    const time = Joda.LocalTime.parse($(t).text())
    times.push(time)
  })

  return times
}

export const parseMoviesAndTimes = (theaterHtml: string) => {
  const result: {
    movie: Movie
    times: Joda.LocalTime[]
  }[] = []
  const $ = cheerio.load(theaterHtml)

  const $movies = $('div.hred')
  $movies.each((i: number, element: CheerioElement) => {
    const html = $(element).html()
    if (html) {
      const $movie = cheerio.load(html)
      const times = parseTimes($movie)
      if (times.length) {
        const movie = parseMovie($movie)
        result.push({ movie, times })
      }
    }
  })
  return result
}

export const scrapeTheaters = async (theaters: Theater[]) => {
  const result: {
    theater: Theater
    page: string
  }[] = []
  for (const theater of theaters) {
    const page = await scrapeTheater(theater)
    result.push({ theater, page })
  }
  return result
}

export const getMovies = async (
  theaters = ALL_THEATERS
): Promise<Movie[]> => {
  const movieLookup: Map<string, Movie> = new Map()
  const theaterPages = await scrapeTheaters(theaters)
  for (const { page, theater } of theaterPages) {
    const theaterMovies = parseMoviesAndTimes(page)

    for (const { movie, times } of theaterMovies) {
      const key = movie.localTitle
      const newMovieEntry = Object.assign(
        { showtimes: [] },
        movieLookup.get(key),
        movie
      )
      const newShowtimesEntry = {
        theater,
        times: times,
      }
      newMovieEntry.showtimes.push(newShowtimesEntry)
      movieLookup.set(key, newMovieEntry)
    }
  }
  return Array.from(movieLookup.values())
}
