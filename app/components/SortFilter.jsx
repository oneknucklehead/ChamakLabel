import {useMemo, useState} from 'react';
import {Menu} from '@headlessui/react';
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';
import {useDebounce} from 'react-use';
import {Disclosure} from '@headlessui/react';

import {
  Heading,
  IconFilters,
  IconCaret,
  IconXMark,
  Text,
  Section,
  Drawer,
} from '~/components';

export function SortFilter({
  filters,
  appliedFilters = [],
  children,
  collections = [],
  handleViewOne,
  handleViewTwo,
  viewOne,
  viewTwo,
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className="border-[1px] bg-white z-40 border-l-0 border-r-0 border-[#6C4A6F90] sticky top-[99px]">
        <div className="flex flex-wrap items-center justify-between w-[90%] mx-auto md:w-full ">
          {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className={
            'relative flex items-center justify-center w-8 h-8 focus:ring-primary/5'
          }
        >
          <IconFilters />
        </button> */}
          <button
            className="md:hidden md:px-12"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              width="20"
              height="13"
              viewBox="0 0 20 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.77778 13H12.2222V10.8333H7.77778V13ZM0 0V2.16667H20V0H0ZM3.33333 7.58333H16.6667V5.41667H3.33333V7.58333Z"
                fill="#6C4A6F"
              />
            </svg>
          </button>
          <div className="hidden md:flex gap-2 md:px-12">
            <p
              className="hidden md:block uppercase text-[#6C4A6F] tracking-widest"
              style={{
                fontFamily: 'Poppins-400',
              }}
            >
              Views:
            </p>
            <button
              onClick={handleViewOne}
              className={`${viewOne ? 'opacity-100' : 'opacity-50'}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0.5 0.5H23.5V23.5H0.5V0.5Z" stroke="#6C4A6F" />
                <rect
                  x="2.47058"
                  y="3.05322"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="9.61768"
                  y="3.05322"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="16.7648"
                  y="3.05322"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="2.47058"
                  y="10.0165"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="9.61768"
                  y="10.0165"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="16.7648"
                  y="10.0165"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="2.47058"
                  y="16.9797"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="9.61768"
                  y="16.9797"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="16.7648"
                  y="16.9797"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
              </svg>
            </button>
            <button
              onClick={handleViewTwo}
              className={`${viewTwo ? 'opacity-100' : 'opacity-50'}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0.5 0.5H23.5V23.5H0.5V0.5Z" stroke="#6C4A6F" />
                <rect
                  x="2.77942"
                  y="2.73888"
                  width="18.7059"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="2.77942"
                  y="9.70213"
                  width="18.7059"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="2.77942"
                  y="16.6654"
                  width="18.7059"
                  height="4.64217"
                  fill="#6C4A6F"
                />
              </svg>
            </button>
          </div>
          <SortMenu />

          <div className="flex gap-2 md:px-12 md:hidden">
            <button
              onClick={handleViewOne}
              className={`${viewOne ? 'opacity-100' : 'opacity-50'}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0.5 0.5H23.5V23.5H0.5V0.5Z" stroke="#6C4A6F" />
                <rect
                  x="2.47058"
                  y="3.05322"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="9.61768"
                  y="3.05322"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="16.7648"
                  y="3.05322"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="2.47058"
                  y="10.0165"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="9.61768"
                  y="10.0165"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="16.7648"
                  y="10.0165"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="2.47058"
                  y="16.9797"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="9.61768"
                  y="16.9797"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="16.7648"
                  y="16.9797"
                  width="4.41176"
                  height="4.64217"
                  fill="#6C4A6F"
                />
              </svg>
            </button>
            <button
              onClick={handleViewTwo}
              className={`${viewTwo ? 'opacity-100' : 'opacity-50'}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0.5 0.5H23.5V23.5H0.5V0.5Z" stroke="#6C4A6F" />
                <rect
                  x="2.77942"
                  y="2.73888"
                  width="18.7059"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="2.77942"
                  y="9.70213"
                  width="18.7059"
                  height="4.64217"
                  fill="#6C4A6F"
                />
                <rect
                  x="2.77942"
                  y="16.6654"
                  width="18.7059"
                  height="4.64217"
                  fill="#6C4A6F"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-wrap md:flex-row">
        <div
          className={`transition-all duration-200 bg-white z-30 sticky top-[165px] ${
            isOpen
              ? 'opacity-100 min-w-full md:min-w-[240px] md:w-[240px] max-h-full'
              : 'opacity-0 md:min-w-[0px] md:w-[0px] pr-0 max-h-0 md:max-h-full'
          }`}
        >
          <FiltersDrawer
            collections={collections}
            filters={filters}
            appliedFilters={appliedFilters}
          />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}

export function FiltersDrawer({
  filters = [],
  appliedFilters = [],
  collections = [],
}) {
  const [params] = useSearchParams();
  const location = useLocation();

  const filterMarkup = (filter, option) => {
    switch (filter.type) {
      case 'PRICE_RANGE':
        const min =
          params.has('minPrice') && !isNaN(Number(params.get('minPrice')))
            ? Number(params.get('minPrice'))
            : undefined;

        const max =
          params.has('maxPrice') && !isNaN(Number(params.get('maxPrice')))
            ? Number(params.get('maxPrice'))
            : undefined;

        return <PriceRangeFilter min={min} max={max} />;

      default:
        const to = getFilterLink(filter, option.input, params, location);
        return (
          // <Link className="flex items-center" prefetch="intent" to={to}>
          //   <input
          //     id="link-checkbox"
          //     type="checkbox"
          //     value=""
          //     // defaultChecked={option.input.available}
          //     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          //   />
          //   <label
          //     for="link-checkbox"
          //     className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          //   >
          //     {option.label}
          //   </label>
          // </Link>
          <Link
            className="focus:underline hover:underline text-sm font-medium text-gray-900 ml-2"
            prefetch="intent"
            to={to}
          >
            {option.label}
          </Link>
        );
    }
  };

  const collectionsMarkup = collections.map((collection) => {
    return (
      <li key={collection.handle} className="pb-4">
        <Link
          to={`/collections/${collection.handle}`}
          className="focus:underline hover:underline"
          key={collection.handle}
          prefetch="intent"
        >
          {collection.title}
        </Link>
      </li>
    );
  });

  return (
    <>
      <nav
        className="py-8 md:pl-12 bg-[white] md:pr-12 w-[90%] md:w-full mx-auto text-[#6c4a6f] sticky top-[165px]"
        style={{
          fontFamily: 'Poppins-300',
        }}
      >
        {appliedFilters.length > 0 ? (
          <div className="pb-8">
            <AppliedFilters filters={appliedFilters} />
          </div>
        ) : null}

        <Heading
          as="h4"
          size="lead"
          className="pb-2 tracking-widest font-semibold text-[#6C4A6F] border-[#6C4A6F] border-b-[0.5px]"
        >
          Refine By
        </Heading>
        <div className="divide-y">
          {filters.map(
            (filter) =>
              filter.values.length > 1 && (
                <Disclosure as="div" key={filter.id} className="w-full">
                  {({open}) => (
                    <>
                      <Disclosure.Button className="flex justify-between items-center w-full py-4">
                        <Text size="lead">{filter.label}</Text>
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </Disclosure.Button>
                      <Disclosure.Panel key={filter.id}>
                        <ul key={filter.id} className="">
                          {filter.values?.map((option) => {
                            return (
                              <li key={option.id} className="pb-2">
                                {filterMarkup(filter, option)}
                              </li>
                            );
                          })}
                        </ul>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ),
          )}
        </div>
      </nav>
    </>
  );
}

function AppliedFilters({filters = []}) {
  const [params] = useSearchParams();
  const location = useLocation();
  return (
    <>
      <Heading
        as="h4"
        size="lead"
        className="pb-2 tracking-widest font-semibold border-[#6C4A6F] border-b-[0.5px]"
      >
        Applied filters
      </Heading>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          return (
            <Link
              to={getAppliedFilterLink(filter, params, location)}
              className="flex p-2 border text-white bg-[#6C4A6F] gap-2  my-2"
              key={`${filter.label}-${filter.urlParam}`}
            >
              <span className="flex-grow">{filter.label}</span>
              <span>
                <IconXMark />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function getAppliedFilterLink(filter, params, location) {
  const paramsClone = new URLSearchParams(params);
  if (filter.urlParam.key === 'variantOption') {
    const variantOptions = paramsClone.getAll('variantOption');
    const filteredVariantOptions = variantOptions.filter(
      (options) => !options.includes(filter.urlParam.value),
    );
    paramsClone.delete(filter.urlParam.key);
    for (const filteredVariantOption of filteredVariantOptions) {
      paramsClone.append(filter.urlParam.key, filteredVariantOption);
    }
  } else {
    paramsClone.delete(filter.urlParam.key);
  }
  return `${location.pathname}?${paramsClone.toString()}`;
}

function getSortLink(sort, params, location) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}

function getFilterLink(filter, rawInput, params, location) {
  const paramsClone = new URLSearchParams(params);
  const newParams = filterInputToParams(filter.type, rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

function PriceRangeFilter({max, min}) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(min ? String(min) : '');
  const [maxPrice, setMaxPrice] = useState(max ? String(max) : '');

  useDebounce(
    () => {
      if (
        (minPrice === '' || minPrice === String(min)) &&
        (maxPrice === '' || maxPrice === String(max))
      )
        return;

      const price = {};
      if (minPrice !== '') price.min = minPrice;
      if (maxPrice !== '') price.max = maxPrice;

      const newParams = filterInputToParams('PRICE_RANGE', {price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`);
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  const onChangeMax = (event) => {
    const newMaxPrice = event.target.value;
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event) => {
    const newMinPrice = event.target.value;
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex flex-col">
      <label className="mb-4">
        <span>from</span>
        <input
          name="maxPrice"
          className="text-black"
          type="text"
          defaultValue={min}
          placeholder={'$'}
          onChange={onChangeMin}
        />
      </label>
      <label>
        <span>to</span>
        <input
          name="minPrice"
          className="text-black"
          type="number"
          defaultValue={max}
          placeholder={'$'}
          onChange={onChangeMax}
        />
      </label>
    </div>
  );
}

function filterInputToParams(type, rawInput, params) {
  const input = typeof rawInput === 'string' ? JSON.parse(rawInput) : rawInput;
  switch (type) {
    case 'PRICE_RANGE':
      if (input.price.min) params.set('minPrice', input.price.min);
      if (input.price.max) params.set('maxPrice', input.price.max);
      break;
    case 'LIST':
      Object.entries(input).forEach(([key, value]) => {
        if (typeof value === 'string') {
          params.set(key, value);
        } else if (typeof value === 'boolean') {
          params.set(key, value.toString());
        } else {
          const {name, value: val} = value;
          const allVariants = params.getAll(`variantOption`);
          const newVariant = `${name}:${val}`;
          if (!allVariants.includes(newVariant)) {
            params.append('variantOption', newVariant);
          }
        }
      });
      break;
  }

  return params;
}

export default function SortMenu() {
  const items = [
    {label: 'Featured', key: 'featured'},
    {
      label: 'Price: Low - High',
      key: 'price-low-high',
    },
    {
      label: 'Price: High - Low',
      key: 'price-high-low',
    },
    {
      label: 'Best Selling',
      key: 'best-selling',
    },
    {
      label: 'Newest',
      key: 'newest',
    },
  ];
  const [params] = useSearchParams();
  const location = useLocation();
  const activeItem = items.find((item) => item.key === params.get('sort'));
  const [showSortMenu, setShowSortMenu] = useState(false);
  const handleSortMobile = () => {
    setShowSortMenu(!showSortMenu);
  };
  return (
    <div>
      <Menu
        as="div"
        className="relative z-30 md:border-l-[1px] border-[#6C4A6F90] py-5 md:px-12"
      >
        <Menu.Button className="flex items-center" onClick={handleSortMobile}>
          <span className="px-2 text-[#6C4A6F]">
            <span
              className="px-2  tracking-widest uppercase"
              style={{
                fontFamily: 'Karla-400',
              }}
            >
              Sort{' '}
            </span>
            {/* <span>{(activeItem || items[0]).label}</span> */}
          </span>
          <span>
            <svg
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.0575 -2.72327e-07L4.5 3.7085L7.9425 -3.62588e-08L9 1.1417L4.5 6L-6.36222e-08 1.1417L1.0575 -2.72327e-07Z"
                fill="#6C4A6F"
              />
            </svg>
          </span>
        </Menu.Button>
        <div className="">
          <Menu.Items
            as="nav"
            className="absolute -right-1 md:right-[25%] mt-[1.4rem] flex flex-col w-[200%] md:w-full text-right text-black rounded-sm bg-[#D3AED2] py-4"
            style={{
              fontFamily: 'Poppins-300',
              boxShadow: '0 -2px 10px #36363633',
            }}
          >
            <div className="absolute font top-0 -mt-2 right-0 w-0 h-0 border-l-[10px] border-transparent border-b-[10px] border-r-[10px] border-b-[#D3AED2]"></div>
            {items.map((item) => (
              <Menu.Item key={item.label}>
                {() => (
                  <Link
                    className={`block text-sm py-2 pr-6
                  hover:bg-[#f0c5ee]
                ${activeItem?.key === item.key ? 'font-bold' : 'font-normal'}`}
                    to={getSortLink(item.key, params, location)}
                  >
                    {item.label}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </div>
      </Menu>
      {/* {showSortMenu && (
          
      )} */}
    </div>
  );
}
