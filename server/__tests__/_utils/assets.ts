import * as fs from 'fs-extra'
import * as path from 'path'

import sanitize from '../../src/utils/sanitize'

export const readModuleFile = (modulePath: string) => {
  const filename = path.join(__dirname, modulePath)
  if (fs.existsSync(filename)) {
    return fs.readFileSync(filename, 'utf8')
  } else return ''
}

export const read = {
  asset(path: string): any {
    var result: string | object = readModuleFile(`../_assets/${path}`)
    if (path.endsWith('json'))
      if (result.length) result = JSON.parse(result)
      else result = {}
    return result
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
