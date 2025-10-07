import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DetailView from './DetailView';
import { api } from '../../services/api';
import SkeletonLoader from '../../components/SkeletonLoader';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [credits, setCredits] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null); // new state for trailer key

  // Extract type dari pathname
  const getTypeFromPath = () => {
    const path = location.pathname;
    if (path.includes('/movie/')) return 'movie';
    if (path.includes('/tv/')) return 'tv';
    return null;
  };

  const type = getTypeFromPath();

  useEffect(() => {
    console.log('🔍 Detail Component - Analysis:', {
      params: { id },
      pathname: location.pathname,
      extractedType: type,
      fullURL: window.location.href
    });
    
    // Validasi parameter
    if (!id || isNaN(Number(id))) {
      console.error('❌ Invalid ID:', id);
      setError(`Invalid ID: "${id}". Must be a valid number.`);
      setLoading(false);
      return;
    }
    
    if (!type) {
      console.error('❌ Could not determine type from path:', location.pathname);
      setError('Invalid URL format. Please use /movie/:id or /tv/:id');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🚀 Fetching ${type} details for ID: ${id}`);

        if (type === 'movie') {
          const [itemData, creditsData, similarData, videosData] = await Promise.allSettled([
            api.getMovieDetails(id),
            api.getMovieCredits(id),
            api.getSimilarMovies(id),
            api.getMovieVideos(id) // fetch videos
          ]);

          console.log('🎬 Movie API results:', { 
            item: itemData, 
            credits: creditsData, 
            similar: similarData,
            videos: videosData
          });

          if (itemData.status === 'fulfilled' && itemData.value) {
            setItem(itemData.value);
          } else {
            throw new Error(itemData.reason?.message || 'Movie not found');
          }

          setCredits(creditsData.status === 'fulfilled' ? creditsData.value.cast || [] : []);
          setSimilar(similarData.status === 'fulfilled' ? similarData.value.results || [] : []);

          // Extract trailer key from videos
          if (videosData.status === 'fulfilled' && videosData.value && videosData.value.results) {
            const trailer = videosData.value.results.find(
              video => video.type === 'Trailer' && video.site === 'YouTube'
            );
            setTrailerKey(trailer ? trailer.key : null);
          } else {
            setTrailerKey(null);
          }

        } else if (type === 'tv') {
          const [itemData, creditsData, videosData] = await Promise.allSettled([
            api.getTVDetails(id),
            api.getTVCredits(id),
            api.getTVVideos(id) // fetch TV videos
          ]);

          console.log('📺 TV API results:', { 
            item: itemData, 
            credits: creditsData,
            videos: videosData
          });

          if (itemData.status === 'fulfilled' && itemData.value) {
            setItem(itemData.value);
          } else {
            throw new Error(itemData.reason?.message || 'TV series not found');
          }

          setCredits(creditsData.status === 'fulfilled' ? creditsData.value.cast || [] : []);
          setSimilar([]);

          // Extract trailer key from videos
          if (videosData.status === 'fulfilled' && videosData.value && videosData.value.results) {
            const trailer = videosData.value.results.find(
              video => video.type === 'Trailer' && video.site === 'YouTube'
            );
            setTrailerKey(trailer ? trailer.key : null);
          } else {
            setTrailerKey(null);
          }
        }

        console.log('✅ Data loaded successfully');

      } catch (err) {
        console.error('❌ Error fetching details:', err);
        setError(err.message || 'Failed to load details');
        setItem(null);
        setTrailerKey(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id, location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <SkeletonLoader type="detail" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="alert alert-error mb-6">
            <div className="flex flex-col gap-2">
              <span className="text-lg font-semibold">😔 Oops! Something went wrong</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={handleGoBack}
              className="btn btn-primary btn-sm sm:btn-md"
            >
              ← Go Back
            </button>
            <button 
              onClick={handleRetry}
              className="btn btn-outline btn-sm sm:btn-md"
            >
              🔄 Retry
            </button>
            <button 
              onClick={handleGoHome}
              className="btn btn-ghost btn-sm sm:btn-md"
            >
              🏠 Go Home
            </button>
          </div>
          <div className="mt-6 text-xs text-gray-500">
            <p>Debug info:</p>
            <p>Path: {location.pathname}</p>
            <p>Extracted Type: {type || 'undefined'}</p>
            <p>ID: {id || 'undefined'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DetailView 
      item={item}
      type={type}
      credits={credits}
      similar={similar}
      trailerKey={trailerKey} // pass trailer key as prop
    />
  );
};

export default Detail;