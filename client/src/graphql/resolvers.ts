import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

type Exclusions = number[]

// type TimeRange = {
//   start?: string
//   end?: string
// }

type State = {
  exclusions: Exclusions
  // timeRange: TimeRange
}

export const defaults: State = {
  exclusions: [],
  // timeRange: {
  //   start: '',
  //   end: '',
  // },
}

const getState = (cache: InMemoryCache): State => {
  const query = gql`
    {
      exclusions @client
      # timeRange @client
    }
  `
  return cache.readQuery({ query }) || defaults
}

export const resolvers = {
  Mutation: {
    addExclusion: (
      _: null,
      { id }: { id: number },
      { cache }: { cache: InMemoryCache }
    ): number => {
      const prevState = getState(cache).exclusions
      const newState = prevState.concat([id])
      cache.writeData({
        data: { exclusions: newState },
      })
      return id
    },
    resetExclusions: (
      _: null,
      args: null,
      { cache }: { cache: InMemoryCache }
    ): Exclusions => {
      const prevState: Exclusions = getState(cache).exclusions
      const newState: Exclusions = defaults.exclusions
      cache.writeData({ data: { exclusions: newState } })
      return prevState
    },
  },
}
