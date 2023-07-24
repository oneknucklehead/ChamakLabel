import {useParams, Form, Await, useMatches} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo, useState} from 'react';

import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
} from '~/components';
import {useIsHomePath} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';

export function Layout({children, layout}) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <Header
          title={layout?.shop.name ?? 'Chamak'}
          menu={layout?.headerMenu}
        />
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      <Footer menu={layout?.footerMenu} />
    </>
  );
}

function Header({title, menu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers('ADD_TO_CART');

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}) {
  const [root] = useMatches();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={root.data?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({isOpen, onClose, menu}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left">
      <MenuMobileNav menu={menu} onClose={onClose} />
    </Drawer>
  );
}

function MenuMobileNav({menu, onClose}) {
  return (
    <div className="flex flex-col w-full justify-between">
      <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
        {/* Top level menu items */}
        {/* {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <div>
            <Link
              to={item.to}
              target={item.target}
              onClick={onClose}
              className={({isActive}) =>
                isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
              }
            >
              <Text as="span" size="copy" className="uppercase">
                {item.title}
              </Text>
            </Link>
          </div>

          {!item.items ? (
            <></>
          ) : (
            <div className="px-3 pt-2">
              {item.items.map((item) => (
                <div key={item.id} className="my-2">
                  <Link
                    to={item.to}
                    target={item.target}
                    onClick={onClose}
                    className={({isActive}) =>
                      isActive ? 'pb-px border-b -mb-px' : 'pb-1'
                    }
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </span>
      ))} */}
        <div className="flex">
          <div className="flex w-full flex-col">
            {(menu?.items || []).map((item) => (
              <button
                key={item.id}
                className="group border-b border-[#D9D9D9] focus:outline-none uppercase"
              >
                <div className="flex items-center justify-between h-12">
                  <Link
                    to={item.to}
                    target={item.target}
                    onClick={onClose}
                    // className={({isActive}) =>
                    //   isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
                    // }
                  >
                    <Text as="span" size="copy" className="">
                      {item.title}
                    </Text>
                  </Link>
                  {item.items.length > 0 && (
                    <svg
                      className="h-6 w-6 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {!item.items ? null : (
                  <div className="max-h-0 overflow-hidden duration-300 group-focus:max-h-80">
                    <div className="px-3 pb-2">
                      {item.items.map((item) => (
                        <div key={item.id} className="my-2">
                          <Link
                            to={item.to}
                            target={item.target}
                            onClick={onClose}
                            className="flex items-center h-8 px-4 text-sm"
                          >
                            {item.title}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

function MobileHeader({title, isHome, openCart, openMenu}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);
  const {y} = useWindowScroll();
  const params = useParams();

  return (
    <header
      role="banner"
      className={`hover:bg-[#6C4A6F] transition duration-300 hover:border-[#6C4A6F] text-primary border-b-[1px] border-[#faf9f64f]
        ${!isHome && 'bg-[#6C4A6F]'}
      ${
        y > 50 ? 'bg-[#6C4A6F] border-b-[#6C4A6F]' : 'border-b-[#faf9f64f]'
      } py-8
       flex lg:hidden items-center h-fit sticky z-50 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-2">
        <button
          onClick={openMenu}
          className="relative flex text-[#FFF5E4] items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Link
          className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] flex-grow w-full h-full"
          to="/"
        >
          <Heading className="font-bold leading-none" as="h1">
            {title}
          </Heading>
        </Link>
      </div>

      <div className="flex items-center justify-end w-full gap-2">
        {/* <AccountLink className="relative flex items-center justify-center w-8 h-8" /> */}
        <div
          style={{
            fontFamily: 'Karla-300',
          }}
        >
          <Form
            method="get"
            action={params.locale ? `/${params.locale}/search` : '/search'}
            className="items-center gap-2 mt-1 sm:flex"
          >
            <Input
              className={`
                placeholder:text-white
                ${
                  isHome
                    ? 'focus:border-contrast/20 dark:focus:border-primary/20 placeholder:text-white text-white'
                    : 'focus:border-primary/20'
                }
              `}
              type="search"
              variant="minisearch"
              placeholder="Search"
              name="q"
            />
            <button
              type="submit"
              className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
            >
              <IconSearch />
            </button>
          </Form>
        </div>
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
    // <header
    //   role="banner"
    //   className={`${
    //     isHome
    //       ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
    //       : 'bg-contrast/80 text-primary'
    //   } flex lg:hidden items-center h-fit sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    // >
    //   <div className="flex items-center justify-start w-full gap-4">
    //     <button
    //       onClick={openMenu}
    //       className="relative flex items-center justify-center w-8 h-8"
    //     >
    //       <IconMenu />
    //     </button>
    //     <Form
    //       method="get"
    //       action={params.locale ? `/${params.locale}/search` : '/search'}
    //       className="items-center gap-2 sm:flex"
    //     >
    //       <button
    //         type="submit"
    //         className="relative flex items-center justify-center w-8 h-8"
    //       >
    //         <IconSearch />
    //       </button>
    //       <Input
    //         className={
    //           isHome
    //             ? 'focus:border-contrast/20 dark:focus:border-primary/20'
    //             : 'focus:border-primary/20'
    //         }
    //         type="search"
    //         variant="minisearch"
    //         placeholder="Search"
    //         name="q"
    //       />
    //     </Form>
    //   </div>

    //   <Link
    //     className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
    //     to="/"
    //   >
    //     <Heading
    //       className="font-bold text-center leading-none"
    //       as={isHome ? 'h1' : 'h2'}
    //     >
    //       {title}
    //     </Heading>
    //   </Link>

    //   <div className="flex items-center justify-end w-full gap-4">
    //     <AccountLink className="relative flex items-center justify-center w-8 h-8" />
    //     <CartCount isHome={isHome} openCart={openCart} />
    //   </div>
    // </header>
  );
}

function DesktopHeader({isHome, menu, openCart, title}) {
  const [showBorder, setShowBorder] = useState(false);
  const params = useParams();

  const menuHoverEnter = (event) => {
    setShowBorder(true);
    const otherTopNav = document.querySelectorAll('header nav > .top-menu');
    otherTopNav.forEach((top) => {
      top.classList.remove('active');
    });
    event.target.closest('.top-menu').classList.add('active');
  };
  const DropDownOut = (event) => {
    event.target.closest('.top-menu').classList.remove('active');
    setShowBorder(false);
  };
  const {y} = useWindowScroll();
  return (
    <>
      {/* <header
        role="banner"
        className={`${
          isHome ? 'bg-transparent text-primary' : 'bg-contrast/80 text-primary'
        } ${
          !isHome && y > 50 && ' shadow-lightHeader'
        } hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`}
      >
        <div className="flex gap-12">
          <Link className="font-bold" to="/" prefetch="intent">
            {title}
          </Link>
          <nav className="flex gap-8">
            {(menu?.items || []).map((item) => (
              <Link
                key={item.id}
                to={item.to}
                target={item.target}
                prefetch="intent"
                className={({isActive}) =>
                  isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
                }
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <Form
            method="get"
            action={params.locale ? `/${params.locale}/search` : '/search'}
            className="flex items-center gap-2"
          >
            <Input
              className={
                isHome
                  ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                  : 'focus:border-primary/20'
              }
              type="search"
              variant="minisearch"
              placeholder="Search"
              name="q"
            />
            <button
              type="submit"
              className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
            >
              <IconSearch />
            </button>
          </Form>
          <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
          <CartCount isHome={isHome} openCart={openCart} />
        </div>
      </header> */}
      <header
        role="banner"
        className={`${
          !isHome && 'bg-[#6C4A6F]'
        } hover:bg-[#6C4A6F] border-b-[1px] border-[#faf9f64f] hover:border-[#6C4A6F] text-white ${
          y > 50 ? 'bg-[#6C4A6F] border-b-[#6C4A6F]' : 'border-b-[#faf9f64f]'
        } hidden h-fit lg:block sticky transition duration-300 z-50 top-0 w-full leading-none py-5`}
      >
        <div>
          <div className="flex items-center transition duration-300 justify-between w-full leading-none gap-8 px-12">
            <div className="flex items-center w-1/3 gap-12">
              <Link className="font-bold" to="/" prefetch="intent">
                {title}
              </Link>
              {/* <nav className="flex gap-8">
              {(menu?.items || []).map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  target={item.target}
                  prefetch="intent"
                  className={({isActive}) =>
                    isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
                  }
                >
                  {item.title}
                </Link>
              ))}
            </nav> */}
            </div>
            <nav
              className={`flex w-1/3 gap-8 items-center justify-center pt-6 tracking-widest`}
              style={{fontFamily: 'Karla-400'}}
            >
              {(menu?.items || []).map((item) => (
                <div
                  className={`top-menu relative`}
                  key={'desktop--' + item.id}
                >
                  <Link
                    to={item.to}
                    target={item.target}
                    prefetch="intent"
                    // className={({isActive}) =>
                    //   isActive
                    //     ? 'pb-1 border-b border-[#FF9494] -mb-px'
                    //     : 'pb-1 py-4'
                    // }
                    onMouseEnter={menuHoverEnter}
                    onMouseLeave={() => setShowBorder(false)}
                    className={`inline-block px-5  uppercase after:block after:w-0 ${
                      !item?.items.length > 0 && 'after:h-[2px]'
                    } after:bg-[#ffffff] after:mt-4
                  after:transition-[width] after:duration-200 hover:after:w-[100%]`}
                  >
                    {item.title}
                  </Link>

                  {item?.items.length > 0 && (
                    <div
                      className={`drop-down border shadow-sm shadow-[#D3AED2] border-t-0 border-[#5F4262] absolute before:block before:top-0 before:bg-[#ffffff] before:h-[2px] before:w-0 before:transition-[width] before:duration-300 ${
                        showBorder && 'before:w-[100%]'
                      } `}
                      onMouseEnter={() => setShowBorder(true)}
                      onMouseLeave={DropDownOut}
                    >
                      <div className="min-w-[150px] w-full bg-[#6C4A6F] uppercase">
                        {(item?.items || []).map((subitems) => (
                          <div
                            key={'desktop-subheader--' + subitems.id}
                            className="py-5 px-3 w-[100%]"
                          >
                            <Link
                              to={subitems.to}
                              target={subitems.target}
                              prefetch="intent"
                              className="hover:font-semibold text-sm flex w-full px-5"
                              // className={({isActive}) =>
                              //   isActive && 'border-b border-[#FF9494]'
                              // }
                            >
                              {subitems.title}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div
              className="flex w-1/3 items-center justify-end gap-1"
              style={{
                fontFamily: 'Karla-300',
              }}
            >
              <Form
                method="get"
                action={params.locale ? `/${params.locale}/search` : '/search'}
                className="flex items-center gap-2 mt-1"
              >
                <Input
                  className={`
                    placeholder:text-white
                    ${
                      isHome
                        ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                        : 'focus:border-primary/20'
                    }`}
                  type="search"
                  variant="minisearch"
                  placeholder="Search"
                  name="q"
                />
                <button
                  type="submit"
                  className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
                >
                  <IconSearch />
                </button>
              </Form>
              {/* <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" /> */}
              <CartCount isHome={isHome} openCart={openCart} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function AccountLink({className}) {
  const [root] = useMatches();
  const isLoggedIn = root.data?.isLoggedIn;
  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

function CartCount({isHome, openCart}) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({openCart, dark, count}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <svg
          width="19"
          height="23"
          viewBox="0 0 19 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 22.985V5.995L2 6V6.03L19 6.016V22.984H0V22.985ZM17 7.985H2V20.985H17V7.985ZM12 5.103C12 3.063 11.507 1.9 9.5 1.9C7.5 1.9 7 3.064 7 5.103V6.015H5V4.647C5 1.19 7.274 0 9.5 0C11.517 0 14 1.354 14 4.647V6.015H12V5.103Z"
            fill="white"
          />
        </svg>

        <div
          className={`text-[#6C4A6F] bg-contrast absolute bottom-[2px] right-[2px] font-medium text-[0.625rem] subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
          style={{
            fontFamily: 'Karla-500',
          }}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    // <Section
    //   divider={isHome ? 'none' : 'top'}
    //   as="footer"
    //   role="contentinfo"
    //   className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
    //     bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    // >
    //   <FooterMenu menu={menu} />
    //   <div
    //     className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
    //   >
    //     &copy; Chamak Label {new Date().getFullYear()}.
    //   </div>
    // </Section>
    <div
      className="w-full bg-[#6C4A6F] flex justify-center md:py-16 text-white text-lg"
      style={{
        fontFamily: 'Poppins-300',
      }}
    >
      <div className="w-[90%] content-container md:grid gap-8 hidden md:grid-cols-2 lg:grid-cols-4">
        <div className="break-words">
          Khasra No. 366,Sultanpur, MG road
          <br /> New Delhi - 110030
          <br /> Call us at: +91 - 9999664174
          <br />
          <br /> Email: support@chamaklabel.com
        </div>
        <div>
          <h3
            className="text-xl"
            style={{
              fontFamily: 'Poppins-400',
            }}
          >
            Pages
          </h3>
          <div className="pt-2">
            <p>
              <Link to="/">Home</Link>
            </p>
            <p>
              <Link to="/collections">Collection</Link>
            </p>
            <p>
              <Link to="/">Stockist</Link>
            </p>
          </div>

          <p>About Us</p>
        </div>
        <div>
          <h3
            className="text-xl"
            style={{
              fontFamily: 'Poppins-400',
            }}
          >
            Terms & Policies
          </h3>
          <div className="pt-2">
            <p>
              <Link to="/policies/privacy-policy">Privacy Policy</Link>
            </p>
            <p>
              <Link to="/policies/shipping-policy">Shipping Policy</Link>
            </p>
            <p>
              <Link to="/policies/terms-of-service">Terms of Service</Link>
            </p>
            <p>
              <Link to="/policies/refund-policy">Refund Policy</Link>
            </p>
          </div>
        </div>

        <div>
          <h3
            className="text-xl"
            style={{
              fontFamily: 'Poppins-400',
            }}
          >
            Follow Us
          </h3>
          <div className="flex gap-2 pt-2">
            <div>
              <svg
                width="30"
                height="31"
                viewBox="0 0 30 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_56_278)">
                  <path
                    d="M0 0.520996V30.521H30V0.520996H0ZM28.2422 28.7632H1.75781V2.27881H28.2422V28.7632Z"
                    fill="white"
                  />
                  <path
                    d="M12.9316 23.0151H15.8379V15.2222H18.1406L18.3105 12.978H15.8379V11.2261C15.8379 10.6226 16.377 10.4058 16.9805 10.4058C17.584 10.4058 18.2285 10.5933 18.2285 10.5933L18.6152 8.29639C18.6152 8.29639 17.7949 8.01514 15.8379 8.01514C14.6367 8.01514 13.9395 8.47217 13.4297 9.146C12.9492 9.78467 12.9316 10.8101 12.9316 11.4722V12.978H11.3789V15.2222H12.9316V23.0151Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_56_278">
                    <rect
                      width="30"
                      height="30"
                      fill="white"
                      transform="translate(0 0.520996)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div>
              <svg
                width="31"
                height="31"
                viewBox="0 0 32 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.0092 5.80192C24.6663 5.79725 24.3298 5.89436 24.0421 6.08096C23.7544 6.26755 23.5285 6.53526 23.393 6.85023C23.2575 7.1652 23.2184 7.51328 23.2807 7.85046C23.343 8.18765 23.5038 8.49879 23.743 8.74455C23.9821 8.9903 24.2887 9.15964 24.624 9.23114C24.9594 9.30265 25.3084 9.2731 25.627 9.14625C25.9455 9.0194 26.2193 8.80094 26.4137 8.51848C26.6082 8.23603 26.7144 7.90228 26.7192 7.55942V7.51192C26.715 7.05968 26.5336 6.62713 26.2138 6.30733C25.894 5.98753 25.4614 5.80605 25.0092 5.80192Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M29.102 1.87526H2.89788C2.48485 1.88559 2.09222 2.05696 1.80379 2.35278C1.51537 2.6486 1.354 3.04544 1.35413 3.4586V29.6628C1.35413 30.0827 1.52094 30.4854 1.81787 30.7823C2.11481 31.0793 2.51753 31.2461 2.93746 31.2461H29.1416C29.5616 31.2461 29.9643 31.0793 30.2612 30.7823C30.5581 30.4854 30.725 30.0827 30.725 29.6628V3.41901C30.7198 3.21107 30.6738 3.00617 30.5894 2.81603C30.5051 2.62589 30.3841 2.45424 30.2334 2.31087C30.0827 2.16751 29.9052 2.05525 29.711 1.9805C29.5169 1.90576 29.31 1.87 29.102 1.87526Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.9999 9.96606C14.7035 9.96606 13.4361 10.3505 12.3582 11.0708C11.2802 11.7911 10.4401 12.8148 9.94392 14.0126C9.44779 15.2103 9.31798 16.5283 9.5709 17.7999C9.82383 19.0714 10.4481 20.2394 11.3649 21.1562C12.2816 22.0729 13.4496 22.6972 14.7211 22.9501C15.9927 23.203 17.3107 23.0732 18.5084 22.5771C19.7062 22.081 20.73 21.2408 21.4502 20.1628C22.1705 19.0849 22.5549 17.8175 22.5549 16.5211C22.5549 14.7826 21.8643 13.1153 20.635 11.886C19.4057 10.6567 17.7384 9.96606 15.9999 9.96606Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className={`self-end pt-4 opacity-50 text-sm`}>
          &copy; Chamak Label {new Date().getFullYear()}.
        </div>
      </div>
      <div className="w-[90%] grid md:hidden py-12">
        <div className="break-all text-base pb-4">
          Khasra No. 366,Sultanpur, MG road
          <br /> New Delhi - 110030
          <br /> Call us at: +91 - 9999664174
          <br />
          <br /> Email: support@chamaklabel.com
        </div>
        <div className="flex">
          <div className="flex w-full flex-col">
            <button className="group  border-black focus:outline-none">
              <div className="flex items-center justify-between h-12 font-semibold">
                <span className="truncate">Pages</span>
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="max-h-0 overflow-hidden duration-300 group-focus:max-h-40">
                <Link className="flex items-center h-8 px-4 text-sm" to="/">
                  Home
                </Link>
                <Link
                  className="flex items-center h-8 px-4 text-sm "
                  to="/collections"
                >
                  Collections
                </Link>
                <Link className="flex items-center h-8 px-4 text-sm" to="/">
                  Stockist
                </Link>
              </div>
            </button>
            <button className="group border-t border-[#D9D9D9] focus:outline-none">
              <div className="flex items-center justify-between h-12 font-semibold">
                <span className="truncate">Terms & Policies</span>
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="max-h-0 overflow-hidden duration-300 group-focus:max-h-60">
                <Link
                  className="flex items-center h-8 px-4 text-sm"
                  to="/policies/privacy-policy"
                >
                  Privacy Policy
                </Link>
                <Link
                  className="flex items-center h-8 px-4 text-sm"
                  to="/policies/shipping-policy"
                >
                  Shipping Policy
                </Link>
                <Link
                  className="flex items-center h-8 px-4 text-sm"
                  href="/policies/terms-of-service"
                >
                  Terms of Service
                </Link>
                <Link
                  className="flex items-center h-8 px-4 text-sm"
                  to="/policies/refund-policy"
                >
                  Refund Policy
                </Link>
              </div>
            </button>
            <div className="py-4">
              <h3
                className="text-xl"
                style={{
                  fontFamily: 'Poppins-400',
                }}
              >
                Follow Us
              </h3>
              <div className="flex gap-2 py-2">
                <div>
                  <svg
                    width="30"
                    height="31"
                    viewBox="0 0 30 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_56_278)">
                      <path
                        d="M0 0.520996V30.521H30V0.520996H0ZM28.2422 28.7632H1.75781V2.27881H28.2422V28.7632Z"
                        fill="white"
                      />
                      <path
                        d="M12.9316 23.0151H15.8379V15.2222H18.1406L18.3105 12.978H15.8379V11.2261C15.8379 10.6226 16.377 10.4058 16.9805 10.4058C17.584 10.4058 18.2285 10.5933 18.2285 10.5933L18.6152 8.29639C18.6152 8.29639 17.7949 8.01514 15.8379 8.01514C14.6367 8.01514 13.9395 8.47217 13.4297 9.146C12.9492 9.78467 12.9316 10.8101 12.9316 11.4722V12.978H11.3789V15.2222H12.9316V23.0151Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_56_278">
                        <rect
                          width="30"
                          height="30"
                          fill="white"
                          transform="translate(0 0.520996)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <svg
                    width="31"
                    height="31"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M25.0092 5.80192C24.6663 5.79725 24.3298 5.89436 24.0421 6.08096C23.7544 6.26755 23.5285 6.53526 23.393 6.85023C23.2575 7.1652 23.2184 7.51328 23.2807 7.85046C23.343 8.18765 23.5038 8.49879 23.743 8.74455C23.9821 8.9903 24.2887 9.15964 24.624 9.23114C24.9594 9.30265 25.3084 9.2731 25.627 9.14625C25.9455 9.0194 26.2193 8.80094 26.4137 8.51848C26.6082 8.23603 26.7144 7.90228 26.7192 7.55942V7.51192C26.715 7.05968 26.5336 6.62713 26.2138 6.30733C25.894 5.98753 25.4614 5.80605 25.0092 5.80192Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M29.102 1.87526H2.89788C2.48485 1.88559 2.09222 2.05696 1.80379 2.35278C1.51537 2.6486 1.354 3.04544 1.35413 3.4586V29.6628C1.35413 30.0827 1.52094 30.4854 1.81787 30.7823C2.11481 31.0793 2.51753 31.2461 2.93746 31.2461H29.1416C29.5616 31.2461 29.9643 31.0793 30.2612 30.7823C30.5581 30.4854 30.725 30.0827 30.725 29.6628V3.41901C30.7198 3.21107 30.6738 3.00617 30.5894 2.81603C30.5051 2.62589 30.3841 2.45424 30.2334 2.31087C30.0827 2.16751 29.9052 2.05525 29.711 1.9805C29.5169 1.90576 29.31 1.87 29.102 1.87526Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.9999 9.96606C14.7035 9.96606 13.4361 10.3505 12.3582 11.0708C11.2802 11.7911 10.4401 12.8148 9.94392 14.0126C9.44779 15.2103 9.31798 16.5283 9.5709 17.7999C9.82383 19.0714 10.4481 20.2394 11.3649 21.1562C12.2816 22.0729 13.4496 22.6972 14.7211 22.9501C15.9927 23.203 17.3107 23.0732 18.5084 22.5771C19.7062 22.081 20.73 21.2408 21.4502 20.1628C22.1705 19.0849 22.5549 17.8175 22.5549 16.5211C22.5549 14.7826 21.8643 13.1153 20.635 11.886C19.4057 10.6567 17.7384 9.96606 15.9999 9.96606Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`self-end pt-4 opacity-50 text-sm`}>
          &copy; Chamak Label {new Date().getFullYear()}.
        </div>
      </div>
    </div>
  );
}

const FooterLink = ({item}) => {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
};

function FooterMenu({menu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
