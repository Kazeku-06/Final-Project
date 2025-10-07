import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTranslations } from '../../redux/slices/languageSlice';
import MovieCard from '../../components/MovieCard';
import SeriesCard from '../../components/SeriesCard';
import Pagination from '../../components/Pagination';
import VideoModal from '../../components/VideoModal';
import useSearch from '../../hooks/useSearch';

const SearchView = ({ results, loading, query, error, pagination, onPageChange }) => {
  const t = useSelector(selectTranslations);
  const { searchTerm, setSearchTerm } = useSearch();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const filteredResults = results.filter(item =>
    item.media_type === 'movie' || item.media_type === 'tv'
  );

  const handlePlayTrailer = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="flex-grow px-6 py-2 rounded-full bg-transparent border-2 border-blue-500 text-blue-500 placeholder-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] focus:outline-none focus:shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="px-8 py-2 rounded-full border-2 border-blue-500 text-blue-500 font-semibold bg-transparent hover:bg-blue-500 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]">
            Search
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Search results update automatically as you type
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>Error: {error}</span>
        </div>
      )}

      {!loading && query && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {t.search} "{query}" ({filteredResults.length} results)
          </h2>
          
          {filteredResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg">{t.noResults} "{query}"</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredResults.map((item) => (
                  item.media_type === 'movie' ? (
                    <MovieCard key={item.id} movie={item} onPlayTrailer={handlePlayTrailer} />
                  ) : (
                    <SeriesCard key={item.id} series={item} onPlayTrailer={handlePlayTrailer} />
                  )
                ))}
              </div>

              {/* Pagination untuk Search Results */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!loading && !query && (
        <div className="text-center py-8">
          <p className="text-lg">{t.searchPlaceholder}</p>
        </div>
      )}

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />
    </div>
  );
};

export default SearchView;
