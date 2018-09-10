import * as React from 'react'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
  uri: '/graphql',
  fetch: require('node-fetch')
})

import './App.css'

import logo from './logo.svg'

const Books = () => (
  <Query
    query={gql`
      {
        books {
          title
          author
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error</p>

      return data.books.map(({ title, author }: any) => (
        <div key={title}>
          <p>
            {title} ({author})
          </p>
        </div>
      ))
    }}
  </Query>
)

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.tsx</code> and save to
            reload.
          </p>
          <h2>Books</h2>
          <Books />
        </div>
      </ApolloProvider>
    )
  }
}

export default App
