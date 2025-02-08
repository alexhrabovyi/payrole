import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import DateRangeButtonPO from './DateRangeButton/DateRangeButton.po';
import GraphAndDatesPO from './GraphAndDates/GraphAndDates.po';
import { PaymentAndTransactionMetrics } from '../PaymentAndTransactionWrapper/PaymentAndTransactionWrapper';
import PaymentHistory from './PaymentHistory';

const PaymentHistoryPO = {
  fullScreenBtnOffAriaLabelValue: 'Show payment history chart on fullscreen',
  fullScreenBtnOnAriaLabelValue: 'Close fullscreen payment history chart',

  paymentHistoryFullScreenOnClass: 'col-[1_/_3]',

  fullScreenBtnIconClasses: {
    on: 'hover:scale-[0.8]',
    off: 'hover:scale-[1.2]',
  },

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

  createInfoBlockLabelText(totalAmountStr: string, comparePercentStr: string) {
    const comparePercent = Number(comparePercentStr.match(/-?\d+/));
    const formattedComparePercent = comparePercentStr.match(/-?\d+%/);
    const formattedAmountStr = totalAmountStr.replace(/,/g, '');

    const currentPeriodAmountLabelText = `${formattedAmountStr} is total amount for the chosen period of time. 
    It's ${formattedComparePercent} ${comparePercent >= 0 ? 'rise' : 'fall'} comparing to the previous period of time`;

    return currentPeriodAmountLabelText;
  },

  render(
    initFullScreenOn = false,
    windowWidth = 1500,
  ) {
    const { fullScreenWidth, notFullScreenWidth } = this;

    const WrapperElement = () => {
      const [isFullScreenOn, setIsFullScreenOn] = useState(initFullScreenOn);

      const wrapperMetrics: PaymentAndTransactionMetrics = {
        windowWidth,
        width: fullScreenWidth,
        height: 500,
        colGap: fullScreenWidth - (notFullScreenWidth * 2),
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

  getFullScreenBtnIcon() {
    return screen.getByTestId('fullScreenBtnIcon');
  },

  clickOnFullScreenBtn() {
    fireEvent.click(this.getFullScreenBtn());
  },

  rangeBtnsClasses: DateRangeButtonPO.classes,

  rangeBtnsAriaLabelTexts: DateRangeButtonPO.ariaLabelText,

  getRangeBtns: DateRangeButtonPO.getRangeBtns,

  clickOnRangeBtn: DateRangeButtonPO.clickOnRangeBtn,

  getTotalAmountParagraph() {
    return screen.getByTestId('totalAmountParagraph');
  },

  getPercentBadge() {
    return screen.getByTestId('periodPercentBadge');
  },

  getCompareTextParagraph() {
    return screen.getByTestId('compareTextParagraph');
  },

  getCurrentPeriodInfoBlock() {
    return screen.getByTestId('currentPeriodInfoBlock');
  },

  getDateElemsBlock() {
    return GraphAndDatesPO.getDateElemsBlock();
  },
};

export default PaymentHistoryPO;
