import * as Joda from 'js-joda'

import tmdbLookup from '../src/tmdb'

it('looks up a movie', async () => {
  const movie = await tmdbLookup('Campeones')

  const t = (key: string, value: any) =>
    expect(movie).toEqual(expect.objectContaining({ [key]: value }))

  t('description', expect.stringContaining('A disgraced basketball coach'))
  t('genres', ['Drama', 'Comedy'])
  t('id', 456929)
  t('language', 'es')
  t('localTitle', 'Campeones')
  t('poster', expect.stringContaining('m5z4Ud6Ya5EY3Eg3OBbVBaDKWK.jpg'))
  t('productionCountries', [{ iso_3166_1: 'ES', name: 'Spain' }])
  t('releaseDate', Joda.LocalDate.parse('2018-04-06'))
  t('runtime', 124)
  t('spokenLanguages', [{ iso_639_1: 'es', name: 'Español' }])
  t('title', 'Champions')
  t('tmdbRating', 7.8)
})

it('handles a movie not found on tmdb', async () => {
  const movie = await tmdbLookup('Un océano entre nosotros (The Mercy)')
  expect(movie).toEqual(undefined)
})
