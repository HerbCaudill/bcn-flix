import { read } from '../__tests__/_utils/assets'

export default async function request({ url }: { url: string }) {
  if (url.includes('sensacine')) {
    const id = url.substring(url.lastIndexOf('/') + 1)
    return read.sensacine(id)
  } else return ''
}
