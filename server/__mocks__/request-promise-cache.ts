import { read } from '../__tests__/_utils/assets'

export default async function request({ url }: { url: string }) {
  if (url.includes('sensacine')) {
    const id = url.substring(url.lastIndexOf('/') + 1)
    return read.sensacine(id)
  } else if (url.includes('metacritic')) {
    const matches = url.match('(.+)browse/(.+?)/(.+)/')
    if (matches && matches.length >= 2) {
      const key: string = matches[2]
      return read.asset(`metacritic/${key}.html`)
    }
  }
  return ''
}
