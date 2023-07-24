import {useRef, Suspense, useMemo, useState, useEffect} from 'react';
import {Disclosure, Listbox} from '@headlessui/react';
import {defer} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Await,
  useSearchParams,
  useLocation,
  useNavigation,
} from '@remix-run/react';
import {AnalyticsPageType, Money, ShopPayButton} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';

import {
  Heading,
  IconCaret,
  IconCheck,
  IconClose,
  ProductGallery,
  ProductSwimlane,
  Section,
  Skeleton,
  Text,
  Link,
  AddToCartButton,
  Button,
  CustomModal,
  RelatedProducts,
} from '~/components';
import {getExcerpt} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders, CACHE_SHORT} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({params, request, context}) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const searchParams = new URL(request.url).searchParams;

  const selectedOptions = [];
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return defer(
    {
      product,
      shop,
      storeDomain: shop.primaryDomain.url,
      recommended,
      analytics: {
        pageType: AnalyticsPageType.product,
        resourceId: product.id,
        products: [productAnalytics],
        totalValue: parseFloat(selectedVariant.price.amount),
      },
      seo,
    },
    {
      headers: {
        'Cache-Control': CACHE_SHORT,
      },
    },
  );
}

export default function Product() {
  const {product, shop, recommended} = useLoaderData();
  const {media, title, vendor, descriptionHtml} = product;
  const {shippingPolicy, refundPolicy} = shop;
  const [content, setContent] = useState({content: descriptionHtml});

  return (
    <>
      {/* <Section className="px-0 md:px-8 lg:px-12"> */}
      <div className="w-[95%] md:w-[90%] xl:w-[80%] 2xl:w-[75%] mx-auto py-10">
        <div className="relative grid items-start md:gap-6 lg:gap-8 h-full grid-cols-12">
          <div className="col-span-12 md:col-span-6 h-full">
            <ProductGallery medias={media.nodes} />
          </div>
          <div className="col-span-12 md:col-span-6 sticky top-[140px]">
            <section className="flex flex-col w-full gap-5 p-3 md:mx-auto md:max-w-2xl md:px-0">
              <div className="grid gap-2">
                <h1
                  className="tracking-wide font-semibold text-[#000000d8] text-4xl uppercase"
                  style={{
                    fontFamily: 'Karla-400',
                  }}
                >
                  {title}
                </h1>
                {/* {vendor && (
                  <p
                    className={'opacity-50 text-sm font-medium'}
                    style={{
                      fontFamily: 'Poppins-400',
                    }}
                  >
                    {vendor}
                  </p>
                )} */}
              </div>
              <ProductForm />
              <div className="hidden xl:block">
                <div
                  className="text-[#6C4A6F] text-base max-w-full flex flex-wrap justify-center"
                  style={{
                    fontFamily: 'Poppins-400',
                  }}
                >
                  <button
                    className="mr-4 border-r border-[#6C4A6F] pr-4"
                    onClick={() => setContent({content: descriptionHtml})}
                  >
                    Description
                  </button>
                  <button
                    className="mr-4 border-r border-[#6C4A6F] pr-4"
                    onClick={() =>
                      setContent({
                        content: getExcerpt(shippingPolicy.body),
                        link: `/policies/${shippingPolicy.handle}`,
                      })
                    }
                  >
                    Shipping
                  </button>
                  <button
                    className="mr-4 pr-4"
                    onClick={() =>
                      setContent({
                        content: getExcerpt(refundPolicy.body),
                        link: `/policies/${refundPolicy.handle}`,
                      })
                    }
                  >
                    Return
                  </button>
                </div>
                <div className="py-4">
                  <div
                    className="text-base"
                    style={{
                      fontFamily: 'Poppins-400',
                    }}
                    dangerouslySetInnerHTML={{__html: content.content}}
                  />
                  {content.link && (
                    <Link className="text-sm text-[#6C4A6F]" to={content.link}>
                      Learn more?
                    </Link>
                  )}
                </div>
              </div>
              <div className="block xl:hidden">
                <div className="grid gap-4 py-4">
                  {descriptionHtml && (
                    <ProductDetail
                      title="Description"
                      content={descriptionHtml}
                    />
                  )}
                  {shippingPolicy?.body && (
                    <ProductDetail
                      title="Shipping"
                      content={getExcerpt(shippingPolicy.body)}
                      learnMore={`/policies/${shippingPolicy.handle}`}
                    />
                  )}
                  {refundPolicy?.body && (
                    <ProductDetail
                      title="Return"
                      content={getExcerpt(refundPolicy.body)}
                      learnMore={`/policies/${refundPolicy.handle}`}
                    />
                  )}
                </div>
              </div>
              <div
                className="flex gap-1"
                style={{
                  fontFamily: 'Poppins-400',
                }}
              >
                <p>want it custom made?</p>

                <div>
                  <CustomModal title="Reach us out" className="underline">
                    <p>This goes in the modal</p>
                  </CustomModal>
                  {/* <div>
                  <div className="">
                    <button
                      className="border px-2 text-[#6C4A6F] flex gap-2 items-center"
                      onClick={openModal}
                    >
                      <span>
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_228_351)">
                            <path
                              d="M19.5387 7.42369H10.1496V6.45725C10.1496 6.45627 10.1494 6.4553 10.1494 6.45428C10.1494 6.45319 10.1495 6.45213 10.1495 6.451C10.1495 5.14889 7.51889 4.55585 5.07476 4.55585C2.63062 4.55585 0 5.14893 0 6.45104C0 6.45241 0.00015625 6.45377 0.00015625 6.45514C0.00015625 6.45584 7.81248e-05 6.45659 7.81248e-05 6.45725V13.5427C7.81248e-05 13.5438 7.81248e-05 13.545 7.81248e-05 13.5461C7.81248e-05 13.5471 7.81248e-05 13.5481 7.81248e-05 13.549C7.81248e-05 14.8511 2.63066 15.4441 5.07479 15.4441H6.80315H8.44053H11.5135H13.1508H16.2238H17.8611H19.5388C19.7935 15.4441 20 15.2376 20 14.9829V7.88494C20 7.63022 19.7935 7.42369 19.5387 7.42369ZM4.61355 14.5143C4.0853 14.4976 3.57777 14.452 3.11038 14.3805V12.5145C3.11038 12.2598 2.9039 12.0533 2.64917 12.0533C2.39445 12.0533 2.18796 12.2598 2.18796 12.5145V14.1908C2.12578 14.1742 2.06449 14.1572 2.00503 14.1393C1.14972 13.8831 0.932498 13.6075 0.922654 13.5502C0.922654 13.5493 0.922654 13.5485 0.922693 13.5477C0.922733 13.541 0.922693 13.5343 0.922459 13.5276V7.60295C1.66894 7.98705 2.78566 8.21666 3.95851 8.30463C3.95886 8.30463 3.95925 8.30467 3.95956 8.30471C4.00034 8.30775 4.04112 8.31064 4.08202 8.31334C4.0878 8.31377 4.09359 8.31412 4.09941 8.31451C4.13487 8.31682 4.17034 8.319 4.20589 8.32107C4.2146 8.32158 4.22331 8.32209 4.23202 8.32256C4.26515 8.32439 4.29831 8.32615 4.33148 8.32775C4.34136 8.32826 4.35116 8.32877 4.36101 8.32924C4.39421 8.3308 4.42745 8.33225 4.46069 8.33357C4.4698 8.33393 4.4789 8.33436 4.488 8.33475C4.52937 8.33635 4.57077 8.33783 4.61218 8.33908C4.61265 8.33908 4.61312 8.33912 4.61355 8.33912V14.5143ZM5.07472 7.42361C4.21624 7.42361 3.39495 7.34877 2.69222 7.20955C2.44769 7.16112 2.21726 7.10498 2.00496 7.04135C1.1434 6.78307 0.929412 6.50526 0.922693 6.45084C0.922693 6.45069 0.922693 6.45061 0.922693 6.45049C0.931717 6.3935 1.14801 6.11745 2.00492 5.86057C2.8273 5.61405 3.91749 5.47831 5.07476 5.47831C6.23202 5.47831 7.32229 5.61405 8.14459 5.86057C9.00045 6.11709 9.21729 6.39284 9.22682 6.45034V6.45037C9.22002 6.5053 9.00611 6.78307 8.14455 7.04135C7.90987 7.1117 7.65276 7.17272 7.37909 7.2244C6.69385 7.35393 5.90171 7.42361 5.07472 7.42361ZM7.9792 14.5216H7.26428V11.0813H7.9792V14.5216ZM12.6895 14.5216H11.9746V11.0813H12.6895V14.5216ZM17.3998 14.5216H16.6849V11.0813H17.3998V14.5216ZM19.0775 14.5216H18.3223V10.62C18.3223 10.3653 18.1157 10.1588 17.8611 10.1588H16.2237C15.969 10.1588 15.7625 10.3653 15.7625 10.62V14.5216H15.1456V12.9758C15.1456 12.7211 14.9391 12.5146 14.6844 12.5146C14.4297 12.5146 14.2232 12.7211 14.2232 12.9758V14.5216H13.612V10.62C13.612 10.3653 13.4055 10.1588 13.1508 10.1588H11.5135C11.2588 10.1588 11.0522 10.3653 11.0522 10.62V14.5216H10.4411V12.9758C10.4411 12.7211 10.2346 12.5146 9.9799 12.5146C9.72518 12.5146 9.51869 12.7211 9.51869 12.9758V14.5216H8.90178V10.62C8.90178 10.3653 8.6953 10.1588 8.44057 10.1588H6.80319C6.54846 10.1588 6.34198 10.3653 6.34198 10.62V14.5216H5.53612V8.34615H9.68826C9.68842 8.34615 9.68853 8.34615 9.68873 8.34615H19.0775V14.5216Z"
                              fill="#6C4A6F"
                            />
                            <path
                              d="M10.3057 11.266C10.2845 11.2448 10.261 11.2254 10.2356 11.2088C10.2107 11.1922 10.184 11.1779 10.1562 11.1664C10.1282 11.1549 10.0991 11.1461 10.07 11.1401C9.92023 11.1097 9.76066 11.159 9.65359 11.2661C9.56781 11.3518 9.51843 11.4708 9.51843 11.5922C9.51843 11.6221 9.52168 11.6526 9.52765 11.6821C9.53363 11.7116 9.54242 11.7407 9.55394 11.7688C9.56546 11.7965 9.57976 11.8232 9.59636 11.8481C9.61296 11.8735 9.63234 11.897 9.65355 11.9183C9.73933 12.004 9.85832 12.0534 9.97964 12.0534C10.0096 12.0534 10.0401 12.0502 10.07 12.0442C10.0991 12.0386 10.1282 12.0294 10.1562 12.0179C10.184 12.0064 10.2107 11.9926 10.2356 11.9755C10.261 11.9589 10.2845 11.9395 10.3057 11.9183C10.3269 11.8971 10.3463 11.8736 10.3634 11.8482C10.38 11.8233 10.3943 11.7965 10.4058 11.7688C10.4173 11.7407 10.4261 11.7117 10.4321 11.6821C10.4381 11.6526 10.4408 11.6222 10.4408 11.5922C10.4409 11.4708 10.3916 11.3518 10.3057 11.266Z"
                              fill="#6C4A6F"
                            />
                            <path
                              d="M2.97543 10.8048C2.95422 10.7836 2.93024 10.7642 2.90531 10.7476C2.87996 10.731 2.8532 10.7167 2.82551 10.7052C2.79785 10.6937 2.76879 10.6849 2.73926 10.6789C2.67977 10.6669 2.6184 10.6669 2.55891 10.6789C2.52938 10.6849 2.50031 10.6937 2.47266 10.7052C2.445 10.7167 2.41824 10.731 2.39285 10.7476C2.36793 10.7642 2.34395 10.7836 2.32274 10.8048C2.23696 10.8906 2.18805 11.0096 2.18805 11.1309C2.18805 11.1608 2.19082 11.1913 2.1968 11.2208C2.20278 11.2503 2.21156 11.2794 2.22309 11.3075C2.23461 11.3352 2.24891 11.3619 2.26551 11.3869C2.28211 11.4122 2.30149 11.4358 2.3227 11.457C2.34438 11.4782 2.36789 11.4976 2.39281 11.5142C2.41817 11.5308 2.44492 11.5451 2.47262 11.5566C2.50028 11.5681 2.52934 11.5773 2.55887 11.5829C2.58887 11.5889 2.61883 11.5921 2.64926 11.5921C2.67926 11.5921 2.70922 11.5888 2.73918 11.5829C2.76871 11.5773 2.79777 11.5681 2.82543 11.5566C2.85309 11.5451 2.87984 11.5308 2.90524 11.5142C2.93016 11.4976 2.95414 11.4782 2.97535 11.457C2.99656 11.4358 3.01594 11.4122 3.03254 11.3869C3.04914 11.3619 3.06344 11.3352 3.07496 11.3075C3.08649 11.2794 3.09527 11.2503 3.10125 11.2208C3.10723 11.1913 3.11 11.1608 3.11 11.1309C3.11012 11.0096 3.06121 10.8906 2.97543 10.8048Z"
                              fill="#6C4A6F"
                            />
                            <path
                              d="M15.1367 11.5022C15.1308 11.4726 15.122 11.4436 15.1104 11.4159C15.0989 11.3878 15.0846 11.361 15.068 11.3361C15.051 11.3108 15.0316 11.2872 15.0104 11.266C14.9892 11.2448 14.9656 11.2254 14.9402 11.2088C14.9153 11.1922 14.8886 11.1779 14.8609 11.1664C14.8328 11.1549 14.8037 11.1456 14.7746 11.1401C14.7151 11.1281 14.6538 11.1281 14.5943 11.1401C14.5647 11.1456 14.5357 11.1549 14.5081 11.1664C14.4799 11.1779 14.4532 11.1922 14.4283 11.2088C14.4029 11.2254 14.3794 11.2448 14.3581 11.266C14.3369 11.2872 14.3175 11.3107 14.301 11.3361C14.2844 11.361 14.2701 11.3878 14.2585 11.4159C14.247 11.4436 14.2382 11.4726 14.2322 11.5022C14.2263 11.5317 14.223 11.5621 14.223 11.5921C14.223 11.6221 14.2263 11.6525 14.2322 11.682C14.2382 11.7115 14.247 11.7406 14.2585 11.7687C14.2701 11.7964 14.2844 11.8231 14.301 11.8481C14.3175 11.8734 14.3369 11.897 14.3581 11.9182C14.3794 11.9394 14.4029 11.9588 14.4283 11.9754C14.4532 11.992 14.4799 12.0063 14.5081 12.0178C14.5357 12.0293 14.5647 12.0385 14.5943 12.0441C14.6238 12.0501 14.6543 12.0533 14.6842 12.0533C14.7142 12.0533 14.7447 12.0501 14.7746 12.0441C14.8036 12.0385 14.8327 12.0293 14.8608 12.0178C14.8886 12.0063 14.9152 11.992 14.9402 11.9754C14.9656 11.9588 14.9891 11.9394 15.0103 11.9182C15.0315 11.897 15.0509 11.8735 15.068 11.8481C15.0846 11.8231 15.0989 11.7964 15.1104 11.7687C15.1219 11.7406 15.1307 11.7115 15.1367 11.682C15.1427 11.6525 15.1454 11.622 15.1454 11.5921C15.1454 11.5621 15.1427 11.5317 15.1367 11.5022Z"
                              fill="#6C4A6F"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_228_351">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>
                      <span
                        className="text-base tracking-wide"
                        style={{
                          fontFamily: 'Karla-400',
                        }}
                      >
                        Size Guide
                      </span>
                    </button>
                  </div>
                  <div
                    className={`fixed z-10 overflow-y-auto top-0 w-full left-0 ${
                      !showModal && 'hidden'
                    }`}
                    id="modal"
                  >
                    <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                      <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-900 opacity-75" />
                      </div>
                      <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                        &#8203;
                      </span>
                      <div
                        className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                      >
                        <div className="bg-gray-200 px-4 py-3 text-right">
                          <button
                            type="button"
                            className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* </Section> */}

      {/* RELATED PRODUCTS */}
      <Suspense fallback={<Skeleton className="h-32" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => <RelatedProducts products={products} />}
        </Await>
      </Suspense>
    </>
  );
}

