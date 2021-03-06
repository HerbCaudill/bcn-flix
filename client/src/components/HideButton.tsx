import * as React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const MUTATION_ADD_EXCLUSION = gql`
  mutation AddExclusion($id: Int!) {
    addExclusion(id: $id) @client
  }
`

const HideButton = ({ id }: { id: number | undefined }) => (
  <Mutation mutation={MUTATION_ADD_EXCLUSION} variables={{ id }}>
    {addExclusion => (
      <button
        className="ui primary button button-hide"
        onClick={() => {
          addExclusion()
        }}
        style={{ position: 'absolute', zIndex: 1, top: 0 }}
      >
        <i className="eye slash outline icon" />
        Hide
      </button>
    )}
  </Mutation>
)

export default HideButton
