import { readAsset } from '../__tests__/_utils/assets'

export default async function request({ url }: { url: string }) {
  const id = url.substring(url.lastIndexOf('/') + 1)
  return readAsset(`sensacine/${id}.html`)
}
