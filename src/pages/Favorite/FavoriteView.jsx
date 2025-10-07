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

  const handleRemoveFavorite = (type, id, e) => {
    e.stopPropagation(); // Mencegah navigasi saat menghapus favorit
    dispatch(removeFavorite({ type, id }));
  };

  const handlePlayTrailer = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
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
    </div>
  );
};

export default FavoriteView;
