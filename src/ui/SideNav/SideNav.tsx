/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

'use client';

import { useState, useCallback, useLayoutEffect, useRef, useEffect, MouseEventHandler } from 'react';
import clsx from 'clsx';

import useOnResize from '@/hooks/useOnResize';
import links from '@/libs/links';
import getScrollWidth from '@/libs/getScrollWidth';
import Logo from '@/ui/Logo/Logo';
import NavLink from '@/ui/SideNav/NavLink/NavLink';
import BurgerButton from './BurgerButton/BurgerButton';

interface WindowMetrics {
  width: number,
  height: number,
}

interface NavPanelMetrics {
  width: number,
  height: number,
  paddingRight: number,
}

interface NavMenuStyleObj {
  top: string,
  height: string,
  overflowY: 'scroll' | undefined,
}

interface SideNavProps {
  pxFromWhichStaticBehaviour: number,
}

const SideNav: React.FC<SideNavProps> = ({ pxFromWhichStaticBehaviour }) => {
  const NAV_MENU_ID = 'navMenu';
  const NAV_LOGO_TEST_ID = 'navLogo';

  const navPanelRef = useRef<HTMLDivElement | null>(null);
  const navMenuRef = useRef<HTMLElement | null>(null);

  const [windowMetrics, setWindowMetrics] = useState<WindowMetrics>(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [navPanelMetrics, setNavPanelMetrics] = useState<NavPanelMetrics>(() => ({
    width: document.documentElement.clientWidth,
    height: 0,
    paddingRight: 0,
  }));

  const inferWindowMetrics = useCallback(() => {
    setWindowMetrics({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useLayoutEffect(inferWindowMetrics, [inferWindowMetrics]);
  useOnResize(inferWindowMetrics);

  const calcNavPanelMetrics = useCallback(() => {
    const navPanelEl = navPanelRef.current;

    if (!navPanelEl) return;

    let navPanelWidth: number;
    let navPanelPaddingRight: number;

    if (isNavMenuOpen) {
      navPanelWidth = windowMetrics.width;
      navPanelPaddingRight = getScrollWidth();
    } else {
      navPanelWidth = document.documentElement.clientWidth;
      navPanelPaddingRight = 0;
    }

    const navPanelHeight = navPanelEl.offsetHeight;

    setNavPanelMetrics({
      width: navPanelWidth,
      height: navPanelHeight,
      paddingRight: navPanelPaddingRight,
    });
  }, [isNavMenuOpen, windowMetrics.width]);

  useEffect(calcNavPanelMetrics, [calcNavPanelMetrics]);

  function closeOnCrossingMediaQuery() {
    if (isNavMenuOpen && windowMetrics.width >= pxFromWhichStaticBehaviour) {
      setIsNavMenuOpen(false);
    }
  }

  closeOnCrossingMediaQuery();

  const toggleHiddingScrollBar = useCallback(() => {
    if (isNavMenuOpen) {
      const scrollWidth = getScrollWidth();

      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.paddingRight = `${scrollWidth}px`;
    }

    return () => {
      if (isNavMenuOpen) {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.body.style.paddingRight = '';
      }
    };
  }, [isNavMenuOpen]);

  useEffect(toggleHiddingScrollBar, [toggleHiddingScrollBar]);

  const navMenuStyleObj: NavMenuStyleObj | undefined = (() => {
    const navPanelEl = navPanelRef.current;
    const navMenuEl = navMenuRef.current;

    if (!navPanelEl || !navMenuEl) return;

    const navPanelHeight = navPanelEl.offsetHeight;

    const maxNavMenuHeight = windowMetrics.height - navPanelHeight;
    const realNavMenuHeight = navMenuEl.scrollHeight;

    return {
      top: `${navPanelHeight}px`,
      height: `${maxNavMenuHeight}px`,
      overflowY: realNavMenuHeight > maxNavMenuHeight ? 'scroll' as const : undefined,
    };
  })();

  const navMenuOrPanelOnClick: MouseEventHandler<HTMLElement> = (e) => {
    if ((e.target as HTMLElement).closest('a')) setIsNavMenuOpen(false);
  };

  const burgetBtnOnClick = useCallback(() => {
    setIsNavMenuOpen(!isNavMenuOpen);

    if (!isNavMenuOpen) {
      navMenuRef.current?.focus();
    }
  }, [isNavMenuOpen]);

  if (windowMetrics.width >= pxFromWhichStaticBehaviour) {
    return (
      <div>
        <nav
          className={`fixed top-0 left-0 min-w-[220px] w-[14.58%] h-full 
            border-solid border-r-[1px] border-grey-200 px-[25px] xl:px-[1.3%] py-[32px]
            flex flex-col gap-[56px] justify-between items-stretch`}
          data-testid="navMenu"
        >
          <div className="flex flex-col justify-between items-start gap-[56px]">
            <Logo />
            <ul className="w-full flex flex-col justify-start items-stretch gap-[16px]">
              <li className="w-full">
                <NavLink text="Home" href={links.dashboard} />
              </li>
              <li className="w-full">
                <NavLink text="Contracts" href={links.contracts} />
              </li>
              <li className="w-full">
                <NavLink text="Documents" href={links.documents} />
              </li>
              <li className="w-full">
                <NavLink text="Invoices" href={links.invoices} />
              </li>
              <li className="w-full">
                <NavLink text="Transactions" href={links.transactions} />
              </li>
              <li className="w-full">
                <NavLink text="Insurance" href={links.insurance} />
              </li>
              <li className="w-full">
                <NavLink text="Cards" href={links.cards} />
              </li>
            </ul>
          </div>
          <NavLink text="Settings" href={links.settings} />
        </nav>
      </div>
    );
  }

  return (
    <>
      <span
        className="w-full"
        style={{
          height: `${navPanelMetrics.height}px`,
        }}
        data-testid="navTopSpan"
      />
      <div
        className="fixed top-0 left-0 z-[1000] w-full h-auto pl-[15px] flex justify-start
        items-center gap-[10px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] overflow-hidden"
        ref={navPanelRef}
        style={{
          width: `${navPanelMetrics.width}px`,
          paddingRight: `${navPanelMetrics.paddingRight}px`,
        }}
        onClick={navMenuOrPanelOnClick}
        data-testid="navPanel"
      >
        {windowMetrics.width > 600 ? (
          <>
            <BurgerButton
              isOpen={isNavMenuOpen}
              onClickHandler={burgetBtnOnClick}
              controlsId={NAV_MENU_ID}
            />
            <Logo
              widthCls="w-[160px]"
              testId={NAV_LOGO_TEST_ID}
            />
          </>
        ) : (
          <div className="relative flex w-full">
            <BurgerButton
              isOpen={isNavMenuOpen}
              onClickHandler={burgetBtnOnClick}
              controlsId={NAV_MENU_ID}
            />
            <Logo
              widthCls="w-[160px]"
              addCls="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
              testId={NAV_LOGO_TEST_ID}
            />
          </div>
        )}
      </div>
      <nav
        ref={navMenuRef}
        id={NAV_MENU_ID}
        className={clsx(
          `fixed left-0 z-[100] w-full max-w-[300px] px-[15px] pt-[40px] pb-[20px] bg-white 
          transition-[transform,opacity] duration-500 ease-in-out`,
          isNavMenuOpen ? 'translate-x-0 opacity-1' : 'translate-x-[-100%] opacity-0',
        )}
        style={navMenuStyleObj}
        onClick={navMenuOrPanelOnClick}
        tabIndex={-1}
        aria-label="Navigation menu"
        data-testid="navMenu"
      >
        <div
          className="w-full h-full flex flex-col gap-[56px] justify-between items-stretch"
        >
          <ul className="w-full flex flex-col justify-start items-stretch gap-[16px]">
            <li className="w-full">
              <NavLink text="Home" href={links.dashboard} />
            </li>
            <li className="w-full">
              <NavLink text="Contracts" href={links.contracts} />
            </li>
            <li className="w-full">
              <NavLink text="Documents" href={links.documents} />
            </li>
            <li className="w-full">
              <NavLink text="Invoices" href={links.invoices} />
            </li>
            <li className="w-full">
              <NavLink text="Transactions" href={links.transactions} />
            </li>
            <li className="w-full">
              <NavLink text="Insurance" href={links.insurance} />
            </li>
            <li className="w-full">
              <NavLink text="Cards" href={links.cards} />
            </li>
          </ul>
          <NavLink text="Settings" href={links.settings} />
        </div>
      </nav>
      <div
        className={clsx(
          'fixed top-0 left-0 z-[10] w-full h-full bg-[rgba(10,17,47,0.75)] transition-[opacity] duration-500 ease-in-out',
          isNavMenuOpen ? 'opacity-1 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setIsNavMenuOpen(false)}
        data-testid="navBackdrop"
      />
    </>
  );
};

export default SideNav;
