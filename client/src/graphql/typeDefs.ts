import gql from 'graphql-tag'

export default gql`
  type TimeRange {
    start: String
    end: String
  }

  input AddExclusionInput {
    id: Int!
  }

  type Mutation {
    addExclusion(input: AddExclusionInput!): Int
    resetExclusions: [Int]
  }

  type Query {
    exclusions: [Int]
    # timeRange: TimeRange
  }
`
