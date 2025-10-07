import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { addFavorite, removeFavorite } from '../../redux/slices/favoriteSlice';
import { selectTranslations } from '../../redux/slices/languageSlice';
import Carousel from '../../components/Carousel';
import CastCard from '../../components/CastCard';
import MovieCard from '../../components/MovieCard';
import VideoModal from '../../components/VideoModal';
import { IMAGE_BASE_URL, imageSizes } from '../../utils/constants';
import { formatDate, formatDuration } from '../../utils/helpers';
import useVideoTrailer from '../../hooks/useVideoTrailer';

const DetailView = ({ item, type, credits, similar, trailerKey, trailerKeys = [] }) => {
  const dispatch = useDispatch();
  const t = useSelector(selectTranslations);
  const favorites = useSelector(state => state.favorites);
  const [userRating, setUserRating] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showNoTrailerModal, setShowNoTrailerModal] = useState(false);

  const handlePlayTrailer = (video) => {
    if (video) {
      setSelectedVideo(video);
      setShowVideoModal(true);
    } else {
      setShowNoTrailerModal(true);
    }
  };

  
  const { videos: fetchedVideos } = useVideoTrailer(
    item?.id,
    type === 'movie' ? 'movie' : 'tv'
  );

  const isMovie = type === 'movie';
  const isFavorite = isMovie
    ? favorites.movies.some(fav => fav.id === item.id)
    : favorites.tvShows.some(fav => fav.id === item.id);

  
  useEffect(() => {
    const ratingKey = `rating-${type}-${item.id}`;
    const savedRating = localStorage.getItem(ratingKey);
    if (savedRating) {
      setUserRating(parseInt(savedRating, 10));
    }
  }, [type, item.id]);

  
  const handleRatingChange = (rating) => {
    setUserRating(rating);
    const ratingKey = `rating-${type}-${item.id}`;
    if (rating === 0) {
      localStorage.removeItem(ratingKey);
    } else {
      localStorage.setItem(ratingKey, rating.toString());
    }
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite({ type, id: item.id }));
    } else {
      dispatch(addFavorite({ 
        type, 
        item: {
          id: item.id,
          title: isMovie ? item.title : item.name,
          poster_path: item.poster_path,
          release_date: isMovie ? item.release_date : item.first_air_date,
          vote_average: item.vote_average
        }
      }));
    }
  };

  const backdropUrl = item.backdrop_path 
    ? `${IMAGE_BASE_URL}/${imageSizes.backdrop.large}${item.backdrop_path}` 
    : null;

  const posterUrl = item.poster_path 
    ? `${IMAGE_BASE_URL}/${imageSizes.poster.large}${item.poster_path}` 
    : '/placeholder-poster.jpg';

  const [showBackdropTrailer, setShowBackdropTrailer] = useState(false);
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
  const [player, setPlayer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const availableTrailers = trailerKeys.length > 0 ? trailerKeys : (trailerKey ? [trailerKey] : []);

  
  const effectiveTrailers = availableTrailers.length > 0 ? availableTrailers : (fetchedVideos.length > 0 ? fetchedVideos.map(v => v.key) : []);

  
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  
  useEffect(() => {
    if (showBackdropTrailer && effectiveTrailers.length > 0 && window.YT && window.YT.Player) {
      const ytPlayer = new window.YT.Player('youtube-player', {
        videoId: effectiveTrailers[currentTrailerIndex],
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1
        },
        events: {
          onReady: () => {
            setPlayer(ytPlayer);
            ytPlayer.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === 0) {
              const nextIndex = (currentTrailerIndex + 1) % effectiveTrailers.length;
              setCurrentTrailerIndex(nextIndex);
              if (ytPlayer) {
                ytPlayer.loadVideoById(effectiveTrailers[nextIndex]);
              }
            }
          }
        }
      });
    }
  }, [showBackdropTrailer, currentTrailerIndex, effectiveTrailers]);

  const toggleBackdropTrailer = () => {
    const newShow = !showBackdropTrailer;
    if (!newShow && player) {
      player.destroy();
      setPlayer(null);
    }
    setShowBackdropTrailer(newShow);
    if (newShow) {
      setCurrentTrailerIndex(0); 
    }
  };

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const backdropContent = showBackdropTrailer && effectiveTrailers.length > 0 ? (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        id="youtube-player"
        className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] -translate-x-1/2 -translate-y-1/2 scale-150 pointer-events-none"
        style={{ transformOrigin: "center center", zIndex: 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-black z-10 pointer-events-none"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          {isMovie ? item.title : item.name}
        </h1>
        <p className="max-w-3xl mb-8 text-lg md:text-xl opacity-80 line-clamp-3">
          {item.overview}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="px-6 py-2 rounded text-blue-500 font-semibold bg-transparent
                       border-2 border-blue-500
                       shadow-[0_0_10px_rgba(59,130,246,0.5)]
                       hover:bg-blue-500 hover:text-black
                       hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]
                       transition-all duration-300"
          >
            {isMuted ? '🔊 Unmute' : '🔇 Mute'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBackdropTrailer();
            }}
            className="px-6 py-2 rounded text-blue-500 font-semibold bg-transparent
                       border-2 border-blue-500
                       shadow-[0_0_10px_rgba(59,130,246,0.5)]
                       hover:bg-blue-500 hover:text-black
                       hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]
                       transition-all duration-300"
          >
            Close Trailer
          </button>
        </div>

      </div>
    </div>
  ) : backdropUrl ? (
    <div
      className="h-96 bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backdropUrl})`,
      }}
    >
    </div>
  ) : (
    <div className="h-96 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center relative">
      <div className="text-center text-white">
        <h2 className="text-4xl font-bold mb-4 opacity-50">Tidak Tersedia</h2>
        <p className="text-lg opacity-70">Backdrop dan trailer belum tersedia</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Backdrop with toggle */}
      <div className="relative">
        {backdropContent}
        {showBackdropTrailer && (
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/70 via-black/40 via-black/20 to-transparent pointer-events-none"></div>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 relative">
            <img 
              src={posterUrl} 
              alt={isMovie ? item.title : item.name}
              className="w-64 h-96 object-cover rounded-lg shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="flex-grow">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold">
                {isMovie ? item.title : item.name}
              </h1>
              <button
                onClick={handleFavoriteToggle}
                className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline'} relative z-30`}
              >
                {isFavorite ? '❤️ ' + t.removeFavorite : '🤍 ' + t.addFavorite}
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="badge badge-lg badge-primary">
                {isMovie ? 'Movie' : 'TV Series'}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-lg">{item.vote_average?.toFixed(1)}</span>
              </div>
              <div className="badge badge-lg badge-outline">
                {isMovie ? formatDate(item.release_date) : formatDate(item.first_air_date)}
              </div>
              {isMovie && item.runtime && (
                <div className="badge badge-lg badge-outline">
                  {formatDuration(item.runtime)}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{t.genres}</h3>
              <div className="flex flex-wrap gap-2">
                {item.genres?.map(genre => (
                  <span key={genre.id} className="badge badge-secondary">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{t.overview}</h3>
              <p className="text-lg leading-relaxed">{item.overview}</p>
            </div>

            {/* Backdrop/Trailer Toggle Button */}
            {backdropUrl && effectiveTrailers.length > 0 && (
              <div className="mb-6">
                <button
  onClick={toggleBackdropTrailer}
  aria-label="Toggle Backdrop Trailer"
  className="px-6 py-2 text-blue-500 font-semibold bg-transparent 
             border-2 border-blue-500 
             shadow-[0_0_10px_rgba(59,130,246,0.5)] 
             hover:bg-blue-500 hover:text-black 
             hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] 
             transition-all duration-300"
>
  {showBackdropTrailer ? 'Show Backdrop Image' : 'Show Trailer'}
</button>

              </div>
            )}

            {/* User Rating Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{t.yourRating}</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
  key={star}
  onClick={() => handleRatingChange(star)}
  className={`text-4xl bg-transparent border-none outline-none 
    transition-all duration-300 
    ${star <= userRating 
      ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]' 
      : 'text-gray-500 hover:text-yellow-400 hover:drop-shadow-[0_0_20px_rgba(250,204,21,1)]'}`}
  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
>
  ★
</button>


                ))}
              </div>
              {userRating > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-gray-400">Your rating: {userRating}/10</p>
                  <button
                    onClick={() => handleRatingChange(0)}
                    className="btn btn-sm btn-outline btn-error"
                    aria-label="Remove rating"
                  >
                    Remove Rating
                  </button>
                </div>
              )}
            </div>

            {!isMovie && item.seasons && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{t.seasons}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {item.seasons.map(season => (
                    <div key={season.id} className="card bg-base-200 p-4">
                      <h4 className="font-semibold">{season.name}</h4>
                      <p className="text-sm">{t.episodes}: {season.episode_count}</p>
                      <p className="text-sm">{formatDate(season.air_date)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cast */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">{t.cast}</h2>
          <Carousel items={credits.slice(0, 16)} type="cast">
            {credits.slice(0, 16).map(cast => (
              <div key={cast.id} className="px-2">
                <CastCard cast={cast} />
              </div>
            ))}
          </Carousel>
        </section>

            {/* Similar Movies */}
            {isMovie && similar.length > 0 && (
              <section className="mt-12">
                <h2 className="text-3xl font-bold mb-6">{t.similar}</h2>
                <Carousel items={similar.slice(0, 10)} type="movie">
                  {similar.slice(0, 10).map(movie => (
                    <div key={movie.id} className="px-2">
                      <MovieCard movie={movie} onPlayTrailer={handlePlayTrailer} />
                    </div>
                  ))}
                </Carousel>
              </section>
            )}
      </div>
      {showVideoModal && (
        <VideoModal
          video={selectedVideo}
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
        />
      )}
      {showNoTrailerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Trailer Tidak Tersedia</h3>
            <p className="mb-4">Maaf, trailer untuk film ini belum tersedia.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowNoTrailerModal(false)}
                className="btn btn-primary"
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

export default DetailView;
