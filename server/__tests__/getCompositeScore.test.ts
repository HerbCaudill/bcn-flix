import getCompositeScore from '../src/utils/getCompositeScore'
import { MovieInfo } from 'bcnflix'

test('all three scores', () => {
  const movie: MovieInfo = {
    localTitle: 'foo',
    metascore: 60, //  out of 100 = 60%
    localRating: 4, // out of 5  =  80%
    tmdbRating: 4, //  out of 10 =  40%
  }
  expect(getCompositeScore(movie)).toEqual(60)
})

test('only metascore', () => {
  const movie: MovieInfo = {
    localTitle: 'foo',
    metascore: 60, //  out of 100 = 60%
  }
  expect(getCompositeScore(movie)).toEqual(60)
})

test('only localRating', () => {
  const movie: MovieInfo = {
    localTitle: 'foo',
    localRating: 4, // out of 5  =  80%
  }
  expect(getCompositeScore(movie)).toEqual(80)
})

test('only tmdbRating', () => {
  const movie: MovieInfo = {
    localTitle: 'foo',
    tmdbRating: 4, //  out of 10 =  40%
  }
  expect(getCompositeScore(movie)).toEqual(40)
})

test('two scores', () => {
  const movie: MovieInfo = {
    localTitle: 'foo',
    metascore: 60, //  out of 100 = 60%
    tmdbRating: 4, //  out of 10 =  40%
  }
  expect(getCompositeScore(movie)).toEqual(50)
})
