import { useReducer, useEffect, useState } from 'react';
import HomeView from './HomeView';
import { api } from '../../services/api';
import SkeletonLoader from '../../components/SkeletonLoader';

// Reducer
const homeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MOVIES':
      return { ...state, movies: action.payload };
    case 'SET_TV_SERIES':
      return { ...state, tvSeries: action.payload };
    case 'SET_TRENDING':
      return { ...state, trending: action.payload };
    case 'SET_NOW_PLAYING':
      return { ...state, nowPlaying: action.payload };
    case 'SET_MOVIE_GENRES':
      return { ...state, movieGenres: action.payload };
    case 'SET_TV_GENRES':
      return { ...state, tvGenres: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_MOVIES_PAGINATION':
      return { ...state, moviesPagination: action.payload };
    case 'SET_TV_PAGINATION':
      return { ...state, tvPagination: action.payload };
    default:
      return state;
  }
};

const initialState = {
  movies: [],
  tvSeries: [],
  trending: [],
  nowPlaying: [],
  movieGenres: [],
  tvGenres: [],
  moviesPagination: { currentPage: 1, totalPages: 1 },
  tvPagination: { currentPage: 1, totalPages: 1 },
  loading: true,
  error: null
};

const Home = () => {
  const [state, dispatch] = useReducer(homeReducer, initialState);
  const [moviesFilter, setMoviesFilter] = useState({
    sortBy: 'popularity.desc',
    genre: '',
    page: 1
  });
  const [tvFilter, setTvFilter] = useState({
    sortBy: 'popularity.desc',
    genre: '',
    page: 1
  });

  // Fetch 
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const [moviesData, tvData, trendingData, nowPlayingData, movieGenresData, tvGenresData] = await Promise.allSettled([
          api.getDiscoverMovies(1, 'popularity.desc', ''),
          api.getDiscoverTV(1, 'popularity.desc', ''),
          api.getTrendingAll(1),
          api.getNowPlaying(1),
          api.getMovieGenres(),
          api.getTVGenres()
        ]);

        // Handle film
        if (moviesData.status === 'fulfilled' && moviesData.value.results) {
          dispatch({ type: 'SET_MOVIES', payload: moviesData.value.results });
          dispatch({
            type: 'SET_MOVIES_PAGINATION',
            payload: {
              currentPage: 1,
              totalPages: Math.min(moviesData.value.total_pages, 500) // TMDB limit
            }
          });
        }

        // Handle TV series
        if (tvData.status === 'fulfilled' && tvData.value.results) {
          dispatch({ type: 'SET_TV_SERIES', payload: tvData.value.results });
          dispatch({
            type: 'SET_TV_PAGINATION',
            payload: {
              currentPage: 1,
              totalPages: Math.min(tvData.value.total_pages, 500)
            }
          });
        }

        // Handle data lain
        if (trendingData.status === 'fulfilled') {
          dispatch({ type: 'SET_TRENDING', payload: trendingData.value.results || [] });
        }
        if (nowPlayingData.status === 'fulfilled') {
          dispatch({ type: 'SET_NOW_PLAYING', payload: nowPlayingData.value.results || [] });
        }
        if (movieGenresData.status === 'fulfilled') {
          dispatch({ type: 'SET_MOVIE_GENRES', payload: movieGenresData.value.genres || [] });
        }
        if (tvGenresData.status === 'fulfilled') {
          dispatch({ type: 'SET_TV_GENRES', payload: tvGenresData.value.genres || [] });
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchInitialData();
  }, []);

  // Fetch buat filter film
  const fetchFilteredMovies = async (filters) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const moviesData = await api.getDiscoverMovies(
        filters.page,
        filters.sortBy,
        filters.genre
      );

      if (moviesData.results) {
        dispatch({ type: 'SET_MOVIES', payload: moviesData.results });
        dispatch({
          type: 'SET_MOVIES_PAGINATION',
          payload: {
            currentPage: filters.page,
            totalPages: Math.min(moviesData.total_pages, 500)
          }
        });
      }
    } catch (error) {
      console.error('Error fetching filtered movies:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch buat filter TV series
  const fetchFilteredTV = async (filters) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tvData = await api.getDiscoverTV(
        filters.page,
        filters.sortBy,
        filters.genre
      );

      if (tvData.results) {
        dispatch({ type: 'SET_TV_SERIES', payload: tvData.results });
        dispatch({
          type: 'SET_TV_PAGINATION',
          payload: {
            currentPage: filters.page,
            totalPages: Math.min(tvData.total_pages, 500)
          }
        });
      }
    } catch (error) {
      console.error('Error fetching filtered TV:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Handler untuk filter movies
  const handleMoviesFilterChange = (newFilters) => {
    setMoviesFilter(newFilters);
    fetchFilteredMovies(newFilters);
  };

  // Handler untuk filter TV series
  const handleTVFilterChange = (newFilters) => {
    setTvFilter(newFilters);
    fetchFilteredTV(newFilters);
  };

  if (state.loading && state.movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader type="card" count={10} />
      </div>
    );
  }

  if (state.error && state.movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>Error loading data: {state.error}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-sm btn-outline ml-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <HomeView 
      movies={state.movies}
      tvSeries={state.tvSeries}
      trending={state.trending}
      nowPlaying={state.nowPlaying}
      movieGenres={state.movieGenres}
      tvGenres={state.tvGenres}
      moviesPagination={state.moviesPagination}
      tvPagination={state.tvPagination}
      moviesFilter={moviesFilter}
      tvFilter={tvFilter}
      onMoviesFilterChange={handleMoviesFilterChange}
      onTVFilterChange={handleTVFilterChange}
    />
  );
};

export default Home;