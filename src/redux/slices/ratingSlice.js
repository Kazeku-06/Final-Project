import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ratings: {}, 
};

const ratingSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    setRating: (state, action) => {
      const { itemId, rating } = action.payload;
      state.ratings[itemId] = rating;
    },
    removeRating: (state, action) => {
      const { itemId } = action.payload;
      delete state.ratings[itemId];
    },
    clearAllRatings: (state) => {
      state.ratings = {};
    },
  },
});

export const { setRating, removeRating, clearAllRatings } = ratingSlice.actions;

export const selectRatings = (state) => state.ratings.ratings;

export const selectRatingForItem = (itemId) => (state) => state.ratings.ratings[itemId];

export default ratingSlice.reducer;
