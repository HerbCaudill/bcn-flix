import * as React from 'react'
import Movie from './Movie'
import Toolbar from './Toolbar'
import { Query } from 'react-apollo'
import { animated, Transition } from 'react-spring'
import moviesQuery from '../graphql/moviesQuery'
import ErrorMessage from './ErrorMessage'
import LoadingMessage from './LoadingMessage'
import { MovieInfo } from '../../../server/@types/bcnflix'

const descendingByCompositeScore = (a: MovieInfo, b: MovieInfo) =>
  (b.compositeScore || 0) - (a.compositeScore || 0)

const filterExclusions = (exclusions: number[]) => (d: MovieInfo) =>
  d.id && !exclusions.includes(d.id)

const Movies = () => {
  return (
    <Query query={moviesQuery}>
      {({ loading, error, data }) => {
        if (error) return ErrorMessage(error)
        if (loading) return LoadingMessage
        if (!data.movies || data.movies.length == 0)
          return ErrorMessage({ message: 'No movies found' })

        const items = data.movies
          .filter(filterExclusions(data.exclusions))
          .sort(descendingByCompositeScore)

        return (
          <div>
            <Toolbar />
            <div className="ui cards">
              <Transition
                native
                keys={items.map((d: MovieInfo) => d.id)}
                enter={{ opacity: 1 }}
                from={{ opacity: 1 }}
                leave={{ opacity: 0 }}
              >
                {items.map((props: MovieInfo) => (styles: any) => (
                  <animated.div
                    className="ui card"
                    key={props.title}
                    style={styles}
                  >
                    <Movie {...props} />
                  </animated.div>
                ))}
              </Transition>
            </div>
          </div>
        )
      }}
    </Query>
  )
}

export default Movies
