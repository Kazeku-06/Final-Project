import { configureStore } from '@reduxjs/toolkit';
import favoriteReducer from './slices/favoriteSlice';
import languageReducer from './slices/languageSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    favorites: favoriteReducer,
    language: languageReducer,
    theme: themeReducer,
  },
});