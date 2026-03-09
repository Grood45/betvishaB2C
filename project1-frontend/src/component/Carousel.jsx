import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useToast } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { ImBullhorn } from 'react-icons/im';

const Carousel = () => {
  const sliderRef = useRef(null);
  const toast = useToast();

  const {
    bgColor1,
    bgGray,
    bgYellow,
    PrimaryText,
    secondaryText,
    hoverColor,
    ClickActiveColor,
  } = useSelector((state) => state.theme);

  const settings = useSelector((state) => state?.auth?.settings);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderSettings = {
    infinite: true,
    slidesToShow: 1,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: false,
    arrows: false,
    afterChange: (index) => setCurrentSlide(index),
  };

  const goToSlide = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const navStyle = {
    height: '5px',
    width: '20px',
    borderRadius: '20%',
  };

  const inlineStyles = {
    fontSize: '0.9rem',
    marginRight: '20px',
  };

  return (
    <div>
      <div className="relative w-full overflow-hidden">
        <Slider {...sliderSettings} ref={sliderRef}>
          {settings?.carousels?.map((img, index) => (
            <div key={index} className="relative h-[170px] md:h-[340px]">
              <img
                src={img}
                className="absolute inset-0 w-[100%] h-full"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </Slider>
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          {settings?.carousels?.map((_, index) => (
            <button
              key={index}
              type="button"
              style={navStyle}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-gray-200' : 'bg-gray-500'
              }`}
              aria-current={index === currentSlide}
              aria-label={`Slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        <button
          type="button"
          className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={() => sliderRef.current.slickPrev()}
        />
        <button
          type="button"
          className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={() => sliderRef.current.slickNext()}
        />
      </div>
      <div
        className="news-announcement flex md:py-[5px] md:-mt-1 justify-center items-center"
        style={{
          backgroundColor: bgGray,
        }}
      >
        <ImBullhorn style={{ margin: '0 10px' }} size={20} />
        <marquee className="font-bold xl md:p-2 mr-3">
          <span style={inlineStyles}>
            <span style={{ color: secondaryText }} className="news-title">
              Backup site link :
            </span>
            <span className="news-text">{settings?.marque}</span>
          </span>
        </marquee>
      </div>
    </div>
  );
};

export default Carousel;
