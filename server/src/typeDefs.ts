import { gql } from 'apollo-server'

const typeDefs = gql`
  scalar LocalDate
  scalar LocalTime

  type Theater {
    id: String
    name: String
  }

  type Showtimes {
    theater: Theater
    times: [LocalTime]
  }

  type Movie {
    id: Int
    title: String
    alternateTitle: String
    poster: String
    localPoster: String
    description: String
    localDescription: String
    releaseDate: LocalDate
    language: String
    countries: [String]
    languages: [String]
    runtime: Int
    genres: [String]
    trailerLink: String
    localRating: Float
    tmdbRating: Float
    metascore: Int
    compositeScore: Float
    showtimes: [Showtimes]
  }

  type Query {
    movies: [Movie]
  }
`

export default typeDefs
