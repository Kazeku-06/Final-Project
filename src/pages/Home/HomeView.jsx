import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTranslations } from "../../redux/slices/languageSlice";
import Carousel from "../../components/Carousel";
import MovieCard from "../../components/MovieCard";
import SeriesCard from "../../components/SeriesCard";
import VideoModal from "../../components/VideoModal";
import FilterSection from "../../components/FilterSection";
import Pagination from "../../components/Pagination";
import useVideoTrailer from "../../hooks/useVideoTrailer";

const HomeView = ({
  movies,
  tvSeries,
  trending,
  nowPlaying,
  movieGenres,
  tvGenres,
  moviesPagination,
  tvPagination,
  moviesFilter,
  tvFilter,
  onMoviesFilterChange,
  onTVFilterChange,
}) => {
  const navigate = useNavigate();
  const t = useSelector(selectTranslations);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showNoTrailerModal, setShowNoTrailerModal] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [featuredPlayer, setFeaturedPlayer] = useState(null);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Custom hook untuk trailer trending item (akan berganti saat video habis)
  const featuredItem = trending[currentFeaturedIndex];
  const { videos: trendingVideos } = useVideoTrailer(
    featuredItem?.id,
    featuredItem?.media_type
  );

  // Randomize featured item on page load/refresh
  useEffect(() => {
    if (trending.length > 0) {
      setCurrentFeaturedIndex(Math.floor(Math.random() * trending.length));
    }
  }, [trending.length]);

  // Load YouTube IFrame Player API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize YouTube player when videos are available
  useEffect(() => {
    if (
      trendingVideos.length > 0 &&
      window.YT &&
      window.YT.Player &&
      !featuredPlayer
    ) {
      const player = new window.YT.Player("featured-player", {
        videoId: trendingVideos[currentVideoIndex].key,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            setFeaturedPlayer(player);
            player.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === 0) {
              // Video ended, switch to next trailer or next item
              setCurrentVideoIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                if (nextIndex >= trendingVideos.length) {
                  // All trailers played, switch to next item
                  const nextFeaturedIndex = (currentFeaturedIndex + 1) % trending.length;
                  setCurrentFeaturedIndex(nextFeaturedIndex);
                  return 0;
                }
                return nextIndex;
              });
            }
          },
        },
      });
    }
  }, [trendingVideos, currentVideoIndex, featuredPlayer, currentFeaturedIndex]);

  // Reset video index when featured item changes
  useEffect(() => {
    setCurrentVideoIndex(0);
  }, [currentFeaturedIndex]);

  // Load new video when index changes
  useEffect(() => {
    if (featuredPlayer && trendingVideos.length > 0) {
      featuredPlayer.loadVideoById(trendingVideos[currentVideoIndex].key);
      setTimeout(() => {
        if (featuredPlayer && featuredPlayer.playVideo) {
          featuredPlayer.playVideo();
        }
      }, 100);
    }
  }, [currentVideoIndex, featuredPlayer, trendingVideos]);

  const handlePlayTrailer = (video) => {
    if (video) {
      setSelectedVideo(video);
      setShowVideoModal(true);
    } else {
      setShowNoTrailerModal(true);
    }
  };

  const handleFeaturedDetails = () => {
    if (featuredItem && featuredItem.id) {
      const type = featuredItem.media_type === "movie" ? "movie" : "tv";
      navigate(`/${type}/${featuredItem.id}`);
    }
  };

  const toggleMute = () => {
    if (featuredPlayer) {
      if (isMuted) {
        featuredPlayer.unMute();
      } else {
        featuredPlayer.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  // Options untuk sorting
  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "popularity.asc", label: "Least Popular" },
    { value: "release_date.desc", label: "Newest First" },
    { value: "release_date.asc", label: "Oldest First" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "vote_average.asc", label: "Lowest Rated" },
    { value: "title.asc", label: "Title A-Z" },
    { value: "title.desc", label: "Title Z-A" },
  ];

  // Handler untuk pagination movies
  const handleMoviesPageChange = (page) => {
    onMoviesFilterChange({ ...moviesFilter, page });
  };

  // Handler untuk pagination TV
  const handleTVPageChange = (page) => {
    onTVFilterChange({ ...tvFilter, page });
  };

  // Jika tidak ada data, tampilkan pesan
  const hasData =
    movies.length > 0 ||
    tvSeries.length > 0 ||
    trending.length > 0 ||
    nowPlaying.length > 0;

  if (!hasData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
          <p className="text-gray-400 mb-6">
            Unable to load movies and TV series. Please check your connection.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Featured Section dengan Trailer */}
      {featuredItem && (
        <section className="relative bg-black">
          <div className="relative h-screen w-full overflow-hidden">
            {trendingVideos.length > 0 ? (
              <>
                {/* YouTube Player - Fullscreen */}
                <div
                  id="featured-player"
                  className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] -translate-x-1/2 -translate-y-1/2 scale-150 pointer-events-none"
                  style={{
                    transformOrigin: "center center",
                    zIndex: 0,
                  }}
                />
                {/* Overlay utama agar teks tetap terbaca */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              </>
            ) : (
              <>
                {/* Placeholder Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-6xl font-bold mb-4 opacity-50">Tidak Tersedia</h2>
                    <p className="text-xl opacity-70">Video trailer belum tersedia</p>
                  </div>
                </div>
                {/* Overlay untuk konsistensi */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              </>
            )}
            {/* Gradasi bawah tambahan agar menyatu dengan konten di bawah */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-black z-10"></div>
            {/* Konten di atas video */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 text-white px-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                {featuredItem.title || featuredItem.name}
              </h1>
              <p className="max-w-3xl mb-8 text-lg md:text-xl opacity-80 line-clamp-3">
                {featuredItem.overview}
              </p>
              <div className="flex gap-4 justify-center">
                {trendingVideos.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="px-8 py-2 rounded-full border-2 border-blue-500 text-blue-500 font-semibold bg-transparent hover:bg-blue-500 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                  >
                    {isMuted ? '🔊 Unmute' : '🔇 Mute'}
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeaturedDetails();
                  }}
                  className="px-8 py-2 rounded-full border-2 border-blue-500 text-blue-500 font-semibold bg-transparent hover:bg-blue-500 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </section>
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

      <div className="container mx-auto px-4 py-8">
        {/* Trending Section */}
        {trending.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">{t.trending}</h2>
            <Carousel items={trending.slice(0, 10)} type="mixed">
              {trending.slice(0, 10).map((item) => (
                <div key={`trending-${item.id}`} className="px-2">
                  {item.media_type === "movie" ? (
                    <MovieCard movie={item} onPlayTrailer={handlePlayTrailer} />
                  ) : (
                    <SeriesCard
                      series={item}
                      onPlayTrailer={handlePlayTrailer}
                    />
                  )}
                </div>
              ))}
            </Carousel>
          </section>
        )}

        {/* Now Playing Movies */}
        {nowPlaying.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">{t.nowPlaying}</h2>
            <Carousel items={nowPlaying} type="movie">
              {nowPlaying.map((movie) => (
                <div key={`nowplaying-${movie.id}`} className="px-2">
                  <MovieCard movie={movie} onPlayTrailer={handlePlayTrailer} />
                </div>
              ))}
            </Carousel>
          </section>
        )}

        {/* Movies Section dengan Filter */}
        {movies.length > 0 && (
          <section className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <h2 className="text-3xl font-bold mb-4 lg:mb-0">
                {t.popularMovies}
              </h2>
              <FilterSection
                sortOptions={sortOptions}
                genres={movieGenres}
                currentSort={moviesFilter.sortBy}
                currentGenre={moviesFilter.genre}
                onSortChange={(sortBy) =>
                  onMoviesFilterChange({ ...moviesFilter, sortBy, page: 1 })
                }
                onGenreChange={(genre) =>
                  onMoviesFilterChange({ ...moviesFilter, genre, page: 1 })
                }
                type="movie"
              />
            </div>
            <Carousel items={movies} type="movie">
              {movies.map((movie) => (
                <div key={`movie-${movie.id}`} className="px-2">
                  <MovieCard movie={movie} onPlayTrailer={handlePlayTrailer} />
                </div>
              ))}
            </Carousel>
            {/* Pagination untuk Movies */}
            {moviesPagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={moviesPagination.currentPage}
                  totalPages={moviesPagination.totalPages}
                  onPageChange={handleMoviesPageChange}
                />
              </div>
            )}
          </section>
        )}

        {/* TV Series Section dengan Filter */}
        {tvSeries.length > 0 && (
          <section className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <h2 className="text-3xl font-bold mb-4 lg:mb-0">{t.tvSeries}</h2>
              <FilterSection
                sortOptions={sortOptions}
                genres={tvGenres}
                currentSort={tvFilter.sortBy}
                currentGenre={tvFilter.genre}
                onSortChange={(sortBy) =>
                  onTVFilterChange({ ...tvFilter, sortBy, page: 1 })
                }
                onGenreChange={(genre) =>
                  onTVFilterChange({ ...tvFilter, genre, page: 1 })
                }
                type="tv"
              />
            </div>
            <Carousel items={tvSeries} type="series">
              {tvSeries.map((series) => (
                <div key={`series-${series.id}`} className="px-2">
                  <SeriesCard
                    series={series}
                    onPlayTrailer={handlePlayTrailer}
                  />
                </div>
              ))}
            </Carousel>
            {/* Pagination untuk TV Series */}
            {tvPagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={tvPagination.currentPage}
                  totalPages={tvPagination.totalPages}
                  onPageChange={handleTVPageChange}
                />
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default HomeView;
