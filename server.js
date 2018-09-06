const express = require('express');
const path = require('path');
const { ApolloServer, gql } = require('apollo-server-express');
const PORT = 4000;

const dotenv = require('dotenv');
dotenv.config();

const { URL, GRAPHQL_PORT, GRAPHQL_PATH } = process.env

const typeDefs = gql`

  type Movie {
    id: string
    title: string
    id: string
    title: string
    localTitle: string
    poster: string
    localPoster: string
    description: string
    localDescription: string
    releaseDate: joda.LocalDate
    language: string
    productionCountries: [string]
    spokenLanguages: [string]
    runtime: joda.Duration
    genres: [string]
    trailerLink: string
    localRating: number
    metascore: number
    compositeScore: number
    showtimes: [Showtime]
  }

  type Query {
    movies: [Movie]
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
