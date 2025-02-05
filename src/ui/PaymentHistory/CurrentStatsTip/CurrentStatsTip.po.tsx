import { screen } from '@testing-library/dom';

const CurrentStatsTipPO = {
  commonStyles: {
    opacity: {
      active: '1',
      inactive: '0',
    },
    pointerEvents: {
      active: 'all',
      inactive: 'none',
    },
  },

  getVerticalLineSvg() {
    return screen.getByTestId('tipVerticalLineSvg');
  },

  getVerticalLinePath() {
    return screen.getByTestId('tipVerticalLinePath');
  },

  getCircleSpan() {
    return screen.getByTestId('tipCircleSpan');
  },

  getCurrentStatsTipWrapper() {
    return screen.getByTestId('currentStatsTipWrapper');
  },

  getCurrentStatsTip() {
    return screen.getByTestId('currentStatsTip');
  },

  getDateParagraph() {
    return screen.getByTestId('tipDateParagraph');
  },

  getProfitOrLossParagraph() {
    return screen.getByTestId('tipProfitOrLossParagraph');
  },

  getAmountParagraph() {
    return screen.getByTestId('tipAmountParagraph');
  },

  getTriangleSvg() {
    return screen.getByTestId('tipTriangleSvg');
  },
};

export default CurrentStatsTipPO;
