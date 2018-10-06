import * as React from 'react';
import {ApolloProvider} from 'react-apollo';
import * as ReactDOM from 'react-dom';
import Movies from './components/Movies';
import './css/styles.css';
import { setupApollo } from './setupApollo';

export const GRAPHQL_SERVER_URL = 'http://localhost:4000'

async function start() {
  const client = await setupApollo()
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Movies />
    </ApolloProvider>,
    document.getElementById('main')
  )
}

start()
