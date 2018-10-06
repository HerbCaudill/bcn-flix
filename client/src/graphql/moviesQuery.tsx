import gql from 'graphql-tag'
export default gql`
  query movies {
    exclusions @client
    # timeRange @client
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
