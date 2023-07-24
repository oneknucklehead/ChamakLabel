import {Image} from '@shopify/hydrogen';
import {useState, useRef, useEffect} from 'react';
import Slider from 'react-slick';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */

export function ProductGallery({medias}) {
  const src = 'https://images.unsplash.com/photo-1444065381814-865dc9da92c0';
  const [mainImage, setMainImage] = useState({
    ...medias[0].image,
    altText: medias[0].alt || 'Product image',
  });
  const [animationDuration, setAnimationDuration] = useState(500);
  // const [maxZoomPixelRatio, setMaxZoomPixelRatio] = useState(1);
  const [zoomInMultiplier, setZoomInMultiplier] = useState(2);
  const [doubleTapDelay, setDoubleTapDelay] = useState(100);
  const [doubleClickDelay, setDoubleClickDelay] = useState(300);
  const [doubleClickMaxStops, setDoubleClickMaxStops] = useState(2);
  const [keyboardMoveDistance, setKeyboardMoveDistance] = useState(50);
  const [wheelZoomDistanceFactor, setWheelZoomDistanceFactor] = useState(100);
  const [pinchZoomDistanceFactor, setPinchZoomDistanceFactor] = useState(100);
  const [scrollToZoom, setScrollToZoom] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMainImage({
      ...medias[0].image,
      altText: medias[0].alt || 'Product image',
    });
  }, [medias]);

  const sliderRef = useRef(null);

  const sliderNext = () => {
    sliderRef.current.slickNext();
  };
  const sliderPrev = () => {
    sliderRef.current.slickPrev();
  };

  const mainImageHandler = (media) => {
    setMainImage({...media?.image, altText: media?.alt || 'Product image'});
  };
  // const [backgroundImage, setBackgroundImage] = useState(`url(${src})`);

  // const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
  if (!medias.length) {
    return null;
  }

  var sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    swipeToSlide: true,

    // beforeChange: function (currentSlide, nextSlide) {
    //   console.log('before change', currentSlide, nextSlide);
    // },
    // afterChange: function (currentSlide) {
    //   console.log('after change', currentSlide);
    // },
  };
  // const handleMouseMove = (e) => {
  //   const {left, top, width, height} = e.target.getBoundingClientRect();
  //   const x = ((e.pageX - left) / width) * 100;
  //   const y = ((e.pageY - top) / height) * 100;
  //   setBackgroundPosition(`${x}% ${y}%`);
  // };
  var settings = {
    // dots: true,
    // arrows: true,
    verticalSwiping: true,
    vertical: true,
    // lazyLoad: true,
    // speed: 500,
    slidesToShow: medias.length > 4 ? 4 : medias.length,
    // initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
          vertical: false,
          verticalSwiping: false,
          slidesToShow: 1,
          infinite: true,
        },
      },
    ],
  };
  let imgArr = [];
  medias.forEach((media) => {
    if (media.image && media.image.url) {
      imgArr.push({src: media.image.url});
    }
  });

  return (
    // <figure
    //   onMouseMove={handleMouseMove}
    //   style={{backgroundImage, backgroundPosition}}
    // >
    //   <img src={src} alt="Product" className="productImage cursor-zoom-in" />
    // </figure>

    // <div
    //   className={`swimlane md:grid-flow-row hiddenScroll md:p-0 md:overflow-x-auto md:grid-cols-2 ${className}`}
    // >
    //   {medias.map((med, i) => {
    //     const isFirst = i === 0;
    //     const isFourth = i === 3;
    //     const isFullWidth = i % 3 === 0;

    //     const data = {
    //       ...med,
    //       image: {
    //         ...med.image,
    //         altText: med.alt || 'Product image',
    //       },
    //     };
    //     const style = [
    //       isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
    //       isFirst || isFourth ? '' : 'md:aspect-[4/5]',
    //       'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
    //     ].join(' ');
    //     return (
    //       <div className={style} key={med.id || med.image.id}>
    //         {med.image && (
    //           <Image
    //             // loading={'eager'}
    //             // src={data.image.url}
    //             loading={i === 0 ? 'eager' : 'lazy'}
    //             data={data.image}
    //             aspectRatio={!isFirst && !isFourth ? '4/5' : undefined}
    //             sizes={
    //               isFirst || isFourth
    //                 ? '(min-width: 48em) 60vw, 90vw'
    //                 : '(min-width: 48em) 30vw, 90vw'
    //             }
    //             className="cursor-zoom-in object-cover w-full h-full aspect-square fadeIn"
    //             // object-cover w-full h-full aspect-square fadeIn
    //           />
    //         )}
    //       </div>
    //     );
    //   })}
    // </div>
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open Lightbox
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={imgArr}
        plugins={[Fullscreen, Slideshow, Zoom]}
        // zoom={{ref: zoomRef}}
        // on={{
        //   click: () => zoomRef.current?.zoomIn(),
        // }}
        // animation={{zoom: animationDuration}}
        // zoom={{
        //   maxZoomPixelRatio,
        //   zoomInMultiplier,
        //   doubleTapDelay,
        //   doubleClickDelay,
        //   doubleClickMaxStops,
        //   keyboardMoveDistance,
        //   wheelZoomDistanceFactor,
        //   pinchZoomDistanceFactor,
        //   scrollToZoom,
        // }}
      />
      <div className="h-full w-full">
        <div className="flex flex-row justify-center items-center gap-4">
          <div className="hidden relative lg:block">
            <Image
              className="object-cover fadeIn"
              sizes="(min-width: 64em) 35vw, (min-width: 48em) 40vw, 55vw"
              aspectRatio="4/5"
              data={mainImage}
              // style={{width: '50%'}}
              loading={'lazy'}
            />
          </div>
          <div className="w-full relative lg:w-[80px]">
            <button
              onClick={sliderNext}
              className="bg-[#D3AED2] rounded-full block lg:hidden absolute top-[45%] right-5 z-10 p-2"
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
            <Slider ref={sliderRef} {...settings}>
              {medias.map((media, i) => (
                <button key={media.id} onClick={() => mainImageHandler(media)}>
                  <Image
                    className="object-cover fadeIn"
                    sizes="(min-width: 64em) 35vw, (min-width: 48em) 40vw, 55vw"
                    aspectRatio="4/5"
                    data={{
                      ...media.image,
                      altText: media.alt || 'Product image',
                    }}
                    // style={{width: '50%'}}
                    loading={'lazy'}
                  />
                </button>
              ))}
            </Slider>
            <button
              onClick={sliderPrev}
              className="bg-[#D3AED2] rounded-full block lg:hidden absolute top-[45%] left-5 z-10 p-2"
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
          </div>

          {/* <div>
            <Slider
              {...settings}
              className="h-[120px] flex gap-2 mx-auto w-[90%]"
            >
              {medias.map((media, i) => (
                <button
                  key={media.id}
                  onClick={() => mainImageHandler(media)}
                  // className="h-fit w-[60px]"
                  // style={{
                  //   width: 'fit-content',
                  //   height: 'fit-content',
                  // }}
                >
                  <Image
                    loading={'eager'}
                    data={{
                      ...media.image,
                      altText: media.alt || 'Product image',
                    }}
                    // sizes={'(min-width: 5em) 20vw, 10vw'}
                    // sizes={'30px'}
                    width="60px"
                    height="120px"
                    // aspectRatio="4/5"
                    // className="h-[120px] w-[60px]"
                  />
                </button>
              ))}
            </Slider>
          </div> */}

          {/* <ImageZoomInOut imageUrl={mainImage} /> */}
          {/* <div className="h-[100px] w-full lg:h-fit lg:max-h-fit lg:w-[80px] flex justify-center items-center flex-row lg:flex-col gap-2"> */}
          {/* <Slider {...settings}>
              {medias.map((media, i) => (
                <div
                  key={media.id}
                  //  onClick={() => mainImageHandler(media)}
                >
                  <Image
                    loading={'eager'}
                    data={{
                      ...media.image,
                      altText: media.alt || 'Product image',
                    }}
                    sizes={'(min-width: 5em) 20vw, 10vw'}
                    className="lg:h-fit max-h-min"
                  />
                </div>
              ))}
              
            </Slider> */}

          {/* </div> */}
        </div>
      </div>
    </>
  );
}
