import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { withClientState } from 'apollo-link-state'
import { defaults, resolvers } from './graphql/resolvers'
import typeDefs from './graphql/typeDefs'
import { GRAPHQL_SERVER_URL } from './index'

export async function setupApollo() {
  const cache = new InMemoryCache()
  const stateLink = withClientState({
    resolvers,
    typeDefs,
    cache,
    defaults,
  })

  await persistCache({
    cache,
    storage: window.localStorage as any,
  })

  const httpLink = new HttpLink({
    uri: GRAPHQL_SERVER_URL,
  })

  const client = new ApolloClient({
    cache,
    link: ApolloLink.from([stateLink, httpLink]),
  })

  return client
}
