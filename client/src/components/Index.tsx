import * as React from 'react'
import Movie from './Movie'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { MovieInfo } from '../../../server/@types/bcnflix'

const Index = () => {
  return (
    <Query
      query={gql`
        {
          movies {
            title
            alternateTitle
            poster
            localPoster
            description
            localDescription
            releaseDate
            language
            countries
            languages
            runtime
            genres
            trailerLink
            localRating
            tmdbRating
            metascore
            compositeScore
            showtimes {
              theater {
                id
                name
              }
              times
            }
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>
        if (error)
          return (
            <div className="ui message">
              <div className="header">GraphQL error</div>
              <pre>{error.message}</pre>
              <p>
                {error.message == 'Network error: Failed to fetch' &&
                  'Is the API server running?'}
              </p>
            </div>
          )
        // Sort by composite score, descending
        data.movies.sort(
          (a: MovieInfo, b: MovieInfo) =>
            (b.compositeScore || 0) - (a.compositeScore || 0)
        )
        return (
          <div className="ui cards">
            {data.movies.map((d: MovieInfo) => (
              <Movie info={d} key={d.title} />
            ))}
          </div>
        )
      }}
    </Query>
  )
}

export default Index
