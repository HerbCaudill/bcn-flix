import * as React from 'react'
import { MovieInfo } from '../../../server/@types/bcnflix'

const Poster = ({ info }: { info: MovieInfo }) => {
  const img = <img src={info.poster || info.localPoster} />
  if (info.trailerLink)
    return (
      <a href={info.trailerLink} target="_blank" className="image">
        {img}
      </a>
    )
  else return <div className="image">{img}</div>
}

export default Poster
