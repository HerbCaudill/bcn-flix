import * as React from 'react'
import { Fragment } from 'react'
import { MovieInfo } from '../../../server/@types/bcnflix'
import Poster from './Poster'
import HideButton from './HideButton'

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
      <span key={`${i}`}>{` ${element} `}</span>
    )
  return tail.reduce(concatenator, head)
}

const Movie = (props: MovieInfo) => {
  return (
    <Fragment>
      <HideButton id={props.id} />

      <Poster {...props} />

      <div className="extra content">
        {/* Scores */}
        <div className="right floated">
          {props.tmdbRating ? (
            <div
              className={'ui label ' + scoreColor(props.tmdbRating, 10)}
            >
              <i className="film icon" />
              {props.tmdbRating}
            </div>
          ) : null}
          {props.metascore ? (
            <div
              className={'ui label ' + scoreColor(props.metascore, 100)}
            >
              <i className="thumbs up icon" />
              {props.metascore}
            </div>
          ) : null}
          {props.localRating ? (
            <div
              className={'ui label ' + scoreColor(props.localRating, 5)}
            >
              <i className="star icon" />
              {props.localRating}
            </div>
          ) : null}
        </div>

        {/* Runtime */}
        {props.runtime && (
          <div className="left floated" style={{ marginTop: 4 }}>
            <i className="stopwatch icon" />
            {props.runtime} min
          </div>
        )}
      </div>

      <div className="content">
        {/* Title */}
        <div className="header">{props.title}</div>
        {props.alternateTitle && <h4>({props.alternateTitle})</h4>}

        {/* Meta */}
        <div className="meta">
          {intersperse(
            [
              formatMonthYear((props.releaseDate || '').toString()),
              props.countries && props.countries.join(', '),
              ISO6391.getName(props.language),
            ],
            <i className="bar">{' | '}</i>
          )}
        </div>

        {/* Description */}
        <div className="description">
          <p>
            {props.genres && props.genres.length > 0 ? (
              <strong>{props.genres.join(', ')}</strong>
            ) : null}
          </p>
          <ShowMoreText lines={5}>
            <p>
              {props.language === 'es'
                ? props.localDescription
                : props.description}
            </p>
          </ShowMoreText>
        </div>
        {/* Showtimes */}
        {props.showtimes &&
          props.showtimes.map((listing: any) => (
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
    </Fragment>
  )
}

export default Movie
