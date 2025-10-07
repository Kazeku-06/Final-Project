import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE_URL, imageSizes } from '../utils/constants';
import useVideoTrailer from '../hooks/useVideoTrailer';

const MovieCard = ({ movie, onPlayTrailer, type = 'movie' }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { videos } = useVideoTrailer(movie.id, type);

  const posterUrl = movie.poster_path 
    ? `${IMAGE_BASE_URL}/${imageSizes.poster.medium}${movie.poster_path}`
    : '/placeholder-poster.jpg';

  const title = movie.title || movie.name || 'Untitled';
  const rating = movie.vote_average?.toFixed(1) || 'N/A';
  const releaseYear = (movie.release_date || movie.first_air_date)?.split('-')[0] || 'N/A';

  const handleCardClick = () => {
    const itemType = (type === 'series' || type === 'tv') ? 'tv' : 'movie';
    if (movie.id) {
      navigate(`/${itemType}/${movie.id}`);
    } else {
      console.error('Invalid item data:', movie);
    }
  };

  const handlePlayTrailer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlayTrailer) {
      onPlayTrailer(videos.length > 0 ? videos[0] : null);
    }
  };

  return (
    <div
      className="relative cursor-pointer group"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className={`
        relative bg-base-100 rounded-xl shadow-lg overflow-hidden
        transform transition-all duration-500 ease-out
        ${isHovered ? 'scale-105 shadow-2xl -translate-y-2' : 'scale-100 shadow-lg'}
      `}>
        {/* Poster Image */}
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={posterUrl}
            alt={title}
            className={`
              w-full h-full object-cover transition-all duration-700
              ${isHovered ? 'scale-110 brightness-110' : 'scale-100 brightness-90'}
            `}
          />

          {/* Gradient Overlay */}
          <div className={`
            absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
            opacity-0 transition-opacity duration-500
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `} />

          {/* Rating Badge */}
          <div className={`
            absolute top-3 right-3
            transform transition-all duration-500
            ${isHovered ? 'scale-110 rotate-0' : 'scale-100 rotate-0'}
          `}>
            <div className="bg-black/80 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              {rating}
            </div>
          </div>

          {/* Hover Info Overlay */}
          <div className={`
            absolute bottom-0 left-0 right-0 p-4
            transform transition-all duration-500
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
              {title}
            </h3>
            <div className="flex justify-between items-center text-xs text-gray-300">
              <span>{releaseYear}</span>
              <span className="capitalize">{type}</span>
            </div>
          </div>

          {/* Play Button on Hover */}
          <div className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-500
            ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
          `}>
            <button
              onClick={handlePlayTrailer}
              className="bg-primary/90 text-white rounded-full p-4 transform transition-transform duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className={`
        absolute inset-0 rounded-xl bg-primary/20 blur-xl -z-10
        transition-all duration-500
        ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
      `} />
    </div>
  );
};

export default MovieCard;