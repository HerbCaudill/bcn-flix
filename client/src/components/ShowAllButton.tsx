import * as React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const MUTATION_RESET_EXCLUSIONS = gql`
  mutation ResetExclusions($id: Int!) {
    resetExclusions(id: $id) @client
  }
`

const ShowAllButton = () => (
  <Mutation mutation={MUTATION_RESET_EXCLUSIONS}>
    {resetExclusions => (
      <div
        className="ui right aligned button item"
        onClick={() => {
          resetExclusions()
        }}
      >
        <i className="wrench icon" />
        Show all
      </div>
    )}
  </Mutation>
)

export default ShowAllButton
