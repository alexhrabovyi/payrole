import { fireEvent, render, screen } from '@testing-library/react';
import mockedFormattedPaymentStats from './formattedPaymentStats.mock.json';
import GraphAndDates from './GraphAndDates';
import { FormattedPaymentStats } from '../PaymentHistory';

type KeyCode = 'ArrowUp' | 'ArrowLeft' | 'ArrowDown' | 'ArrowRight' | 'PageUp' | 'PageDown' | 'Home' | 'End';

const GraphAndDatesPO = {
  width: 930,
  height: 500,
  statsAmount: 31,

  formattedPaymentStats: mockedFormattedPaymentStats as FormattedPaymentStats[],

  get minMaxAmount() {
    const statsAmounts = this.formattedPaymentStats.map((fPS) => fPS.amount);
    const minAmount = Math.min(...statsAmounts);
    const maxAmount = Math.max(...statsAmounts);

    return {
      min: minAmount,
      max: maxAmount,
    };
  },

  get xStep() {
    return this.width / this.statsAmount;
  },

  get yStep() {
    return this.height / (this.minMaxAmount.max - this.minMaxAmount.min);
  },

  calcXCoord(index: number) {
    return this.xStep * index;
  },

  calcYCoord(amount: number) {
    return Math.abs((amount - this.minMaxAmount.min) * this.yStep - this.height);
  },

  render(isFullScreenOn: boolean = false) {
    const { width } = this;
    const { formattedPaymentStats } = this;

    render(
      <GraphAndDates
        isFullScreenOn={isFullScreenOn}
        paymentStats={formattedPaymentStats}
        widthProp={width}
      />,
    );

    // const { rerender } = render(
    //   <GraphAndDates
    //     isFullScreenOn={isFullScreenOn}
    //     paymentStats={formattedPaymentStats}
    //     widthProp={width}
    //   />,
    // );

    // this.rerenderFunc = rerender;
  },

  // rerender(isFullScreenOn: boolean = false) {
  //   const { width } = this;
  //   const { formattedPaymentStats } = this;

  //   this.rerenderFunc(
  //     <GraphAndDates
  //       isFullScreenOn={isFullScreenOn}
  //       paymentStats={formattedPaymentStats}
  //       widthProp={width}
  //     />,
  //   );
  // },

  getGraphAndDates() {
    return screen.getByTestId('graphAndDates');
  },

  getSvgWrapper() {
    return screen.getByTestId('graphAndDatesSvgWrapper');
  },

  getDateElemsBlock() {
    return screen.getByTestId('dateElemsBlock');
  },

  fireKeyDownEvent(keyCode: KeyCode) {
    fireEvent.keyDown(this.getGraphAndDates(), { keyCode });
  },
};

export default GraphAndDatesPO;
