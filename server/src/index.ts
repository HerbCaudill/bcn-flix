import { ApolloServer } from 'apollo-server'
import resolvers from './resolvers'
import typeDefs from './typeDefs'
import getMovies from './movies'
import * as path from 'path'

require('dotenv').config()

getMovies() // prime the cache

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }: { url: string }) => {
  console.log(`🚀  GraphQL server ready at ${url}`)
})
