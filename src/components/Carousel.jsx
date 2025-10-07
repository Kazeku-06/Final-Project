import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ items, title, type = "movie", children }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 2000, 
    cssEase: "linear",
    pauseOnHover: true, 
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-12">
      {title && <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>}
      <Slider {...settings}>
        {children || items.map((item) => (
          <div key={item.id} className="px-2">
            {type === 'movie' || (type === 'mixed' && item.media_type === 'movie') ? (
              <MovieCard movie={item} />
            ) : (
              <SeriesCard series={item} />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;