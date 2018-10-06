import * as React from 'react'
import ShowAllButton from './ShowAllButton'

const Toolbar = () => {
  return (
    <div className="ui inverted top fixed menu">
      <div className="right menu">
        <ShowAllButton />
      </div>
    </div>
  )
}

export default Toolbar
