import sanitize from '../src/utils/sanitize'

it('removes forward slashes', () => {
  const filename = 'foo/pizza'
  expect(sanitize(filename)).toEqual('foopizza')
})

it('removes backslashes', () => {
  const filename = 'foo\\pizza'
  expect(sanitize(filename)).toEqual('foopizza')
})

it('removes colons', () => {
  const filename = 'foo:pizza'
  expect(sanitize(filename)).toEqual('foopizza')
})
