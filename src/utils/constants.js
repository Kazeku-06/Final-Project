export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
export const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;


export const APP_NAME = import.meta.env.VITE_APP_NAME;
export const APP_VERSION = import.meta.env.VITE_APP_VERSION;


export const ENABLE_VIDEO_TRAILERS = import.meta.env.VITE_ENABLE_VIDEO_TRAILERS === 'true';
export const ENABLE_FAVORITES = import.meta.env.VITE_ENABLE_FAVORITES === 'true';
export const ENABLE_SEARCH = import.meta.env.VITE_ENABLE_SEARCH === 'true';

export const imageSizes = {
  poster: {
    small: 'w154',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  }
};