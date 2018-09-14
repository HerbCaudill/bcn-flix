import getMovies from './movies'
import { LocalDate, LocalTime } from 'graphql-joda-types'

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

export default resolvers
