/* eslint-disable jest-dom/prefer-to-have-style */
import { fireEvent, screen, waitFor } from '@testing-library/react';
import SideNavPO from './SideNav.po';
import BurgerButtonPO from './BurgerButton/BurgerButton.po';
import LogoPO from '../Logo/Logo.po';

/*
FUNCTIONALITY DESCRIPTION / CHECKLIST

=== General
== windowWidth >= 1280px - desktop nav [DONE]
== windowWidth < 1280px - mobile nav [DONE]
== windowWidth <= 600px - Logo and BurgerBtn have add classes [DONE]
== on resize event window metrics change [DONE]
== closeOnMediaQuery: opened mobile nav, resize to windowWidth >= 1280px, resize back to
windowWidth < 1280px - mobile nav is closed now [DONE]
== toggleScrollBar:
= opened: overflow: hidden, touch-action: none, paddingRight: scrollWidth [DONE]
= closed: overflow: '', touch-action: '', paddingRight: '' [DONE]

=== mobile nav open / close:
== MobileMenu classes toggle on open / close [DONE]
== Backdrop classes toggle on open / close [DONE]

=== Menu or Panel on click: if <a> is clicked and Menu is opened - Menu closes [DONE]

=== BurgerBtn
== open / close: BurgerBtnPaths classes + values of aria-attributes on button [DONE]
== on click: nav menu opens / closes + focus on menu if it opens [DONE]

=== Backdrop
== on click: closes nav menu if it's opened [DONE]

=== NavPanel
== on resize its metrics change (mostly, only width changes) [DONE]

=== NavSpan
== its height equals to height of the NavPanel

=== NavMenu
== navMenuMetrics: top: navPanelHeight, height: maxHeight, scroll: if content overflows
*/

function defineWindowWidth(windowWidth: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: windowWidth,
  });
}

function defineDocElWidth(docElWidth: number) {
  Object.defineProperty(document.documentElement, 'clientWidth', {
    writable: true,
    value: docElWidth,
  });
}

function defineWindowAndDocElWidth(windowWidth: number, docElWidth: number) {
  defineWindowWidth(windowWidth);
  defineDocElWidth(docElWidth);
}

