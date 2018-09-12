const fs = require('fs')
export default async function request({ url }: { url: string }) {
  const lastSlash = url.lastIndexOf('/')
  const id = url.substring(lastSlash + 1)
  const filename = require.resolve(
    `../__tests__/_assets/sensacine/${id}.html`
  )
  return fs.readFileSync(filename, 'utf8')
}
