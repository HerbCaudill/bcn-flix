import { ApolloServer, gql } from 'apollo-server'
import { LocalDate, LocalTime } from 'graphql-joda-types'

import getMovies from './movies'

require('dotenv').config()

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

const resolvers = {
  LocalDate,
  LocalTime,
  Query: {
    movies: async () => {
      const movies = await getMovies()
      return movies
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }: { url: string }) => {
  console.log(`🚀  GraphQL server ready at ${url}`)
})
