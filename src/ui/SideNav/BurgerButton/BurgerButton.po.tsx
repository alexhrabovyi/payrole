import { fireEvent, screen } from '@testing-library/dom';

const BurgerButtonPO = {
  pathClasses: {
    1: {
      active: '[stroke-dasharray:_90_207] [stroke-dashoffset:_-134]',
      inactive: '[stroke-dasharray:_60_207]',
    },
    2: {
      active: '[stroke-dasharray:_1_60] [stroke-dashoffset:_-30]',
      inactive: '[stroke-dasharray:_60_60]',
    },
    3: {
      active: '[stroke-dasharray:_90_207] [stroke-dashoffset:_-134]',
      inactive: '[stroke-dasharray:_60_207]',
    },
  },

  ariaLabelTexts: {
    active: 'Close navigation menu',
    inactive: 'Open navigation menu',
  },

  getBurgerBtn() {
    return screen.getByTestId('navPanelBurgerBtn');
  },

  getBurgerBtnPath1() {
    return screen.getByTestId('burgerBtnPath1');
  },

  getBurgerBtnPath2() {
    return screen.getByTestId('burgerBtnPath2');
  },

  getBurgerBtnPath3() {
    return screen.getByTestId('burgerBtnPath3');
  },

  clickOnBurgerBtn() {
    fireEvent.click(this.getBurgerBtn());
  },
};

export default BurgerButtonPO;
