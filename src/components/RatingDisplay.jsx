import { useSelector } from 'react-redux';
import { selectRatingForItem } from '../redux/slices/ratingSlice';

const RatingDisplay = ({ itemId, voteAverage }) => {
  const userRating = useSelector(selectRatingForItem(itemId));

  // If user has rated, show user rating, else show TMDB average
  const displayRating = userRating || Math.round(voteAverage); // Use TMDB 10-scale directly

  const renderStars = (rating) => {
    const stars = [];
    const starValue = rating / 2; // Convert 1-10 scale to 0-5 star scale

    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(starValue)) {
        // Full star
        stars.push(
          <span key={i} className="text-yellow-400">
            ⭐
          </span>
        );
      } else if (i < starValue) {
        // Half star
        stars.push(
          <span key={i} className="text-yellow-400">
            ⭐
          </span>
        );
      } else {
        // Empty star
        stars.push(
          <span key={i} className="text-gray-600">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      {renderStars(displayRating)}
      <span className="text-sm, text-gray-400 ml-1">
        {userRating ? `(${userRating}/10)` : `(${voteAverage?.toFixed(1)})`}
      </span>
    </div>
  );
};

export default RatingDisplay;
