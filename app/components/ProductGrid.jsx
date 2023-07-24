import {useFetcher} from '@remix-run/react';
import {useEffect, useState} from 'react';

import {getImageLoadingPriority} from '~/lib/const';
import {Button, Grid, ProductCard, Link, ProductCard2} from '~/components';

export function ProductGrid({url, collection, viewOne, viewTwo, ...props}) {
  const [initialProducts, setInitialProducts] = useState(
    collection?.products?.nodes || [],
  );
  const [nextPage, setNextPage] = useState(
    collection?.products?.pageInfo?.hasNextPage,
  );
  const [endCursor, setEndCursor] = useState(
    collection?.products?.pageInfo?.endCursor,
  );
  const [products, setProducts] = useState(initialProducts);

  // props have changes, reset component state
  const productProps = collection?.products?.nodes || [];
  if (initialProducts !== productProps) {
    setInitialProducts(productProps);
    setProducts(productProps);
  }

  const fetcher = useFetcher();

  function fetchMoreProducts() {
    if (!endCursor) return;
    const url = new URL(window.location.href);
    url.searchParams.set('cursor', endCursor);
    fetcher.load(url.pathname + url.search);
  }

  useEffect(() => {
    if (!fetcher.data) return;

    const {products, collection} = fetcher.data;
    const pageProducts = collection?.products || products;

    if (!pageProducts) return;

    setProducts((prev) => [...prev, ...pageProducts.nodes]);
    setNextPage(products.pageInfo.hasNextPage);
    setEndCursor(products.pageInfo.endCursor);
  }, [fetcher.data]);

  const haveProducts = initialProducts.length > 0;
  if (!haveProducts) {
    return (
      <>
        <p>No products found on this collection</p>
        <Link to="/products">
          <p className="underline">Browse catalog</p>
        </Link>
      </>
    );
  }

  return (
    <>
      {/* <Grid layout="products" {...props}> */}

      <div>
        <div className="bg-white">
          <div className="mx-auto p-4 sm:p-6 lg:p-8">
            {/* <div className="group relative"> */}
            {/* <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
                    alt="Front of men&#039;s Basic Tee in black."
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="#">
                        <span
                          aria-hidden="true"
                          className="absolute inset-0"
                        ></span>
                        Basic Tee
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Black</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">$35</p>
                </div> */}
            {viewOne && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 xl:gap-x-8">
                {products.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    loading={getImageLoadingPriority(i)}
                  />
                ))}
              </div>
            )}
            {viewTwo && (
              <div className="grid 2xl:grid-cols-2 gap-5">
                {products.map((product, i) => (
                  <ProductCard2
                    key={product.id}
                    product={product}
                    loading={getImageLoadingPriority(i)}
                  />
                ))}
              </div>
            )}
            {/* </div> */}
          </div>
        </div>
      </div>

      {/* {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            loading={getImageLoadingPriority(i)}
          />
        ))} */}
      {/* </Grid> */}

      {nextPage && (
        <div className="flex items-center justify-center mt-6">
          <Button
            disabled={fetcher.state !== 'idle'}
            variant="secondary"
            onClick={fetchMoreProducts}
            width="full"
            prefetch="intent"
          >
            {fetcher.state !== 'idle' ? 'Loading...' : 'Load more products'}
          </Button>
        </div>
      )}
    </>
  );
}
