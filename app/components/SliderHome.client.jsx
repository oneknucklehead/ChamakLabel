import React from 'react';
import Slider from 'react-slick';
import {MediaFile} from '@shopify/hydrogen';

import {Link} from './Link';
export function SliderHome({sliderContent}) {
  var settings = {
    dots: true,
    infinite: true,
    arrows: false,
    autoplay: true,
    fade: true,
    autoplaySpeed: 5000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="slider-wrapper-custom sliderHome">
      <Slider {...settings}>
        {sliderContent?.edges?.map((collection) => (
          <div key={collection.node?.id}>
            {collection.node?.spread?.reference && (
              <div className="w-[100vw] h-[100vh] relative">
                <img
                  className="object-cover w-full h-full"
                  src={`${collection.node?.spread?.reference.previewImage?.url}`}
                  alt={`${collection.node?.handle}`}
                />
                <div
                  className="absolute text-white bottom-[10%] mx-[30px] lg:mx-[50px]"
                  style={{fontFamily: 'Poppins-300'}}
                >
                  <p className="text-[15px] uppercase tracking-widest">
                    {collection.node?.byline?.value}
                  </p>
                  <h3 className="text-[24px] uppercase py-4 tracking-widest">
                    {collection.node?.heading.value}
                  </h3>
                  {/* <div className="flex"> */}
                  {collection.node?.cta?.value && (
                    <Link
                      to={`/collections/${collection.node?.handle}`}
                      className="animated-button thar-three z-10 w-fit"
                    >
                      <p className="uppercase z-50 text-[14px] tracking-widest">
                        {collection.node?.cta?.value}
                      </p>
                    </Link>
                  )}
                  {/* </div> */}
                </div>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}
