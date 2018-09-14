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
    title: String
    localTitle: String
    poster: String
    localPoster: String
    description: String
    localDescription: String
    releaseDate: LocalDate
    language: String
    productionCountries: [String]
    spokenLanguages: [String]
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
