import * as React from 'react'
import { MovieInfo } from '../../../server/@types/bcnflix'

const Poster = ({ poster, localPoster, trailerLink }: MovieInfo) => {
  const img = <img src={poster || localPoster} />
  if (trailerLink)
    return (
      <a href={trailerLink} target="_blank" className="image">
        {img}
      </a>
    )
  else return <div className="image">{img}</div>
}

export default Poster
