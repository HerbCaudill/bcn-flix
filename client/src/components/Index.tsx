import * as React from 'react'
import Movie from './Movie'
import Toolbar from './Toolbar'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { MovieInfo } from '../../../server/@types/bcnflix'
import { Transition } from 'react-spring'

const MOVIES_QUERY = gql`
  query movies {
    exclusions @client
    movies {
      id
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
`
const LOADING_MESSAGE = <p>Loading...</p>

const errorMessage = ({ message }: { message: string }) => (
  <div className="ui message">
    <div className="header">GraphQL error</div>
    <pre>{message}</pre>
    <p>
      {message == 'Network error: Failed to fetch' &&
        'Is the API server running?'}
    </p>
  </div>
)

const descendingByCompositeScore = (a: MovieInfo, b: MovieInfo) =>
  (b.compositeScore || 0) - (a.compositeScore || 0)

const Index = () => {
  return (
    <Query query={MOVIES_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return LOADING_MESSAGE
        if (error) return errorMessage(error)
        if (!data.movies || data.movies.length == 0)
          return errorMessage({ message: 'No movies found' })

        // sort
        data.movies.sort(descendingByCompositeScore)

        // filter
        const filteredMovies = data.movies.filter(
          (d: MovieInfo) => !data.exclusions.includes(d.id)
        )

        // render
        return (
          <div>
            <Toolbar />
            <div className="ui cards">
              <Transition
                keys={filteredMovies.map((d: MovieInfo) => d.id)}
                from={{ opacity: 1 }}
                leave={{ opacity: 0 }}
              >
                {filteredMovies.map((d: MovieInfo) => (styles: any) => (
                  <Movie info={d} styles={styles} />
                ))}
              </Transition>
            </div>
          </div>
        )
      }}
    </Query>
  )
}

export default Index
