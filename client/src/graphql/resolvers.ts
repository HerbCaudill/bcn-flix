import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

export const defaults = {
  exclusions: [],
  // timeRange: {
  //   start: '',
  //   end: '',
  // },
}

const getExclusions = (cache: InMemoryCache): number[] => {
  const query = gql`
    {
      exclusions @client
    }
  `
  const results: { exclusions: number[] } = cache.readQuery({ query })
  return results.exclusions
}

export const resolvers = {
  Mutation: {
    addExclusion: (
      _: null,
      { id }: { id: number },
      { cache }: { cache: InMemoryCache }
    ): number => {
      const prevState = getExclusions(cache)
      const newState = prevState.concat([id])
      cache.writeData({
        data: { exclusions: newState },
      })
      console.log('excluded', id, cache)
      return id
    },
    // resetExclusions: (
    //   _: null,
    //   args: null,
    //   { cache }: { cache: InMemoryCache }
    // ): number[] => {
    //   const prevState: number[] = getExclusions(cache)
    //   const newState: number[] = defaults.exclusions
    //   cache.writeData({ data: { exclusions: newState } })
    //   console.log('reset exclusions')
    //   return prevState
    // },
  },
}
