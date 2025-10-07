import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLanguage: 'en',
  translations: {
    en: {
      home: 'Home',
      search: 'Search',
      favorites: 'Favorites',
      trending: 'Trending Now',
      nowPlaying: 'Now Playing',
      popularMovies: 'Popular Movies',
      tvSeries: 'TV Series',
      cast: 'Cast',
      similar: 'Similar Movies',
      overview: 'Overview',
      seasons: 'Seasons',
      episodes: 'Episodes',
      rating: 'Rating',
      releaseDate: 'Release Date',
      firstAirDate: 'First Air Date',
      duration: 'Duration',
      genres: 'Genres',
      addFavorite: 'Add to Favorites',
      removeFavorite: 'Remove from Favorites',
      searchPlaceholder: 'Search for movies or TV series...',
      noResults: 'No results found',
      noFavorites: 'No favorites yet',
      minutes: 'min',
      trailer: 'Trailer'
    },
    id: {
      home: 'Beranda',
      search: 'Pencarian',
      favorites: 'Favorit',
      trending: 'Sedang Trend',
      nowPlaying: 'Sedang Tayang',
      popularMovies: 'Film Populer',
      tvSeries: 'Serial TV',
      cast: 'Pemeran',
      similar: 'Film Serupa',
      overview: 'Sinopsis',
      seasons: 'Musim',
      episodes: 'Episode',
      rating: 'Rating',
      releaseDate: 'Tanggal Rilis',
      firstAirDate: 'Tanggal Tayang Pertama',
      duration: 'Durasi',
      genres: 'Genre',
      addFavorite: 'Tambah ke Favorit',
      removeFavorite: 'Hapus dari Favorit',
      searchPlaceholder: 'Cari film atau serial TV...',
      noResults: 'Tidak ada hasil ditemukan',
      noFavorites: 'Belum ada favorit',
      minutes: 'menit',
      trailer: 'Trailer'
    }
  }
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const selectCurrentLanguage = (state) => state.language.currentLanguage;
export const selectTranslations = (state) => state.language.translations[state.language.currentLanguage];

export default languageSlice.reducer;