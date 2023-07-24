import clsx from 'clsx';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';

import {Text, Link, AddToCartButton} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd = true,
}) {
  let cardLabel;

  const cardProduct = product?.variants ? product : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price, compareAtPrice)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  const productAnalytics = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={clsx('grid gap-4', className)}>
        <div className="aspect-[4/5] bg-primary/5">
          {image && (
            <div className="relative group/image">
              <Link
                onClick={onClick}
                to={`/products/${product.handle}`}
                prefetch="intent"
              >
                <Image
                  className="object-cover w-full fadeIn"
                  sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                  aspectRatio="4/5"
                  data={image}
                  alt={image.altText || `Picture of ${product.title}`}
                  loading={loading}
                />
                <div className="flex justify-center items-center h-14 w-14 opacity-0 transition duration-300 rounded-bl-full bg-[#6C4A6F] absolute top-0 right-0 group-hover/image:opacity-100">
                  <span className="ml-3 -mt-2">
                    <svg
                      width="12"
                      height="13"
                      viewBox="0 0 12 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.5303 7.05133C11.8232 6.75843 11.8232 6.28356 11.5303 5.99067L6.75736 1.2177C6.46447 0.924802 5.98959 0.924802 5.6967 1.2177C5.40381 1.51059 5.40381 1.98546 5.6967 2.27836L9.93934 6.521L5.6967 10.7636C5.40381 11.0565 5.40381 11.5314 5.6967 11.8243C5.98959 12.1172 6.46447 12.1172 6.75736 11.8243L11.5303 7.05133ZM0 7.271L11 7.271V5.771L0 5.771L0 7.271Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </div>
                <Text
                  as="label"
                  size="fine"
                  className="absolute top-0 left-0 m-4 text-right text-[#6C4A6F]"
                >
                  {cardLabel}
                </Text>
              </Link>
              {quickAdd && (
                <div className="absolute right-5 bottom-5 shadow-2xl">
                  <AddToCartButton
                    lines={[
                      {
                        quantity: 1,
                        merchandiseId: firstVariant.id,
                      },
                    ]}
                    variant="inline"
                    className="mt-2 border-b-0"
                    width="auto"
                    analytics={{
                      products: [productAnalytics],
                      totalValue: parseFloat(productAnalytics.price),
                    }}
                  >
                    <div className="bg-[#6C4A6F] rounded-full p-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 29 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24.4687 4.49499H19.0539V2.75681C19.0539 1.25696 17.8341 0.0380554 16.3352 0.0380554H12.7201C11.2203 0.0380554 10.0014 1.25696 10.0014 2.75681V4.49499H4.53034C3.52984 4.49499 2.71784 5.30699 2.71784 6.30749V27.1503C2.71784 28.1517 3.52984 28.9628 4.53034 28.9628H24.4678C25.4692 28.9628 26.2803 28.1517 26.2803 27.1503V6.30749C26.2803 5.30699 25.4702 4.49499 24.4687 4.49499ZM11.8148 2.75681C11.8148 2.25656 12.2208 1.85056 12.721 1.85056H16.3361C16.8363 1.85056 17.2423 2.25656 17.2423 2.75681V4.49499H11.8148V2.75681ZM24.4687 27.1503H4.53125V6.30749H10.0023V8.17255C10.0023 8.17255 9.97781 9.0779 10.9031 9.0779C11.9226 9.0779 11.8148 8.17255 11.8148 8.17255V6.30749H17.2423V8.17255C17.2423 8.17255 17.1816 9.08243 18.1449 9.08243C19.0512 9.08243 19.0548 8.17255 19.0548 8.17255V6.30749H24.4687V27.1503Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </AddToCartButton>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <Link
            onClick={onClick}
            to={`/products/${product.handle}`}
            prefetch="intent"
          >
            <h3
              className="w-full text-[#6C4A6F] text-lg tracking-wider text-center uppercase overflow-hidden whitespace-nowrap text-ellipsis "
              style={{
                fontFamily: 'Karla-400',
              }}
            >
              {product.title}
            </h3>
          </Link>
          <div className="flex gap-4">
            <h3
              className="flex gap-4 text-base"
              style={{
                fontFamily: 'Karla-300',
              }}
            >
              <Money withoutTrailingZeros data={price} />
              {isDiscounted(price, compareAtPrice) && (
                <CompareAtPrice
                  className={'opacity-50'}
                  data={compareAtPrice}
                />
              )}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareAtPrice({data, className}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
