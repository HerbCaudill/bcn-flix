import * as Joda from 'js-joda'

declare namespace bcnflix {
  type MovieInfo = {
    id?: string

    localTitle: string // sensacine (often in Spanish)
    title?: string // tmdb title (generally in English)
    originalTitle?: string // tmdb title in original language
    alternateTitle?: string // we calculate this based on all of the above

    poster?: string
    localPoster?: string
    description?: string
    localDescription?: string
    releaseDate?: Joda.LocalDate
    language?: string
    countries?: string[]
    languages?: string[]
    runtime?: number
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

  type Metascores = {
    [title: string]: number
  }
}

export = bcnflix
