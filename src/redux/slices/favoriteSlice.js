import { createSlice } from '@reduxjs/toolkit';

// Initialize state from localStorage or use default empty state
const initialState = {
  movies: JSON.parse(localStorage.getItem('favorites_movies')) || [],
  tvShows: JSON.parse(localStorage.getItem('favorites_tvShows')) || [],
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const { type, item } = action.payload;
      if (type === 'movie') {
        const exists = state.movies.find(movie => movie.id === item.id);
        if (!exists) {
          state.movies.push(item);
          // Update localStorage
          localStorage.setItem('favorites_movies', JSON.stringify(state.movies));
        }
      } else if (type === 'tv') {
        const exists = state.tvShows.find(tv => tv.id === item.id);
        if (!exists) {
          state.tvShows.push(item);
          // Update localStorage
          localStorage.setItem('favorites_tvShows', JSON.stringify(state.tvShows));
        }
      }
    },
    removeFavorite: (state, action) => {
      const { type, id } = action.payload;
      if (type === 'movie') {
        state.movies = state.movies.filter(movie => movie.id !== id);
        // Update localStorage
        localStorage.setItem('favorites_movies', JSON.stringify(state.movies));
      } else if (type === 'tv') {
        state.tvShows = state.tvShows.filter(tv => tv.id !== id);
        // Update localStorage
        localStorage.setItem('favorites_tvShows', JSON.stringify(state.tvShows));
      }
    },
  },
});

export const { addFavorite, removeFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;