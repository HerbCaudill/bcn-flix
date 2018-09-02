const express = require('express');
const path = require('path');
const { ApolloServer, gql } = require('apollo-server-express');
const PORT = 4000;

const dotenv = require('dotenv');
dotenv.config();

const { URL, GRAPHQL_PORT, GRAPHQL_PATH } = process.env


const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const typeDefs = gql`

  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

const app = express()

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });


app.listen({port: GRAPHQL_PORT}, () => {
  console.log(`🚀  GraphQL server ready at ${URL}${GRAPHQL_PORT ? `:${GRAPHQL_PORT}` : ''}${GRAPHQL_PATH}`)
});
