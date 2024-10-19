import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { PaymentAndTransactionMetrics } from '../PaymentAndTransactionWrapper/PaymentAndTransactionWrapper';
import PaymentHistory, { ActiveDateRange } from './PaymentHistory';

const PaymentHistoryPO = {
  fullScreenBtnOffAriaLabelValue: 'Show payment history chart on fullscreen',
  fullScreenBtnOnAriaLabelValue: 'Close fullscreen payment history chart',

  amountsPerPeriod: {
    '1M': '$827.36',
    '3M': '$158,949.41',
    '6M': '$266,306.99',
    '1Y': '$249,181.18',
  },

  percentPerPeriod: {
    '1M': '-99%',
    '3M': '+48%',
    '6M': '+3337%',
    '1Y': '+455%',
  },

  compareTextPerPeriod: {
    '1M': 'vs last month',
    '3M': 'vs last 3 months',
    '6M': 'vs last 6 months',
    '1Y': 'vs last year',
  },

  fullScreenWidth: 1500,
  notFullScreenWidth: 740,

  render(
    initFullScreenOn: boolean = false,
  ) {
    const { fullScreenWidth } = this;

    const WrapperElement = () => {
      const [isFullScreenOn, setIsFullScreenOn] = useState(initFullScreenOn);

      const wrapperMetrics: PaymentAndTransactionMetrics = {
        width: fullScreenWidth,
        height: 500,
        colGap: 20,
        rowGap: 20,
      };

      return (
        <PaymentHistory
          isFullScreenOn={isFullScreenOn}
          setIsFullScreenOn={setIsFullScreenOn}
          wrapperMetrics={wrapperMetrics}
        />
      );
    };

    render(<WrapperElement />);
  },

  getPaymentHistory() {
    return screen.getByTestId('paymentHistory');
  },

  getFullScreenBtn() {
    return screen.getByTestId('fullScreenButton');
  },

  clickOnFullScreenBtn() {
    fireEvent.click(this.getFullScreenBtn());
  },

  getRangeBtns(): Record<ActiveDateRange, HTMLElement> {
    return {
      '1M': screen.getByTestId('rangeBtn-1m'),
      '3M': screen.getByTestId('rangeBtn-3m'),
      '6M': screen.getByTestId('rangeBtn-6m'),
      '1Y': screen.getByTestId('rangeBtn-1y'),
    };
  },

  clickOnRangeBtn(type: ActiveDateRange) {
    const rangeBtns = this.getRangeBtns();

    fireEvent.click(rangeBtns[type]);
  },

  getTotalAmountParagraph() {
    return screen.getByTestId('totalAmountParagraph');
  },

  getPercentBadge() {
    return screen.getByTestId('periodPercentBadge');
  },

  getCompareTextParagraph() {
    return screen.getByTestId('compareTextParagraph');
  },
};

export default PaymentHistoryPO;
