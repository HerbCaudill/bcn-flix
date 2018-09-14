import getMetascores from '../src/metacritic'

it('gets metascores', async () => {
  const metascores = await getMetascores()
  expect(Object.keys(metascores).length).toEqual(237)
  expect(metascores['Incredibles 2']).toEqual(80)
  expect(metascores['Solo: A Star Wars Story']).toEqual(62)
  expect(metascores['Slender Man']).toEqual(30)
})
