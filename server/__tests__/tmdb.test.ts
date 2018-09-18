import * as Joda from 'js-joda'

import enhanceWithTmdbInfo from '../src/tmdb'

it('looks up a movie', async () => {
  const movie = await enhanceWithTmdbInfo({ localTitle: 'Campeones' })

  const t = (key: string, value: any) =>
    expect(movie).toEqual(expect.objectContaining({ [key]: value }))

  t('description', expect.stringContaining('A disgraced basketball coach'))
  t('genres', ['Drama', 'Comedy'])
  t('id', 456929)
  t('language', 'es')
  t('localTitle', 'Campeones')
  t('poster', expect.stringContaining('m5z4Ud6Ya5EY3Eg3OBbVBaDKWK.jpg'))
  t('countries', ['Spain'])
  t('releaseDate', Joda.LocalDate.parse('2018-04-06'))
  t('runtime', 124)
  t('languages', ['Español'])
  t('title', 'Champions')
  t('tmdbRating', 7.8)
})

it('handles a movie not found on tmdb', async () => {
  const movie = await enhanceWithTmdbInfo({
    localTitle: 'Un océano entre nosotros (The Mercy)',
  })
  expect(movie).toEqual(undefined)
})
