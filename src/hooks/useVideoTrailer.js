import { useState, useEffect } from 'react';
import { api } from '../services/api';

const useVideoTrailer = (itemId, type = 'movie') => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!itemId) {
        setVideos([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const videoData = type === 'movie' 
          ? await api.getMovieVideos(itemId)
          : await api.getTVVideos(itemId);
        
        // Filter hanya trailer YouTube
        const trailers = videoData?.results?.filter(video => 
          video.type === 'Trailer' && video.site === 'YouTube'
        ) || [];
        
        setVideos(trailers);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [itemId, type]);

  return { videos, loading, error };
};

export default useVideoTrailer;