describe('SideNav function', () => {
  it('change of SideNav type by resing screen: desktop -> mobile -> destop', async () => {
    const DESKTOP_WINDOW_WIDTH = 1500;
    const MOBILE_WINDOW_WIDTH = 900;

    const resizeEvent = new Event('resize');

    defineWindowWidth(DESKTOP_WINDOW_WIDTH);

    SideNavPO.render();

    expect(SideNavPO.getNavMenu()).toBeInTheDocument();
    expect(SideNavPO.getNavMenu()).toHaveClass(SideNavPO.navMenuClasses.desktop);

    expect(screen.queryByTestId(SideNavPO.testIds.navPanel)).not.toBeInTheDocument();
    expect(screen.queryByTestId(SideNavPO.testIds.navBackdrop)).not.toBeInTheDocument();
    expect(screen.queryByTestId(SideNavPO.testIds.navTopSpan)).not.toBeInTheDocument();

    defineWindowWidth(MOBILE_WINDOW_WIDTH);

    window.dispatchEvent(resizeEvent);

    await waitFor(() => {
      expect(SideNavPO.getNavMenu()).toHaveClass(SideNavPO.navMenuClasses.mobile);
    });

    await waitFor(() => {
      expect(SideNavPO.getNavPanel()).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(SideNavPO.getNavBackdrop()).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(SideNavPO.getNavTopSpan()).toBeInTheDocument();
    });

    defineWindowWidth(DESKTOP_WINDOW_WIDTH);

    window.dispatchEvent(resizeEvent);

    await waitFor(() => {
      expect(SideNavPO.getNavMenu()).toHaveClass(SideNavPO.navMenuClasses.desktop);
    });

    await waitFor(() => {
      expect(screen.queryByTestId(SideNavPO.testIds.navPanel)).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId(SideNavPO.testIds.navBackdrop)).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId(SideNavPO.testIds.navTopSpan)).not.toBeInTheDocument();
    });
  });

  it('Opened mobile NavMenu should be closed after resizing to desktop and back to mobile', async () => {
    const DESKTOP_WINDOW_WIDTH = 1500;
    const MOBILE_WINDOW_WIDTH = 900;

    const resizeEvent = new Event('resize');

    defineWindowWidth(MOBILE_WINDOW_WIDTH);

    SideNavPO.render();

    BurgerButtonPO.clickOnBurgerBtn();

    expect(SideNavPO.getNavMenu()).toHaveClass(SideNavPO.navMenuClasses.active);
    expect(BurgerButtonPO.getBurgerBtn()).toHaveAttribute('aria-expanded', 'true');

    defineWindowWidth(DESKTOP_WINDOW_WIDTH);

    window.dispatchEvent(resizeEvent);

    await waitFor(() => {
      expect(screen.queryByTestId(SideNavPO.testIds.navPanel)).not.toBeInTheDocument();
    });

    defineWindowWidth(MOBILE_WINDOW_WIDTH);

    window.dispatchEvent(resizeEvent);

    await waitFor(() => {
      expect(SideNavPO.getNavMenu()).toHaveClass(SideNavPO.navMenuClasses.inactive);
    });

    await waitFor(() => {
      expect(BurgerButtonPO.getBurgerBtn()).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('clicking on links should close mobile NavMenu', () => {
    const MOBILE_WINDOW_WIDTH = 900;

    defineWindowWidth(MOBILE_WINDOW_WIDTH);

    SideNavPO.render();

    const burgerBtn = BurgerButtonPO.getBurgerBtn();
    const navMenu = SideNavPO.getNavMenu();

    BurgerButtonPO.clickOnBurgerBtn();

    expect(navMenu).toHaveClass(SideNavPO.navMenuClasses.active);
    expect(burgerBtn).toHaveAttribute('aria-expanded', 'true');

    const linkEl = document.createElement('a');
    linkEl.href = '#';

    navMenu.append(linkEl);

    fireEvent.click(linkEl);

    expect(navMenu).toHaveClass(SideNavPO.navMenuClasses.inactive);
    expect(burgerBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('logo should have additional classes if windowWidth <= 600', async () => {
    const XS_MOBILE_WINDOW_WIDTH = 500;
    const MOBILE_WINDOW_WIDTH = 900;

    const resizeEvent = new Event('resize');

    defineWindowWidth(MOBILE_WINDOW_WIDTH);

    SideNavPO.render();

    expect(LogoPO.getLogo()).not.toHaveClass(SideNavPO.logoAddCls);

    defineWindowWidth(XS_MOBILE_WINDOW_WIDTH);

    window.dispatchEvent(resizeEvent);

    await waitFor(() => {
      expect(LogoPO.getLogo()).toHaveClass(SideNavPO.logoAddCls);
    });
  });

  it('closed -> click on BurgerBtn -> opened -> click on BurgerBtn -> closed', () => {
    const WINDOW_WIDTH = 900;
    const DOCUMENT_ELEMENT_WIDTH = 870;

    const scrollWidth = WINDOW_WIDTH - DOCUMENT_ELEMENT_WIDTH;

    defineWindowAndDocElWidth(WINDOW_WIDTH, DOCUMENT_ELEMENT_WIDTH);

    SideNavPO.render();

    const navPanel = SideNavPO.getNavPanel();
    const navMenu = SideNavPO.getNavMenu();
    const navBackdrop = SideNavPO.getNavBackdrop();
    const burgerBtn = BurgerButtonPO.getBurgerBtn();

    const burgerBtnPath1 = BurgerButtonPO.getBurgerBtnPath1();
    const burgerBtnPath2 = BurgerButtonPO.getBurgerBtnPath2();
    const burgerBtnPath3 = BurgerButtonPO.getBurgerBtnPath3();

    function testOpenCloseSideNav(isActive: boolean) {
      const propName = isActive ? 'active' : 'inactive';

      expect(document.body).toHaveStyle({
        overflow: isActive ? 'hidden' : undefined,
        paddingRight: isActive ? `${scrollWidth}px` : undefined,
      });

      expect(navPanel).toHaveStyle({
        width: isActive ? `${WINDOW_WIDTH}px` : `${DOCUMENT_ELEMENT_WIDTH}px`,
        paddingRight: isActive ? `${scrollWidth}px` : undefined,
      });

      expect(navMenu).toHaveClass(SideNavPO.navMenuClasses[propName]);

      if (isActive) {
        expect(navMenu).toHaveFocus();
      }

      expect(navBackdrop).toHaveClass(SideNavPO.navBackdropClasses[propName]);

      expect(burgerBtn).toHaveAttribute('aria-label', BurgerButtonPO.ariaLabelTexts[propName]);
      expect(burgerBtn).toHaveAttribute('aria-expanded', isActive ? 'true' : 'false');

      expect(burgerBtnPath1).toHaveClass(BurgerButtonPO.pathClasses[1][propName]);
      expect(burgerBtnPath2).toHaveClass(BurgerButtonPO.pathClasses[2][propName]);
      expect(burgerBtnPath3).toHaveClass(BurgerButtonPO.pathClasses[3][propName]);
    }

    testOpenCloseSideNav(false);

    BurgerButtonPO.clickOnBurgerBtn();

    testOpenCloseSideNav(true);

    BurgerButtonPO.clickOnBurgerBtn();

    testOpenCloseSideNav(false);
  });

  it('opened -> click on backdrop -> closed', () => {
    SideNavPO.render();

    const navMenu = SideNavPO.getNavMenu();

    expect(navMenu).toHaveClass(SideNavPO.navMenuClasses.inactive);

    BurgerButtonPO.clickOnBurgerBtn();

    expect(navMenu).toHaveClass(SideNavPO.navMenuClasses.active);

    SideNavPO.clickOnBackdrop();

    expect(navMenu).toHaveClass(SideNavPO.navMenuClasses.inactive);
  });

  it('NavPanel metrics change on resize (both in opened / closed state)', async () => {
    function getNum(string: string) {
      return Number(string.match(/\d+(.\d+)?/)?.[0]);
    }

    const resizeEvent = new Event('resize');

    let windowWidth = 900;
    let documentElementWidth = 870;

    defineWindowAndDocElWidth(windowWidth, documentElementWidth);

    SideNavPO.render();

    const navPanel = SideNavPO.getNavPanel();

    expect(getNum(navPanel.style.width)).toBe(documentElementWidth);

    windowWidth = 1130;
    documentElementWidth = 1100;

    defineWindowAndDocElWidth(windowWidth, documentElementWidth);

    window.dispatchEvent(resizeEvent);

    await waitFor(() => {
      expect(getNum(navPanel.style.width)).toBe(documentElementWidth);
    });

    BurgerButtonPO.clickOnBurgerBtn();

    await waitFor(() => {
      expect(getNum(navPanel.style.width)).toBe(windowWidth);
    });

    await waitFor(() => {
      expect(getNum(navPanel.style.paddingRight)).toBe(windowWidth - documentElementWidth);
    });

    windowWidth = 720;
    documentElementWidth = 700;

    defineWindowAndDocElWidth(windowWidth, documentElementWidth);

    window.dispatchEvent(resizeEvent);

    await waitFor(() => {
      expect(getNum(navPanel.style.width)).toBe(windowWidth);
    });

    await waitFor(() => {
      expect(getNum(navPanel.style.paddingRight)).toBe(windowWidth - documentElementWidth);
    });
  });

  // can't check since i can't define offsetHeight and other properties to the elements.
  // Should do e2e or more powerful integration tests.

  // it('navSpan and navMenu should have proper styles', () => {
  //   const WINDOW_WIDTH = 900;

  //   Object.defineProperty(window, 'innerWidth', {
  //     writable: true,
  //     value: WINDOW_WIDTH,
  //   });

  //   SideNavPO.render();

  //   const navPanel = SideNavPO.getNavPanel();

  //   Object.defineProperty(navPanel, 'offsetHeight', {
  //     writable: true,
  //     value: 50,
  //   });

  //   console.log(SideNavPO.getNavTopSpan().style.height);
  // });
});
