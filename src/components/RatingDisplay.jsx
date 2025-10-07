import { useSelector } from 'react-redux';
import { selectRatingForItem } from '../redux/slices/ratingSlice';

const RatingDisplay = ({ itemId, voteAverage }) => {
  const userRating = useSelector(selectRatingForItem(itemId));

  
  const displayRating = userRating || Math.round(voteAverage); 

  const renderStars = (rating) => {
    const stars = [];
    const starValue = rating / 2; 

    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(starValue)) {
        
        stars.push(
          <span key={i} className="text-yellow-400">
            ⭐
          </span>
        );
      } else if (i < starValue) {
        
        stars.push(
          <span key={i} className="text-yellow-400">
            ⭐
          </span>
        );
      } else {
        
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
