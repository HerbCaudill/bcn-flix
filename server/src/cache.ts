import path from 'path'

const persistentCache = require('persistent-cache')
const TWELVE_HOURS = 1000 * 60 * 60 * 12

export const getCache = (
  name: string,
  duration: number = TWELVE_HOURS
) => {
  const base = path.join(__dirname, '../.cache')
  return persistentCache({ duration, base, name })
}

interface Cache {
  get: (key: string) => any
  set: (key: string) => void
}

interface CacheOptions {
  name: string
  duration: number
}

class FileCache implements Cache {
  cache: any = null
  constructor(options) {
    this.cache = persistentCache({
      duration: options.duration || TWELVE_HOURS,
      base: path.join(__dirname, '../.cache'),
      name: options.name,
    })
  }
  get = async key => this.cache.get(key)
  set = async key => this.cache.set(key)
}
