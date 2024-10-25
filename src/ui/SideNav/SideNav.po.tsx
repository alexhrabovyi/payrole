import { render, screen } from '@testing-library/react';
import SideNav from './SideNav';

const SideNavPO = {
  navMenuClasses: {
    active: 'translate-x-0 opacity-1',
    inactive: 'translate-x-[-100%] opacity-0',
  },

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
    return screen.getByTestId('navPanel');
  },

  getNavMenu() {
    return screen.getByTestId('navMenu');
  },
};

export default SideNavPO;
