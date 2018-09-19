import * as Joda from 'js-joda'

import getTmdbInfo from '../src/tmdb'

it('looks up a movie', async () => {
  const movie = await getTmdbInfo('Campeones')

  const t = (key: string, value: any) =>
    expect(movie).toEqual(expect.objectContaining({ [key]: value }))

  t('overview', expect.stringContaining('A disgraced basketball coach'))
  t('genres', [{ id: 18, name: 'Drama' }, { id: 35, name: 'Comedy' }])
  t('id', 456929)
  t('original_language', 'es')
  t('poster_path', expect.stringContaining('Y3Eg3OBbVBaDKWK.jpg'))
  t('production_countries', [{ iso_3166_1: 'ES', name: 'Spain' }])
  t('release_date', '2018-04-06')
  t('runtime', 124)
  t('spoken_languages', [{ iso_639_1: 'es', name: 'Español' }])
  t('title', 'Champions')
  t('vote_average', 7.8)
})

it('handles a movie not found on tmdb', async () => {
  const movie = await getTmdbInfo('Un océano entre nosotros (The Mercy)')
  expect(movie).toEqual(undefined)
})