export function ProductForm() {
  const {product, analytics, storeDomain} = useLoaderData();
  const [quantity, setQuantity] = useState(1);
  const [currentSearchParams] = useSearchParams();
  const {location} = useNavigation();
  const btnRef = useRef(null);

  /**
   * We update `searchParams` with in-flight request data from `location` (if available)
   * to create an optimistic UI, e.g. check the product option before the
   * request has completed.
   */
  const searchParams = useMemo(() => {
    return location
      ? new URLSearchParams(location.search)
      : currentSearchParams;
  }, [currentSearchParams, location]);

  const firstVariant = product.variants.nodes[0];

  /**
   * We're making an explicit choice here to display the product options
   * UI with a default variant, rather than wait for the user to select
   * options first. Developers are welcome to opt-out of this behavior.
   * By default, the first variant's options are used.
   */
  const searchParamsWithDefaults = useMemo(() => {
    const clonedParams = new URLSearchParams(searchParams);

    for (const {name, value} of firstVariant.selectedOptions) {
      if (!searchParams.has(name)) {
        clonedParams.set(name, value);
      }
    }

    return clonedParams;
  }, [searchParams, firstVariant.selectedOptions]);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant ?? firstVariant;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;
  const productAnalytics = {
    ...analytics.products[0],
    quantity: 1,
  };
  const cartPrice = {
    ...selectedVariant?.price,
    amount: String(selectedVariant?.price.amount * quantity),
  };
  const decreaseQuantity = () => {
    if (quantity < 2) return;
    setQuantity((prev) => prev - 1);
  };
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // const handleCheckout = () => {
  //   console.log(btnRef.current.click);
  //   btnRef.current.click();
  // };

  return (
    <div className="grid gap-10">
      {/* <Money data={productAnalytics.price} withoutTrailingZeros /> */}
      <div className="grid gap-4">
        <p
          className="text-[#6C4A6F] font-semibold text-3xl"
          style={{
            fontFamily: 'Karla-400',
          }}
        >
          <Money withoutTrailingZeros data={selectedVariant?.price} />
        </p>

        <ProductOptions
          options={product.options}
          searchParamsWithDefaults={searchParamsWithDefaults}
        />
        {selectedVariant && (
          <div className="grid items-stretch gap-4">
            {isOutOfStock ? (
              <Button variant="secondary" disabled>
                <Text>Sold out</Text>
              </Button>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div
                  className="border-[2px] min-w-fit col-span-1 border-[#6C4A6F] text-base text-[#6C4A6F] flex items-center justify-between"
                  style={{
                    fontFamily: 'Karla-400',
                  }}
                >
                  <button onClick={decreaseQuantity} className="py-1 px-2">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 20 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 9.5H15"
                        stroke="#6C4A6F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <span>{quantity}</span>
                  <button onClick={increaseQuantity} className="py-1 px-2">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.5 4.75V14.25"
                        stroke="#6C4A6F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.75 9.5H14.25"
                        stroke="#6C4A6F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="col-span-2">
                  <a
                    href="#"
                    // to={`/collections/${collection.handle}`}
                    className="animated-button-two thar-three-two text-center z-[9] uppercase"
                    style={{
                      fontFamily: 'Poppins-400',
                      fontSize: '14px',
                      padding: '14px 18px',
                      // border: '1px solid #6C4A6F',
                    }}
                  >
                    <AddToCartButton
                      lines={[
                        {
                          merchandiseId: selectedVariant.id,
                          quantity,
                        },
                      ]}
                      variant=""
                      className="uppercase"
                      data-test="add-to-cart"
                      analytics={{
                        products: [productAnalytics],
                        totalValue: parseFloat(productAnalytics.price),
                      }}
                    >
                      <span>Add to Cart</span>
                      {/* <Money
                          withoutTrailingZeros
                          data={cartPrice}
                          as="span"
                        />
                        {isOnSale && (
                          <Money
                            withoutTrailingZeros
                            data={selectedVariant?.compareAtPrice}
                            as="span"
                            className="opacity-50 strike"
                          />
                        )} */}
                    </AddToCartButton>
                  </a>
                </div>
              </div>
            )}
            {/* {!isOutOfStock && (
              <button className="w-full " ref={btnRef}>
                <ShopPayButton
                  width="100%"
                  className="bg-black text-white"
                  variantIds={[selectedVariant?.id]}
                  storeDomain={storeDomain}
                >
                  Buy now
                </ShopPayButton>
              </button>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductOptions({options, searchParamsWithDefaults}) {
  const closeRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      {options
        .filter((option) => option.values.length > 1)
        .map((option, i) => (
          <div
            key={option.name}
            className="flex flex-col flex-wrap mb-4 gap-y-4 last:mb-0"
            style={{
              fontFamily: 'Karla-400',
            }}
          >
            <div className="flex justify-between flex-wrap">
              <h1 className="min-w-[4rem] text-base font-medium">
                {option.name}:
              </h1>
              {i == 0 && (
                // SIZE CHART DIV
                // <div>
                //   <div className="">
                //     <button
                //       className="border px-2 text-[#6C4A6F] flex gap-2 items-center"
                //       onClick={openModal}
                //     >
                //       <span>
                //         <svg
                //           width="25"
                //           height="25"
                //           viewBox="0 0 20 20"
                //           fill="none"
                //           xmlns="http://www.w3.org/2000/svg"
                //         >
                //           <g clipPath="url(#clip0_228_351)">
                //             <path
                //               d="M19.5387 7.42369H10.1496V6.45725C10.1496 6.45627 10.1494 6.4553 10.1494 6.45428C10.1494 6.45319 10.1495 6.45213 10.1495 6.451C10.1495 5.14889 7.51889 4.55585 5.07476 4.55585C2.63062 4.55585 0 5.14893 0 6.45104C0 6.45241 0.00015625 6.45377 0.00015625 6.45514C0.00015625 6.45584 7.81248e-05 6.45659 7.81248e-05 6.45725V13.5427C7.81248e-05 13.5438 7.81248e-05 13.545 7.81248e-05 13.5461C7.81248e-05 13.5471 7.81248e-05 13.5481 7.81248e-05 13.549C7.81248e-05 14.8511 2.63066 15.4441 5.07479 15.4441H6.80315H8.44053H11.5135H13.1508H16.2238H17.8611H19.5388C19.7935 15.4441 20 15.2376 20 14.9829V7.88494C20 7.63022 19.7935 7.42369 19.5387 7.42369ZM4.61355 14.5143C4.0853 14.4976 3.57777 14.452 3.11038 14.3805V12.5145C3.11038 12.2598 2.9039 12.0533 2.64917 12.0533C2.39445 12.0533 2.18796 12.2598 2.18796 12.5145V14.1908C2.12578 14.1742 2.06449 14.1572 2.00503 14.1393C1.14972 13.8831 0.932498 13.6075 0.922654 13.5502C0.922654 13.5493 0.922654 13.5485 0.922693 13.5477C0.922733 13.541 0.922693 13.5343 0.922459 13.5276V7.60295C1.66894 7.98705 2.78566 8.21666 3.95851 8.30463C3.95886 8.30463 3.95925 8.30467 3.95956 8.30471C4.00034 8.30775 4.04112 8.31064 4.08202 8.31334C4.0878 8.31377 4.09359 8.31412 4.09941 8.31451C4.13487 8.31682 4.17034 8.319 4.20589 8.32107C4.2146 8.32158 4.22331 8.32209 4.23202 8.32256C4.26515 8.32439 4.29831 8.32615 4.33148 8.32775C4.34136 8.32826 4.35116 8.32877 4.36101 8.32924C4.39421 8.3308 4.42745 8.33225 4.46069 8.33357C4.4698 8.33393 4.4789 8.33436 4.488 8.33475C4.52937 8.33635 4.57077 8.33783 4.61218 8.33908C4.61265 8.33908 4.61312 8.33912 4.61355 8.33912V14.5143ZM5.07472 7.42361C4.21624 7.42361 3.39495 7.34877 2.69222 7.20955C2.44769 7.16112 2.21726 7.10498 2.00496 7.04135C1.1434 6.78307 0.929412 6.50526 0.922693 6.45084C0.922693 6.45069 0.922693 6.45061 0.922693 6.45049C0.931717 6.3935 1.14801 6.11745 2.00492 5.86057C2.8273 5.61405 3.91749 5.47831 5.07476 5.47831C6.23202 5.47831 7.32229 5.61405 8.14459 5.86057C9.00045 6.11709 9.21729 6.39284 9.22682 6.45034V6.45037C9.22002 6.5053 9.00611 6.78307 8.14455 7.04135C7.90987 7.1117 7.65276 7.17272 7.37909 7.2244C6.69385 7.35393 5.90171 7.42361 5.07472 7.42361ZM7.9792 14.5216H7.26428V11.0813H7.9792V14.5216ZM12.6895 14.5216H11.9746V11.0813H12.6895V14.5216ZM17.3998 14.5216H16.6849V11.0813H17.3998V14.5216ZM19.0775 14.5216H18.3223V10.62C18.3223 10.3653 18.1157 10.1588 17.8611 10.1588H16.2237C15.969 10.1588 15.7625 10.3653 15.7625 10.62V14.5216H15.1456V12.9758C15.1456 12.7211 14.9391 12.5146 14.6844 12.5146C14.4297 12.5146 14.2232 12.7211 14.2232 12.9758V14.5216H13.612V10.62C13.612 10.3653 13.4055 10.1588 13.1508 10.1588H11.5135C11.2588 10.1588 11.0522 10.3653 11.0522 10.62V14.5216H10.4411V12.9758C10.4411 12.7211 10.2346 12.5146 9.9799 12.5146C9.72518 12.5146 9.51869 12.7211 9.51869 12.9758V14.5216H8.90178V10.62C8.90178 10.3653 8.6953 10.1588 8.44057 10.1588H6.80319C6.54846 10.1588 6.34198 10.3653 6.34198 10.62V14.5216H5.53612V8.34615H9.68826C9.68842 8.34615 9.68853 8.34615 9.68873 8.34615H19.0775V14.5216Z"
                //               fill="#6C4A6F"
                //             />
                //             <path
                //               d="M10.3057 11.266C10.2845 11.2448 10.261 11.2254 10.2356 11.2088C10.2107 11.1922 10.184 11.1779 10.1562 11.1664C10.1282 11.1549 10.0991 11.1461 10.07 11.1401C9.92023 11.1097 9.76066 11.159 9.65359 11.2661C9.56781 11.3518 9.51843 11.4708 9.51843 11.5922C9.51843 11.6221 9.52168 11.6526 9.52765 11.6821C9.53363 11.7116 9.54242 11.7407 9.55394 11.7688C9.56546 11.7965 9.57976 11.8232 9.59636 11.8481C9.61296 11.8735 9.63234 11.897 9.65355 11.9183C9.73933 12.004 9.85832 12.0534 9.97964 12.0534C10.0096 12.0534 10.0401 12.0502 10.07 12.0442C10.0991 12.0386 10.1282 12.0294 10.1562 12.0179C10.184 12.0064 10.2107 11.9926 10.2356 11.9755C10.261 11.9589 10.2845 11.9395 10.3057 11.9183C10.3269 11.8971 10.3463 11.8736 10.3634 11.8482C10.38 11.8233 10.3943 11.7965 10.4058 11.7688C10.4173 11.7407 10.4261 11.7117 10.4321 11.6821C10.4381 11.6526 10.4408 11.6222 10.4408 11.5922C10.4409 11.4708 10.3916 11.3518 10.3057 11.266Z"
                //               fill="#6C4A6F"
                //             />
                //             <path
                //               d="M2.97543 10.8048C2.95422 10.7836 2.93024 10.7642 2.90531 10.7476C2.87996 10.731 2.8532 10.7167 2.82551 10.7052C2.79785 10.6937 2.76879 10.6849 2.73926 10.6789C2.67977 10.6669 2.6184 10.6669 2.55891 10.6789C2.52938 10.6849 2.50031 10.6937 2.47266 10.7052C2.445 10.7167 2.41824 10.731 2.39285 10.7476C2.36793 10.7642 2.34395 10.7836 2.32274 10.8048C2.23696 10.8906 2.18805 11.0096 2.18805 11.1309C2.18805 11.1608 2.19082 11.1913 2.1968 11.2208C2.20278 11.2503 2.21156 11.2794 2.22309 11.3075C2.23461 11.3352 2.24891 11.3619 2.26551 11.3869C2.28211 11.4122 2.30149 11.4358 2.3227 11.457C2.34438 11.4782 2.36789 11.4976 2.39281 11.5142C2.41817 11.5308 2.44492 11.5451 2.47262 11.5566C2.50028 11.5681 2.52934 11.5773 2.55887 11.5829C2.58887 11.5889 2.61883 11.5921 2.64926 11.5921C2.67926 11.5921 2.70922 11.5888 2.73918 11.5829C2.76871 11.5773 2.79777 11.5681 2.82543 11.5566C2.85309 11.5451 2.87984 11.5308 2.90524 11.5142C2.93016 11.4976 2.95414 11.4782 2.97535 11.457C2.99656 11.4358 3.01594 11.4122 3.03254 11.3869C3.04914 11.3619 3.06344 11.3352 3.07496 11.3075C3.08649 11.2794 3.09527 11.2503 3.10125 11.2208C3.10723 11.1913 3.11 11.1608 3.11 11.1309C3.11012 11.0096 3.06121 10.8906 2.97543 10.8048Z"
                //               fill="#6C4A6F"
                //             />
                //             <path
                //               d="M15.1367 11.5022C15.1308 11.4726 15.122 11.4436 15.1104 11.4159C15.0989 11.3878 15.0846 11.361 15.068 11.3361C15.051 11.3108 15.0316 11.2872 15.0104 11.266C14.9892 11.2448 14.9656 11.2254 14.9402 11.2088C14.9153 11.1922 14.8886 11.1779 14.8609 11.1664C14.8328 11.1549 14.8037 11.1456 14.7746 11.1401C14.7151 11.1281 14.6538 11.1281 14.5943 11.1401C14.5647 11.1456 14.5357 11.1549 14.5081 11.1664C14.4799 11.1779 14.4532 11.1922 14.4283 11.2088C14.4029 11.2254 14.3794 11.2448 14.3581 11.266C14.3369 11.2872 14.3175 11.3107 14.301 11.3361C14.2844 11.361 14.2701 11.3878 14.2585 11.4159C14.247 11.4436 14.2382 11.4726 14.2322 11.5022C14.2263 11.5317 14.223 11.5621 14.223 11.5921C14.223 11.6221 14.2263 11.6525 14.2322 11.682C14.2382 11.7115 14.247 11.7406 14.2585 11.7687C14.2701 11.7964 14.2844 11.8231 14.301 11.8481C14.3175 11.8734 14.3369 11.897 14.3581 11.9182C14.3794 11.9394 14.4029 11.9588 14.4283 11.9754C14.4532 11.992 14.4799 12.0063 14.5081 12.0178C14.5357 12.0293 14.5647 12.0385 14.5943 12.0441C14.6238 12.0501 14.6543 12.0533 14.6842 12.0533C14.7142 12.0533 14.7447 12.0501 14.7746 12.0441C14.8036 12.0385 14.8327 12.0293 14.8608 12.0178C14.8886 12.0063 14.9152 11.992 14.9402 11.9754C14.9656 11.9588 14.9891 11.9394 15.0103 11.9182C15.0315 11.897 15.0509 11.8735 15.068 11.8481C15.0846 11.8231 15.0989 11.7964 15.1104 11.7687C15.1219 11.7406 15.1307 11.7115 15.1367 11.682C15.1427 11.6525 15.1454 11.622 15.1454 11.5921C15.1454 11.5621 15.1427 11.5317 15.1367 11.5022Z"
                //               fill="#6C4A6F"
                //             />
                //           </g>
                //           <defs>
                //             <clipPath id="clip0_228_351">
                //               <rect width="20" height="20" fill="white" />
                //             </clipPath>
                //           </defs>
                //         </svg>
                //       </span>
                //       <span
                //         className="text-base tracking-wide"
                //         style={{
                //           fontFamily: 'Karla-400',
                //         }}
                //       >
                //         Size Guide
                //       </span>
                //     </button>
                //   </div>
                //   <div
                //     className={`fixed z-10 overflow-y-auto top-0 w-full left-0 ${
                //       !showModal && 'hidden'
                //     }`}
                //     id="modal"
                //   >
                //     <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                //       <div className="fixed inset-0 transition-opacity">
                //         <div className="absolute inset-0 bg-gray-900 opacity-75" />
                //       </div>
                //       <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                //         &#8203;
                //       </span>
                //       <div
                //         className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                //         role="dialog"
                //         aria-modal="true"
                //         aria-labelledby="modal-headline"
                //       >
                //         <div className="bg-gray-200 px-4 py-3 text-right">
                //           <button
                //             type="button"
                //             className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
                //             onClick={closeModal}
                //           >
                //             Cancel
                //           </button>
                //         </div>
                //       </div>
                //     </div>
                //   </div>
                // </div>
                <div>
                  <CustomModal
                    title="Size Guide"
                    svg={
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_228_351)">
                          <path
                            d="M19.5387 7.42369H10.1496V6.45725C10.1496 6.45627 10.1494 6.4553 10.1494 6.45428C10.1494 6.45319 10.1495 6.45213 10.1495 6.451C10.1495 5.14889 7.51889 4.55585 5.07476 4.55585C2.63062 4.55585 0 5.14893 0 6.45104C0 6.45241 0.00015625 6.45377 0.00015625 6.45514C0.00015625 6.45584 7.81248e-05 6.45659 7.81248e-05 6.45725V13.5427C7.81248e-05 13.5438 7.81248e-05 13.545 7.81248e-05 13.5461C7.81248e-05 13.5471 7.81248e-05 13.5481 7.81248e-05 13.549C7.81248e-05 14.8511 2.63066 15.4441 5.07479 15.4441H6.80315H8.44053H11.5135H13.1508H16.2238H17.8611H19.5388C19.7935 15.4441 20 15.2376 20 14.9829V7.88494C20 7.63022 19.7935 7.42369 19.5387 7.42369ZM4.61355 14.5143C4.0853 14.4976 3.57777 14.452 3.11038 14.3805V12.5145C3.11038 12.2598 2.9039 12.0533 2.64917 12.0533C2.39445 12.0533 2.18796 12.2598 2.18796 12.5145V14.1908C2.12578 14.1742 2.06449 14.1572 2.00503 14.1393C1.14972 13.8831 0.932498 13.6075 0.922654 13.5502C0.922654 13.5493 0.922654 13.5485 0.922693 13.5477C0.922733 13.541 0.922693 13.5343 0.922459 13.5276V7.60295C1.66894 7.98705 2.78566 8.21666 3.95851 8.30463C3.95886 8.30463 3.95925 8.30467 3.95956 8.30471C4.00034 8.30775 4.04112 8.31064 4.08202 8.31334C4.0878 8.31377 4.09359 8.31412 4.09941 8.31451C4.13487 8.31682 4.17034 8.319 4.20589 8.32107C4.2146 8.32158 4.22331 8.32209 4.23202 8.32256C4.26515 8.32439 4.29831 8.32615 4.33148 8.32775C4.34136 8.32826 4.35116 8.32877 4.36101 8.32924C4.39421 8.3308 4.42745 8.33225 4.46069 8.33357C4.4698 8.33393 4.4789 8.33436 4.488 8.33475C4.52937 8.33635 4.57077 8.33783 4.61218 8.33908C4.61265 8.33908 4.61312 8.33912 4.61355 8.33912V14.5143ZM5.07472 7.42361C4.21624 7.42361 3.39495 7.34877 2.69222 7.20955C2.44769 7.16112 2.21726 7.10498 2.00496 7.04135C1.1434 6.78307 0.929412 6.50526 0.922693 6.45084C0.922693 6.45069 0.922693 6.45061 0.922693 6.45049C0.931717 6.3935 1.14801 6.11745 2.00492 5.86057C2.8273 5.61405 3.91749 5.47831 5.07476 5.47831C6.23202 5.47831 7.32229 5.61405 8.14459 5.86057C9.00045 6.11709 9.21729 6.39284 9.22682 6.45034V6.45037C9.22002 6.5053 9.00611 6.78307 8.14455 7.04135C7.90987 7.1117 7.65276 7.17272 7.37909 7.2244C6.69385 7.35393 5.90171 7.42361 5.07472 7.42361ZM7.9792 14.5216H7.26428V11.0813H7.9792V14.5216ZM12.6895 14.5216H11.9746V11.0813H12.6895V14.5216ZM17.3998 14.5216H16.6849V11.0813H17.3998V14.5216ZM19.0775 14.5216H18.3223V10.62C18.3223 10.3653 18.1157 10.1588 17.8611 10.1588H16.2237C15.969 10.1588 15.7625 10.3653 15.7625 10.62V14.5216H15.1456V12.9758C15.1456 12.7211 14.9391 12.5146 14.6844 12.5146C14.4297 12.5146 14.2232 12.7211 14.2232 12.9758V14.5216H13.612V10.62C13.612 10.3653 13.4055 10.1588 13.1508 10.1588H11.5135C11.2588 10.1588 11.0522 10.3653 11.0522 10.62V14.5216H10.4411V12.9758C10.4411 12.7211 10.2346 12.5146 9.9799 12.5146C9.72518 12.5146 9.51869 12.7211 9.51869 12.9758V14.5216H8.90178V10.62C8.90178 10.3653 8.6953 10.1588 8.44057 10.1588H6.80319C6.54846 10.1588 6.34198 10.3653 6.34198 10.62V14.5216H5.53612V8.34615H9.68826C9.68842 8.34615 9.68853 8.34615 9.68873 8.34615H19.0775V14.5216Z"
                            fill="#6C4A6F"
                          />
                          <path
                            d="M10.3057 11.266C10.2845 11.2448 10.261 11.2254 10.2356 11.2088C10.2107 11.1922 10.184 11.1779 10.1562 11.1664C10.1282 11.1549 10.0991 11.1461 10.07 11.1401C9.92023 11.1097 9.76066 11.159 9.65359 11.2661C9.56781 11.3518 9.51843 11.4708 9.51843 11.5922C9.51843 11.6221 9.52168 11.6526 9.52765 11.6821C9.53363 11.7116 9.54242 11.7407 9.55394 11.7688C9.56546 11.7965 9.57976 11.8232 9.59636 11.8481C9.61296 11.8735 9.63234 11.897 9.65355 11.9183C9.73933 12.004 9.85832 12.0534 9.97964 12.0534C10.0096 12.0534 10.0401 12.0502 10.07 12.0442C10.0991 12.0386 10.1282 12.0294 10.1562 12.0179C10.184 12.0064 10.2107 11.9926 10.2356 11.9755C10.261 11.9589 10.2845 11.9395 10.3057 11.9183C10.3269 11.8971 10.3463 11.8736 10.3634 11.8482C10.38 11.8233 10.3943 11.7965 10.4058 11.7688C10.4173 11.7407 10.4261 11.7117 10.4321 11.6821C10.4381 11.6526 10.4408 11.6222 10.4408 11.5922C10.4409 11.4708 10.3916 11.3518 10.3057 11.266Z"
                            fill="#6C4A6F"
                          />
                          <path
                            d="M2.97543 10.8048C2.95422 10.7836 2.93024 10.7642 2.90531 10.7476C2.87996 10.731 2.8532 10.7167 2.82551 10.7052C2.79785 10.6937 2.76879 10.6849 2.73926 10.6789C2.67977 10.6669 2.6184 10.6669 2.55891 10.6789C2.52938 10.6849 2.50031 10.6937 2.47266 10.7052C2.445 10.7167 2.41824 10.731 2.39285 10.7476C2.36793 10.7642 2.34395 10.7836 2.32274 10.8048C2.23696 10.8906 2.18805 11.0096 2.18805 11.1309C2.18805 11.1608 2.19082 11.1913 2.1968 11.2208C2.20278 11.2503 2.21156 11.2794 2.22309 11.3075C2.23461 11.3352 2.24891 11.3619 2.26551 11.3869C2.28211 11.4122 2.30149 11.4358 2.3227 11.457C2.34438 11.4782 2.36789 11.4976 2.39281 11.5142C2.41817 11.5308 2.44492 11.5451 2.47262 11.5566C2.50028 11.5681 2.52934 11.5773 2.55887 11.5829C2.58887 11.5889 2.61883 11.5921 2.64926 11.5921C2.67926 11.5921 2.70922 11.5888 2.73918 11.5829C2.76871 11.5773 2.79777 11.5681 2.82543 11.5566C2.85309 11.5451 2.87984 11.5308 2.90524 11.5142C2.93016 11.4976 2.95414 11.4782 2.97535 11.457C2.99656 11.4358 3.01594 11.4122 3.03254 11.3869C3.04914 11.3619 3.06344 11.3352 3.07496 11.3075C3.08649 11.2794 3.09527 11.2503 3.10125 11.2208C3.10723 11.1913 3.11 11.1608 3.11 11.1309C3.11012 11.0096 3.06121 10.8906 2.97543 10.8048Z"
                            fill="#6C4A6F"
                          />
                          <path
                            d="M15.1367 11.5022C15.1308 11.4726 15.122 11.4436 15.1104 11.4159C15.0989 11.3878 15.0846 11.361 15.068 11.3361C15.051 11.3108 15.0316 11.2872 15.0104 11.266C14.9892 11.2448 14.9656 11.2254 14.9402 11.2088C14.9153 11.1922 14.8886 11.1779 14.8609 11.1664C14.8328 11.1549 14.8037 11.1456 14.7746 11.1401C14.7151 11.1281 14.6538 11.1281 14.5943 11.1401C14.5647 11.1456 14.5357 11.1549 14.5081 11.1664C14.4799 11.1779 14.4532 11.1922 14.4283 11.2088C14.4029 11.2254 14.3794 11.2448 14.3581 11.266C14.3369 11.2872 14.3175 11.3107 14.301 11.3361C14.2844 11.361 14.2701 11.3878 14.2585 11.4159C14.247 11.4436 14.2382 11.4726 14.2322 11.5022C14.2263 11.5317 14.223 11.5621 14.223 11.5921C14.223 11.6221 14.2263 11.6525 14.2322 11.682C14.2382 11.7115 14.247 11.7406 14.2585 11.7687C14.2701 11.7964 14.2844 11.8231 14.301 11.8481C14.3175 11.8734 14.3369 11.897 14.3581 11.9182C14.3794 11.9394 14.4029 11.9588 14.4283 11.9754C14.4532 11.992 14.4799 12.0063 14.5081 12.0178C14.5357 12.0293 14.5647 12.0385 14.5943 12.0441C14.6238 12.0501 14.6543 12.0533 14.6842 12.0533C14.7142 12.0533 14.7447 12.0501 14.7746 12.0441C14.8036 12.0385 14.8327 12.0293 14.8608 12.0178C14.8886 12.0063 14.9152 11.992 14.9402 11.9754C14.9656 11.9588 14.9891 11.9394 15.0103 11.9182C15.0315 11.897 15.0509 11.8735 15.068 11.8481C15.0846 11.8231 15.0989 11.7964 15.1104 11.7687C15.1219 11.7406 15.1307 11.7115 15.1367 11.682C15.1427 11.6525 15.1454 11.622 15.1454 11.5921C15.1454 11.5621 15.1427 11.5317 15.1367 11.5022Z"
                            fill="#6C4A6F"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_228_351">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    }
                  >
                    <p>drop the details here</p>
                  </CustomModal>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-baseline gap-4">
              {/**
               * First, we render a bunch of <Link> elements for each option value.
               * When the user clicks one of these buttons, it will hit the loader
               * to get the new data.
               *
               * If there are more than 7 values, we render a dropdown.
               * Otherwise, we just render plain links.
               */}
              {option.values.length > 7 ? (
                <div className="relative w-full">
                  <Listbox>
                    {({open}) => (
                      <>
                        <Listbox.Button
                          ref={closeRef}
                          className={clsx(
                            'flex items-center justify-between w-full py-3 px-4 border border-primary',
                            open
                              ? 'rounded-b md:rounded-t md:rounded-b-none'
                              : 'rounded',
                          )}
                        >
                          <span>
                            {searchParamsWithDefaults.get(option.name)}
                          </span>
                          <IconCaret direction={open ? 'up' : 'down'} />
                        </Listbox.Button>
                        <Listbox.Options
                          className={clsx(
                            'border-primary bg-contrast absolute bottom-12 z-30 grid h-48 w-full overflow-y-scroll rounded-t border px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b',
                            open ? 'max-h-48' : 'max-h-0',
                          )}
                        >
                          {option.values.map((value) => (
                            <Listbox.Option
                              key={`option-${option.name}-${value}`}
                              value={value}
                            >
                              {({active}) => (
                                <ProductOptionLink
                                  optionName={option.name}
                                  optionValue={value}
                                  className={clsx(
                                    'text-primary w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer',
                                    active && 'bg-primary/10',
                                  )}
                                  searchParams={searchParamsWithDefaults}
                                  onClick={() => {
                                    if (!closeRef?.current) return;
                                    closeRef.current.click();
                                  }}
                                >
                                  {value}
                                  {searchParamsWithDefaults.get(option.name) ===
                                    value && (
                                    <span className="ml-2">
                                      <IconCheck />
                                    </span>
                                  )}
                                </ProductOptionLink>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </>
                    )}
                  </Listbox>
                </div>
              ) : (
                <>
                  {option.values.map((value) => {
                    const checked =
                      searchParamsWithDefaults.get(option.name) === value;
                    const id = `option-${option.name}-${value}`;

                    return (
                      <Text key={id}>
                        <ProductOptionLink
                          optionName={option.name}
                          optionValue={value}
                          searchParams={searchParamsWithDefaults}
                          className={clsx(
                            'leading-none py-1 px-2 text-[#6C4A6F] cursor-pointer transition-all duration-200',
                            checked
                              ? 'border-[#6C4A6F] font-medium border-[1.5px]'
                              : 'font-light border-[1.5px]',
                          )}
                        />
                      </Text>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        ))}
    </>
  );
}

function ProductOptionLink({
  optionName,
  optionValue,
  searchParams,
  children,
  ...props
}) {
  const {pathname} = useLocation();
  const isLocalePathname = /\/[a-zA-Z]{2}-[a-zA-Z]{2}\//g.test(pathname);
  // fixes internalized pathname
  const path = isLocalePathname
    ? `/${pathname.split('/').slice(2).join('/')}`
    : pathname;

  const clonedSearchParams = new URLSearchParams(searchParams);
  clonedSearchParams.set(optionName, optionValue);

  return (
    <Link
      {...props}
      preventScrollReset
      prefetch="intent"
      replace
      to={`${path}?${clonedSearchParams.toString()}`}
    >
      {children ?? optionValue}
    </Link>
  );
}

function ProductDetail({title, content, learnMore}) {
  return (
    <Disclosure key={title} as="div" className="grid w-full gap-2">
      {({open}) => (
        <>
          <Disclosure.Button className="text-left  border-b-[#6C4A6F] border-b-[1px]">
            <div className="flex justify-between items-center pb-2">
              <p
                className="text-lg text-[#6C4A6F]"
                style={{
                  fontFamily: 'Karla-400',
                }}
              >
                {title}
              </p>

              <span
                className={clsx(
                  'transition-transform duration-200',
                  open && 'rotate-[180deg]',
                )}
              >
                <svg
                  width="8"
                  height="5"
                  viewBox="0 0 8 5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.94 -3.08602e-07L4 3.09042L7.06 -4.10887e-08L8 0.951417L4 5L-4.15878e-08 0.951417L0.94 -3.08602e-07Z"
                    fill="#6C4A6F"
                  />
                </svg>
              </span>
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'pb-4 pt-2 grid gap-2'}>
            <div
              className="text-sm"
              style={{
                fontFamily: 'Poppins-400',
              }}
              dangerouslySetInnerHTML={{__html: content}}
            />
            {learnMore && (
              <div className="">
                <Link className="text-[#6C4A6F] text-sm" to={learnMore}>
                  Learn more?
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

async function getRecommendedProducts(storefront, productId) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = products.recommended
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts
    .map((item) => item.id)
    .indexOf(productId);

  mergedProducts.splice(originalProduct, 1);

  return mergedProducts;
}
