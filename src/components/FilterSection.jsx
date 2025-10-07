import { useSelector } from 'react-redux';
import { selectTranslations } from '../redux/slices/languageSlice';

const FilterSection = ({ 
  sortOptions, 
  genres, 
  currentSort, 
  currentGenre, 
  onSortChange, 
  onGenreChange,
  type 
}) => {
  const t = useSelector(selectTranslations);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Sort Dropdown */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-outline btn-sm">
          📊 Sort
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          {sortOptions.map(option => (
            <li key={option.value}>
              <button 
                onClick={() => onSortChange(option.value)}
                className={currentSort === option.value ? 'active' : ''}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Genre Dropdown */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-outline btn-sm">
          🎭 Genre
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-60 overflow-y-auto">
          <li>
            <button 
              onClick={() => onGenreChange('')}
              className={!currentGenre ? 'active' : ''}
            >
              All Genres
            </button>
          </li>
          {genres.map(genre => (
            <li key={genre.id}>
              <button 
                onClick={() => onGenreChange(genre.id)}
                className={currentGenre === genre.id.toString() ? 'active' : ''}
              >
                {genre.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterSection;