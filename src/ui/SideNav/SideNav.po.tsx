import { render, screen, fireEvent } from '@testing-library/react';
import SideNav from './SideNav';

const SideNavPO = {
  navMenuClasses: {
    active: 'translate-x-0 opacity-1',
    inactive: 'translate-x-[-100%] opacity-0',
    mobile: 'z-[100] w-full',
    desktop: 'min-w-[220px] w-[14.58%]',
  },

  navBackdropClasses: {
    active: 'opacity-1 pointer-events-auto',
    inactive: 'opacity-0 pointer-events-none',
  },

  testIds: {
    navPanel: 'navPanel',
    navMenu: 'navMenu',
    navBackdrop: 'navBackdrop',
    navTopSpan: 'navTopSpan',
  },

  logoAddCls: 'absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',

  render() {
    const PX_FROM_WHICH_STATIC_BEHAVIOUR = 1280;

    function Wrapper() {
      return (
        <>
          <style>
            {`
            .wrapper {
              width: 100%;
              display: grid;
              grid-template-columns: 1fr;
            }

            @media (min-width: 1280px) {
              .wrapper {
                grid-template-columns: minmax(220px, 14.58%), 1fr;
              }
            }
          `}
          </style>
          <div className=".wrapper">
            <SideNav
              pxFromWhichStaticBehaviour={PX_FROM_WHICH_STATIC_BEHAVIOUR}
            />
          </div>
        </>
      );
    }

    render(<Wrapper />);
  },

  getNavPanel() {
    return screen.getByTestId(this.testIds.navPanel);
  },

  getNavMenu() {
    return screen.getByTestId(this.testIds.navMenu);
  },

  getNavBackdrop() {
    return screen.getByTestId(this.testIds.navBackdrop);
  },

  getNavTopSpan() {
    return screen.getByTestId(this.testIds.navTopSpan);
  },

  clickOnBackdrop() {
    fireEvent.click(this.getNavBackdrop());
  },
};

export default SideNavPO;
