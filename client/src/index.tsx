import ApolloClient from 'apollo-boost'
import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import * as ReactDOM from 'react-dom'
import Index from './components/Index'
import './css/styles.css'
import { defaults, resolvers } from './graphql/resolvers'
import typeDefs from './graphql/typeDefs'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  clientState: { defaults, resolvers, typeDefs },
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Index />
  </ApolloProvider>,
  document.getElementById('main')
)
