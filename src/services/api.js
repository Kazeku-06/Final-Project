import axiosInstance from "./axiosConfig";

// Helper untuk handle semua request agar lebih aman
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error(`API Error:`, error.response?.data || error.message);
    throw new Error(
      error.response?.data?.status_message || error.message || "API Error"
    );
  }
};

// Tambahkan constant untuk filter agar tidak ada konten dewasa
const SAFE_FILTER = "&include_adult=false";

export const api = {
  // 🎬 Movies dengan filter dan sorting (tanpa konten dewasa)
  getDiscoverMovies: (page = 1, sortBy = "popularity.desc", genre = "") =>
    handleApiCall(() => {
      let url = `/discover/movie?page=${page}&sort_by=${sortBy}${SAFE_FILTER}`;
      if (genre) url += `&with_genres=${genre}`;
      return axiosInstance.get(url);
    }),

  getMovieDetails: (movieId) =>
    handleApiCall(() => axiosInstance.get(`/movie/${movieId}`)),

  getSimilarMovies: (movieId) =>
    handleApiCall(() => axiosInstance.get(`/movie/${movieId}/similar`)),

  getMovieCredits: (movieId) =>
    handleApiCall(() => axiosInstance.get(`/movie/${movieId}/credits`)),

  getNowPlaying: (page = 1) =>
    handleApiCall(() => axiosInstance.get(`/movie/now_playing?page=${page}`)),

  getMovieVideos: (movieId) =>
    handleApiCall(() => axiosInstance.get(`/movie/${movieId}/videos`)),

  // 📺 TV Series dengan filter dan sorting (tanpa konten dewasa)
  getDiscoverTV: (page = 1, sortBy = "popularity.desc", genre = "") =>
    handleApiCall(() => {
      let url = `/discover/tv?page=${page}&sort_by=${sortBy}${SAFE_FILTER}`;
      if (genre) url += `&with_genres=${genre}`;
      return axiosInstance.get(url);
    }),

  getTVDetails: (tvId) => handleApiCall(() => axiosInstance.get(`/tv/${tvId}`)),

  getTVCredits: (tvId) =>
    handleApiCall(() => axiosInstance.get(`/tv/${tvId}/credits`)),

  getTVVideos: (tvId) =>
    handleApiCall(() => axiosInstance.get(`/tv/${tvId}/videos`)),

  // 🔥 Trending
  getTrendingAll: (page = 1) =>
    handleApiCall(() => axiosInstance.get(`/trending/all/week?page=${page}`)),

  // 🔍 Search dengan pagination
  searchAll: (query, page = 1) =>
    handleApiCall(() =>
      axiosInstance.get(
        `/search/multi?query=${encodeURIComponent(
          query
        )}&page=${page}${SAFE_FILTER}`
      )
    ),

  // 🎭 Genres
  getMovieGenres: () =>
    handleApiCall(() => axiosInstance.get("/genre/movie/list")),

  getTVGenres: () => handleApiCall(() => axiosInstance.get("/genre/tv/list")),

  // ⭐ Rating endpoints
  addRating: (type, id, rating) =>
    handleApiCall(() =>
      axiosInstance.post(`/${type}/${id}/rating`, { value: rating })
    ),

  deleteRating: (type, id) =>
    handleApiCall(() => axiosInstance.delete(`/${type}/${id}/rating`)),

  // 👤 Account endpoints
  getAccountDetails: () => handleApiCall(() => axiosInstance.get("/account")),

  getRatedMovies: (accountId) =>
    handleApiCall(() =>
      axiosInstance.get(`/account/${accountId}/rated/movies`)
    ),

  getRatedTV: (accountId) =>
    handleApiCall(() => axiosInstance.get(`/account/${accountId}/rated/tv`)),
};
