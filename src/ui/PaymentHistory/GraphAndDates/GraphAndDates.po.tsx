import { fireEvent, render, screen } from '@testing-library/react';
import mockedFormattedPaymentStats from './formattedPaymentStats.mock.json';
import GraphAndDates, { StatsWithCoords } from './GraphAndDates';
import { FormattedPaymentStats } from '../PaymentHistory';
import { calcMinMaxAmount, calcXYSteps, calcXCoord, calcYCoord, XYStepsType, createStatsWithCoords } from './utils/graphAndDatesUtils';
import CurrentStatsTipPO from '../CurrentStatsTip/CurrentStatsTip.po';

type KeyCode = 'ArrowUp' | 'ArrowLeft' | 'ArrowDown' | 'ArrowRight' | 'PageUp' | 'PageDown' | 'Home' | 'End';

const GraphAndDatesPO = {
  width: 930,
  height: 500,
  statsAmount: mockedFormattedPaymentStats.length,

  formattedPaymentStats: mockedFormattedPaymentStats as FormattedPaymentStats[],

  get minMaxAmount() {
    return calcMinMaxAmount(this.formattedPaymentStats);
  },

  get minMaxCoords() {
    return {
      minXCoord: 0,
      maxXCoord: 930,
      minYCoord: 0,
      maxYCoord: 500,
    };
  },

  get XYSteps() {
    return calcXYSteps(this.minMaxAmount, this.minMaxCoords, this.statsAmount) as XYStepsType;
  },

  calcXCoord(index: number) {
    return calcXCoord(index, this.XYSteps?.XStep);
  },

  calcYCoord(amount: number) {
    return calcYCoord(amount, this.minMaxAmount.minAmount, this.XYSteps.YStep, 500);
  },

  get statsWithCoords() {
    return createStatsWithCoords(
      this.formattedPaymentStats,
      this.minMaxAmount,
      this.minMaxCoords,
      this.XYSteps,
    ) as StatsWithCoords[];
  },

  render() {
    const { width, formattedPaymentStats } = this;

    render(
      <GraphAndDates
        paymentStats={formattedPaymentStats}
        widthProp={width}
        topIndentPx={60}
        amountOfMiddleDates={4}
      />,
    );
  },

  getGraphAndDates() {
    return screen.getByTestId('graphAndDates');
  },

  getSvgWrapper() {
    return screen.getByTestId('graphAndDatesSvgWrapper');
  },

  getDateElemsBlock() {
    return screen.getByTestId('dateElemsBlock');
  },

  getVerticalLineSvg() {
    return CurrentStatsTipPO.getVerticalLineSvg();
  },

  getCircleSpan() {
    return CurrentStatsTipPO.getCircleSpan();
  },

  getStatsTipWrapper() {
    return CurrentStatsTipPO.getCurrentStatsTipWrapper();
  },

  getStatsTip() {
    return CurrentStatsTipPO.getCurrentStatsTip();
  },

  fireKeyDownEvent(keyCode: KeyCode) {
    fireEvent.keyDown(this.getGraphAndDates(), { keyCode });
  },
};

export default GraphAndDatesPO;
