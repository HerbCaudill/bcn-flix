declare module 'themoviedb-javascript-library' {
  export const account: {
    addFavorite: any
    addToWatchlist: any
    getFavoritesMovies: any
    getFavoritesTvShows: any
    getInformation: any
    getLists: any
    getMovieWatchlist: any
    getRatedMovies: any
    getRatedTvEpisodes: any
    getRatedTvShows: any
    getTvShowsWatchlist: any
  }
  export const authentication: {
    askPermissions: any
    generateGuestSession: any
    generateSession: any
    generateToken: any
    validateUser: any
  }
  export const certifications: {
    getMovieList: any
    getTvList: any
  }
  export const changes: {
    getMovieChanges: any
    getPersonChanges: any
    getTvChanges: any
  }
  export const collections: {
    getDetails: any
    getImages: any
    getTranslations: any
  }
  export const common: {
    api_key: string
    base_uri: string
    client: any
    generateQuery: any
    getImage: any
    images_uri: string
    language: string
    timeout: number
    validateCallbacks: any
    validateRequired: any
  }
  export const companies: {
    getAlternativeNames: any
    getDetails: any
  }
  export const configurations: {
    getConfiguration: any
    getCountries: any
    getJobs: any
    getLanguages: any
    getPrimaryTranslations: any
    getTimezones: any
  }
  export const credits: {
    getDetails: any
  }
  export const discover: {
    getMovies: any
    getTvShows: any
  }
  export const find: {
    getById: any
  }
  export const genres: {
    getMovieList: any
    getMovies: any
    getTvList: any
  }
  export const guestSession: {
    getRatedMovies: any
    getRatedTvEpisodes: any
    getRatedTvShows: any
  }
  export const keywords: {
    getById: any
    getMovies: any
  }
  export const lists: {
    addItem: any
    addList: any
    clearList: any
    getById: any
    getStatusById: any
    removeItem: any
    removeList: any
  }
  export const movies: {
    getAccountStates: any
    getAccountStatesGuest: any
    getAlternativeTitles: any
    getById: any
    getChanges: any
    getCredits: any
    getExternalIds: any
    getImages: any
    getKeywords: any
    getLatest: any
    getLists: any
    getNowPlaying: any
    getPopular: any
    getRecommendations: any
    getReleases: any
    getReviews: any
    getSimilarMovies: any
    getTopRated: any
    getTranslations: any
    getUpcoming: any
    getVideos: any
    rate: any
    rateGuest: any
    removeRate: any
    removeRateGuest: any
  }
  export const networks: {
    getAlternativeNames: any
    getById: any
  }
  export const people: {
    getById: any
    getChanges: any
    getCredits: any
    getExternalIds: any
    getImages: any
    getLatest: any
    getMovieCredits: any
    getPopular: any
    getTaggedImages: any
    getTvCredits: any
  }
  export const reviews: {
    getById: any
  }
  export const search: {
    getCollection: any
    getCompany: any
    getKeyword: any
    getMovie: any
    getMulti: any
    getPerson: any
    getTv: any
  }
  export const tv: {
    getAccountStates: any
    getAccountStatesGuest: any
    getAiringToday: any
    getAlternativeTitles: any
    getById: any
    getChanges: any
    getContentRatings: any
    getCredits: any
    getExternalIds: any
    getImages: any
    getKeywords: any
    getLatest: any
    getOnTheAir: any
    getPopular: any
    getRecommendations: any
    getReviews: any
    getScreenedTheatrically: any
    getSimilar: any
    getTopRated: any
    getTranslations: any
    getVideos: any
    rate: any
    rateGuest: any
    removeRate: any
    removeRateGuest: any
  }
  export const tvEpisodes: {
    getAccountStates: any
    getAccountStatesGuest: any
    getById: any
    getChanges: any
    getCredits: any
    getExternalIds: any
    getImages: any
    getVideos: any
    rate: any
    rateGuest: any
    removeRate: any
    removeRateGuest: any
  }
  export const tvSeasons: {
    getAccountStates: any
    getAccountStatesGuest: any
    getById: any
    getChanges: any
    getCredits: any
    getExternalIds: any
    getImages: any
    getVideos: any
  }
}
