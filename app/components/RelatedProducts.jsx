import React, {useRef} from 'react';
import Slider from 'react-slick';

import {ProductCard} from './ProductCard';

export function RelatedProducts({products}) {
  const sliderRef = useRef(null);

  const sliderNext = () => {
    sliderRef.current.slickNext();
  };
  const sliderPrev = () => {
    sliderRef.current.slickPrev();
  };
  var settings = {
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 675,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <h2
        style={{fontFamily: 'Karla-400'}}
        className="text-2xl uppercase tracking-widest text-center lg:text-left w-[75%] flex mx-auto pl-2 pt-10 pb-5"
      >
        Related Products
      </h2>
      <div className="flex justify-center items-center w-full pb-10">
        <button
          onClick={sliderPrev}
          className="bg-[#D3AED2] rounded-full z-10 p-3 mx-2 mb-[60px]"
        >
          <svg
            width="14"
            height="16"
            viewBox="0 0 7 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.646447 3.64645C0.451184 3.84171 0.451184 4.15829 0.646447 4.35355L3.82843 7.53553C4.02369 7.7308 4.34027 7.7308 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976311 4.7308 0.659728 4.53553 0.464466C4.34027 0.269204 4.02369 0.269204 3.82843 0.464466L0.646447 3.64645ZM7 3.5L1 3.5V4.5L7 4.5V3.5Z"
              fill="white"
            />
          </svg>
        </button>
        <div className="w-[75%]">
          <Slider ref={sliderRef} {...settings}>
            {products.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
                className="m-2"
                quickAdd={true}
              />
            ))}
          </Slider>
        </div>
        <button
          onClick={sliderNext}
          className="bg-[#D3AED2] rounded-full block z-10 p-3 mx-2 mb-[60px]"
        >
          <span>
            <svg
              width="14"
              height="16"
              viewBox="0 0 7 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.35355 4.35355C6.54882 4.15829 6.54882 3.84171 6.35355 3.64645L3.17157 0.464466C2.97631 0.269204 2.65973 0.269204 2.46447 0.464466C2.2692 0.659728 2.2692 0.976311 2.46447 1.17157L5.29289 4L2.46447 6.82843C2.2692 7.02369 2.2692 7.34027 2.46447 7.53553C2.65973 7.7308 2.97631 7.7308 3.17157 7.53553L6.35355 4.35355ZM-4.37114e-08 4.5L6 4.5L6 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                fill="white"
              />
            </svg>
          </span>
        </button>
      </div>
    </>
  );
}
