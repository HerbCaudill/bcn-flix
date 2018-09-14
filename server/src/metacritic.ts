import * as cheerio from 'cheerio'
import { Metascores } from '../@types/bcnflix'
import scrape from './scrape'

const urls = [
  'http://www.metacritic.com/browse/movies/release-date/theaters/metascore',
  'http://www.metacritic.com/browse/dvds/release-date/new-releases/metascore',
]

const parseMetascores = (html: string): Metascores => {
  const $ = cheerio.load(html)
  const metascores = {}
  const $movies = $('tr.summary_row')
  $movies.each((i, element) => {
    const movie = $(element)
      .find('div.title a')
      .text()
    const score = +$(element)
      .find('div.metascore_w')
      .text()
    metascores[movie] = score
  })
  return metascores
}

// Gets all ratings for movies in theaters from Metacritic
const getMetascores = async (): Promise<Metascores> => {
  const emptyMetascores: Metascores = {}

  // We'll iterate through the URLs given, sequentially merging each
  // new dictionary of metascores with the previous one
  const metascoreReducer = async (
    metascores: Promise<Metascores>,
    url: string
  ) => {
    const html = await scrape(url)
    const previousMetascores = await metascores
    return Object.assign(previousMetascores, parseMetascores(html))
  }

  return urls.reduce(metascoreReducer, Promise.resolve(emptyMetascores))
}

export default getMetascores
