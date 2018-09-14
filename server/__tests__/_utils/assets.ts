import * as fs from 'fs-extra'
import * as path from 'path'

// Sanitize windows filename
const sanitize = (s: string): string =>
  s.replace('^\\.+', '').replace('[\\\\/:*?"<>|]', '')

export const readModuleFile = (modulePath: string) => {
  const filename = path.join(__dirname, modulePath)
  return fs.readFileSync(filename, 'utf8')
}

export const read = {
  asset(path: string): string {
    return readModuleFile(`../_assets/${path}`)
  },

  sensacine(id: string): string {
    return read.asset(`sensacine/${id}.html`)
  },

  tmdb: {
    search(query: string): any {
      const safeQuery = sanitize(query)
      return read.asset(`tmdb/search/${safeQuery}.json`)
    },
    findById(id: string): any {
      return read.asset(`tmdb/movie/${id}.json`)
    },
  },
}
