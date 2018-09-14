type Callback = (err: Error) => void

function cache(options: any) {
  return {
    put(key: string, value: any, cb: Callback): void {
      // ignore
    },
    getSync(key: string): any {
      // nothing is ever cached
      return undefined
    },
  }
}

module.exports = cache
