/* eslint-disable jest-dom/prefer-to-have-style */
import SideNavPO from './SideNav.po';
import BurgerButtonPO from './BurgerButton/BurgerButton.po';

describe('SideNav function', () => {
  describe('SideNav mobile', () => {
    it('closed -> click on BurgerBtn -> opened -> click on BurgerBtn -> closed', () => {
      const WINDOW_WIDTH = 900;
      const DOCUMENT_ELEMENT_WIDTH = 870;

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: WINDOW_WIDTH,
      });

      Object.defineProperty(document.documentElement, 'clientWidth', {
        writable: true,
        value: DOCUMENT_ELEMENT_WIDTH,
      });

      SideNavPO.render();

      const navPanel = SideNavPO.getNavPanel();
      const navMenu = SideNavPO.getNavMenu();
      const burgerBtn = BurgerButtonPO.getBurgerBtn();

      const burgerBtnPath1 = BurgerButtonPO.getBurgerBtnPath1();
      const burgerBtnPath2 = BurgerButtonPO.getBurgerBtnPath2();
      const burgerBtnPath3 = BurgerButtonPO.getBurgerBtnPath3();

      function test(isActive: boolean) {
        const propName = isActive ? 'active' : 'inactive';

        expect(document.body).toHaveStyle({
          overflow: isActive ? 'hidden' : undefined,
          paddingRight: isActive ? `${WINDOW_WIDTH - DOCUMENT_ELEMENT_WIDTH}px` : undefined,
        });

        expect(navPanel).toHaveStyle({
          width: isActive ? `${WINDOW_WIDTH}px` : `${DOCUMENT_ELEMENT_WIDTH}px`,
          paddingRight: isActive ? `${WINDOW_WIDTH - DOCUMENT_ELEMENT_WIDTH}px` : undefined,
        });

        expect(navMenu).toHaveClass(SideNavPO.navMenuClasses[propName]);

        expect(burgerBtn).toHaveAttribute('aria-label', BurgerButtonPO.ariaLabelTexts[propName]);
        expect(burgerBtn).toHaveAttribute('aria-expanded', isActive ? 'true' : 'false');

        expect(burgerBtnPath1).toHaveClass(BurgerButtonPO.pathClasses[1][propName]);
        expect(burgerBtnPath2).toHaveClass(BurgerButtonPO.pathClasses[2][propName]);
        expect(burgerBtnPath3).toHaveClass(BurgerButtonPO.pathClasses[3][propName]);
      }

      test(false);

      BurgerButtonPO.clickOnBurgerBtn();

      test(true);

      BurgerButtonPO.clickOnBurgerBtn();

      test(false);
    });
  });
});
