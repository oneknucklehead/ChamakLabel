import clsx from 'clsx';
import {MediaFile} from '@shopify/hydrogen';

import stylesFont from '../styles/custom-font.css';

import {Heading, Text, Link} from '~/components';
/**
 * Hero component that renders metafields attached to collection resources
 **/
export const links = () => {
  return [
    {rel: 'stylesheet', href: stylesFont},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
  ];
};

export function Hero({
  byline,
  cta,
  handle,
  heading,
  height,
  loading,
  spread,
  spreadSecondary,
  top,
}) {
  return (
    <Link to={`/collections/${handle}`}>
      <section
        className={clsx(
          'relative justify-end flex flex-col w-full',
          top && `-mt-[96px] lg:-mt-[118px]`,
          height === 'full'
            ? 'h-screen'
            : 'aspect-[4/5] sm:aspect-square md:aspect-[5/4] lg:aspect-[3/2] xl:aspect-[2/1]',
        )}
      >
        <div className="absolute inset-0 grid flex-grow grid-flow-col pointer-events-none auto-cols-fr -z-10 content-stretch overflow-clip">
          {spread?.reference && (
            <div>
              <SpreadMedia
                sizes={
                  spreadSecondary?.reference
                    ? '(min-width: 48em) 50vw, 100vw'
                    : '100vw'
                }
                data={spread.reference}
                loading={loading}
              />
            </div>
          )}
          {spreadSecondary?.reference && (
            <div className="hidden md:block">
              <SpreadMedia
                sizes="50vw"
                data={spreadSecondary.reference}
                loading={loading}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col items-baseline justify-between gap-4 px-6 py-8 sm:px-8 md:px-12 bg-gradient-to-t dark:from-contrast/60 dark:text-primary from-primary/60 text-contrast">
          {heading?.value && (
            // <Heading
            //   format
            //   as="h2"
            //   size="display"
            //   className="max-w-md font-poppins text-8xl"
            // >
            <h2 className="text-8xl" style={{fontFamily: 'Poppins-100'}}>
              {heading.value}
            </h2>
            // </Heading>
          )}
          {byline?.value && (
            <Text format width="narrow" as="p" size="lead">
              {byline.value}
            </Text>
          )}
          {cta?.value && <Text size="lead">{cta.value}</Text>}
        </div>
      </section>
    </Link>
  );
}

function SpreadMedia({data, loading, sizes}) {
  return (
    <MediaFile
      data={data}
      className="block object-cover w-full h-full"
      mediaOptions={{
        video: {
          controls: false,
          muted: true,
          loop: true,
          playsInline: true,
          autoPlay: true,
          previewImageOptions: {src: data.previewImage?.url ?? ''},
        },
        image: {
          loading,
          crop: 'center',
          sizes,
          alt: data.alt || '',
        },
      }}
    />
  );
}
