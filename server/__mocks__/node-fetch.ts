import { read } from '../__tests__/_utils/assets'
import { URL } from 'url'

const mockJson = (result: any): any => ({
  json: () => result,
})

const mockText = (result: any): any => ({
  text: () => result,
})

export default async function fetch(urlString: string) {
  const url = new URL(urlString)
  const path = url.pathname.split('/')
  switch (url.host) {
    // sensacine
    case 'www.sensacine.com':
      const id = path[3] // e.g. /cines/cine/__
      return mockText(read.sensacine(id))

    // tmdb
    case 'api.themoviedb.org':
      switch (path[2]) {
        case 'search':
          const query = url.searchParams.get('query') || ''
          return mockJson(read.tmdb.search(query))

        case 'movie':
          const id = path[3] // e.g. /3/movie/__
          return mockJson(read.tmdb.findById(id))
      }

    // metacritic
    case 'www.metacritic.com':
      const key = path[2] // e.g. /browse/__/release-date/theaters/metascore
      return mockText(read.asset(`metacritic/${key}.html`))

    default:
      throw 'No mock response configured for ${url.host}'
  }
}
