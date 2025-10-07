import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavorite } from '../../redux/slices/favoriteSlice';
import { selectTranslations } from '../../redux/slices/languageSlice';
import MovieCard from '../../components/MovieCard';
import SeriesCard from '../../components/SeriesCard';
import VideoModal from '../../components/VideoModal';

const FavoriteView = ({ favorites }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslations);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showNoTrailerModal, setShowNoTrailerModal] = useState(false);

  const handleRemoveFavorite = (type, id, e) => {
    e.stopPropagation(); 
    dispatch(removeFavorite({ type, id }));
  };

  const handlePlayTrailer = (video) => {
    if (video) {
      setSelectedVideo(video);
      setShowVideoModal(true);
    } else {
      setShowNoTrailerModal(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t.favorites}</h1>

      {/* Favorite Movies */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">{t.popularMovies} ({favorites.movies.length})</h2>
        {favorites.movies.length === 0 ? (
          <p className="text-lg text-gray-400">{t.noFavorites}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.movies.map(movie => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} onPlayTrailer={handlePlayTrailer} />
                <button
                  onClick={(e) => handleRemoveFavorite('movie', movie.id, e)}
                  className="absolute top-2 right-2 btn btn-sm btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Favorite TV Shows */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">{t.tvSeries} ({favorites.tvShows.length})</h2>
        {favorites.tvShows.length === 0 ? (
          <p className="text-lg text-gray-400">{t.noFavorites}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.tvShows.map(tv => (
              <div key={tv.id} className="relative group">
                <SeriesCard series={tv} onPlayTrailer={handlePlayTrailer} />
                <button
                  onClick={(e) => handleRemoveFavorite('tv', tv.id, e)}
                  className="absolute top-2 right-2 btn btn-sm btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />

      {/* No Trailer Modal */}
      {showNoTrailerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-base-100 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-bounce-in">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-base-content">Video Trailer Tidak Tersedia</h3>
              <p className="text-gray-600 mb-6">Maaf, trailer untuk film ini belum tersedia saat ini.</p>
              <button
                onClick={() => setShowNoTrailerModal(false)}
                className="btn btn-primary btn-block rounded-full"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteView;
