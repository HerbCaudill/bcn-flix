import * as React from 'react'
import { MovieInfo } from '../../../server/@types/bcnflix'
import Poster from './Poster'

const ShowMoreText = require('react-show-more-text')

const ISO6391 = require('iso-639-1').default

const formatMonthYear = (dateString: string): string | undefined => {
  if (dateString) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date)
  } else return undefined
}

const scoreColor = (score: number, basis: number) => {
  const percentScore = (score * 100) / basis
  if (percentScore >= 60) return 'green'
  else if (percentScore >= 40) return 'yellow'
  else return 'red'
}

function intersperse(elements: any[], separator: any): any[] {
  elements = elements.filter(d => d)
  if (elements.length < 2) {
    return elements
  }
  const head: any[] = elements.slice(0, 1) // first element
  const tail: any[] = elements.slice(1) // all remaining elements
  const concatenator = (result: any[], element: any, i: number): any[] =>
    result.concat(
      <span key={`separator_${i}`}>{separator}</span>,
      <span key={`${i}`}>{element}</span>
    )
  return tail.reduce(concatenator, head)
}

const hideMovie = (e: any, id: string) => null

const Movie = ({ info }: { info: MovieInfo }) => {
  return (
    <div className="card" key={info.title}>
      {/* Hide button */}
      <button
        className="ui primary button button-hide"
        onClick={e => hideMovie(e, info.id || '')}
        style={{ position: 'absolute', zIndex: 1, top: 0 }}
      >
        <i className="eye slash outline icon" />
        Hide
      </button>

      {/* Poster */}

      <Poster info={info} />


      <div className="content">
        {/* Title */}
        <div className="header">{info.title}</div>
        {info.alternateTitle && <h4>({info.alternateTitle})</h4>}

        {/* Meta */}
        <div className="meta">
          {intersperse(
            [
              formatMonthYear((info.releaseDate || '').toString()),
              info.countries && info.countries.join(', '),
              ISO6391.getName(info.language),
            ],
            <i className="bar">|</i>
          )}
        </div>

        {/* Description */}
        <div className="description">
          <p>
            {info.genres &&
              info.genres.length && (
                <strong>{info.genres.join(', ')}</strong>
              )}
          </p>
          <ShowMoreText lines={5}>
            <p>
              {info.language === 'es'
                ? info.localDescription
                : info.description}
            </p>
          </ShowMoreText>
        </div>
        {/* Showtimes */}
        {info.showtimes &&
          info.showtimes.map((listing: any) => (
            <div key={listing.theater.id}>
              <div className="ui divider" />
              <p className="ui sub header">{listing.theater.name}</p>
              <div>
                {listing.times &&
                  listing.times.map((time: string) => (
                    <div key={time} className="ui label teal">
                      {time}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
      <div className="extra content">
        {/* Scores */}
        <span className="right floated">
          {info.metascore && (
            <div className={'ui label ' + scoreColor(info.tmdbRating, 10)}>
              <i className="film icon" />
              {info.tmdbRating}
            </div>
          )}

          {info.metascore && (
            <div className={'ui label ' + scoreColor(info.metascore, 100)}>
              <i className="thumbs up icon" />
              {info.metascore}
            </div>
          )}
          {info.localRating && (
            <div className={'ui label ' + scoreColor(info.localRating, 5)}>
              <i className="star icon" />
              {info.localRating}
            </div>
          )}
        </span>

        {/* Runtime */}
        {info.runtime && (
          <span>
            <i className="stopwatch icon" />
            {info.runtime} min
          </span>
        )}
      </div>
    </div>
  )
}

export default Movie
