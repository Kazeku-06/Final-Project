import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setRating, removeRating } from '../redux/slices/ratingSlice';

const RatingModal = ({ isOpen, onClose, item, currentRating }) => {
  const dispatch = useDispatch();
  const [selectedRating, setSelectedRating] = useState(currentRating || 0);

  if (!isOpen || !item) return null;

  const handleSubmit = () => {
    if (selectedRating > 0) {
      dispatch(setRating({ itemId: item.id, rating: selectedRating }));
    }
    onClose();
  };

  const handleRemove = () => {
    dispatch(removeRating({ itemId: item.id }));
    setSelectedRating(0);
    onClose();
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 10 }, (_, i) => (
      <button
        key={i}
        className={`text-xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        onClick={interactive ? () => setSelectedRating(i + 1) : undefined}
        disabled={!interactive}
      >
        {i < rating ? '⭐' : '☆'}
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-center">
          Rate {item.title || item.name}
        </h3>

        <div className="flex justify-center mb-6">
          {renderStars(selectedRating, true)}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={selectedRating === 0}
          >
            Rate
          </button>
          {currentRating && (
            <button
              onClick={handleRemove}
              className="btn btn-outline btn-error"
            >
              Remove Rating
            </button>
          )}
          <button
            onClick={onClose}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
