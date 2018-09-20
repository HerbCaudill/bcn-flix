import * as React from 'react'

const Toolbar = () => {
  return (
    <div className="ui inverted top fixed menu">
      <div className="right menu">
        <div className="ui right aligned button item">
          <i className="wrench icon" />
          Show all
        </div>
      </div>
    </div>
  )
}

export default Toolbar
