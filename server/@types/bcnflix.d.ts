import * as Joda from 'js-joda'

declare namespace bcnflix {
  type Movie = {
    id?: string
    localTitle: string
    title?: string
    poster?: string
    localPoster?: string
    description?: string
    localDescription?: string
    releaseDate?: Joda.LocalDate
    language?: string
    productionCountries?: string[]
    spokenLanguages?: string[]
    runtime?: Joda.Duration
    genres?: string[]
    trailerLink?: string
    localRating?: number
    tmdbRating?: number
    metascore?: number
    compositeScore?: number
    showtimes?: Showtimes[]
  }

  type Theater = {
    id?: string
    name?: string
  }

  type Showtimes = {
    theater?: Theater
    times?: Joda.LocalTime[]
  }
}

export = bcnflix
