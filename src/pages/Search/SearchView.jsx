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
  const [showNoTrailerModal, setShowNoTrailerModal] = useState(false);

  const filteredResults = results.filter(item =>
    item.media_type === 'movie' || item.media_type === 'tv'
  );

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

export default SearchView;
