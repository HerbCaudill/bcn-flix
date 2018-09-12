import * as fs from 'fs-extra'
import * as path from 'path'

export const readModuleFile = (modulePath: string) => {
  const filename = path.join(__dirname, modulePath)
  return fs.readFileSync(filename, 'utf8')
}

export const readAsset = (path: string): string =>
  readModuleFile(`../_assets/${path}`)
