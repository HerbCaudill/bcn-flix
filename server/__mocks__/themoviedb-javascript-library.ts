import { read } from '../__tests__/_utils/assets'

export default {
  common: {
    api_key: '',
  },
  search: {
    getMovie(
      { query }: { query: string },
      success: (result: any) => void,
      failure: (result: any) => void
    ) {
      const result = read.tmdb.search(query)
      success(result)
    },
  },
  movies: {
    getById(
      { id }: { id: string },
      success: (result: any) => void,
      failure: (result: any) => void
    ) {
      const result = read.tmdb.findById(id)
      success(result)
    },
  },
}
