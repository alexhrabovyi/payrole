'use client';

import { useState, useCallback, useLayoutEffect } from 'react';

import useOnResize from '@/hooks/useOnResize';
import links from '@/libs/links';
import Logo from '@/ui/Logo/Logo';
import NavLink from '@/ui/SideNav/NavLink/NavLink';
import BurgerButton from './BurgerButton/BurgerButton';

export default function SideNav() {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  // this value should be set in LayoutContainer component
  const PX_FROM_WHICH_STATIC_BEHAVIOUR = 1280;

  const inferAndSetWindowWidth = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useLayoutEffect(inferAndSetWindowWidth);
  useOnResize(inferAndSetWindowWidth);

  if (windowWidth === null || windowWidth >= PX_FROM_WHICH_STATIC_BEHAVIOUR) {
    // width percent value should also be set in LayoutContainer component
    return (
      <div>
        <nav className="fixed top-0 left-0 min-w-[220px] w-[14.58%] h-full border-solid border-r-[1px] border-grey-200 px-[25px] xl:px-[1.3%] py-[32px]
          flex flex-col gap-[56px] justify-between items-stretch"
        >
          <div className="flex flex-col justify-between items-start gap-[56px]">
            <Logo />
            <div className="w-full flex flex-col justify-start items-stretch gap-[16px]">
              <NavLink text="Home" href={links.dashboard} />
              <NavLink text="Contracts" href={links.contracts} />
              <NavLink text="Documents" href={links.documents} />
              <NavLink text="Invoices" href={links.invoices} />
              <NavLink text="Transactions" href={links.transactions} />
              <NavLink text="Insurance" href={links.insurance} />
              <NavLink text="Cards" href={links.cards} />
            </div>
          </div>
          <NavLink text="Settings" href={links.settings} />
        </nav>
      </div>
    );
  }

  // check z-index prop among other component to define comprehensible ierarchy of z-index using
  // logo on mobile devices should be in the centre
  return (
    <div className="fixed top-0 left-0 z-[100] w-full h-auto px-[15px] flex justify-start items-center gap-[10px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      <BurgerButton
        isOpen={isNavMenuOpen}
        setIsOpen={setIsNavMenuOpen}
      />
      <Logo
        widthCls="w-[160px]"
      />
    </div>
  );
}
