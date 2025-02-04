/* eslint-disable indent */
import { waitFor } from '@testing-library/react';
import {
  calcAndFormatCurrentPeriodTotalAmount,
  FormattedPaymentStats,
  divideDate,
  calcComparePercent,
  ActiveDateRange,
} from './PaymentHistory';
import PaymentHistoryPO from './PaymentHistory.po';

/*
FUNCTIONALITY DESCRIPTION / CHECKLIST

=== DateRangeBtn
== on active/inactive:
= classes [DONE]
= aria-checked [DONE]
= aria-label [DONE]
== toggling [DONE]

=== PaymentHistory
== on fullscreen on/off: width [DONE]
== totalAmount [DONE]
== comparePercentStr [DONE]
== compareText [DONE]
== currentPeriodAmountLabelText [DONE]
== animation [DONE]
== on fullscreen: add class 'col-[1_/_3]' [DONE]
== fullscreen btn:
= aria-label [DONE]
= classes (and icon itself) of icon [DONE]
= toggling [DONE]

=== divideDate [DONE]

=== calcAndFormatCurrentPeriodTotalAmount [DONE]

=== calcComparePercent [DONE]
*/

function createFormattedPaymentStats(numsArr: number[]): FormattedPaymentStats[] {
  return numsArr.map<FormattedPaymentStats>((num) => ({
    amount: num,
    day: 1,
    month: 'January',
    monthNum: 0,
    year: 2024,
    weekday: 'Monday',
  }));
}

function testRangeBtnsFabric(testName: string, btns: ActiveDateRange[]) {
  function testAriaChecked(testedBtn: ActiveDateRange) {
    const rangeBtns = PaymentHistoryPO.getRangeBtns();

    function shouldBeChecked(currentBtn: ActiveDateRange) {
      return currentBtn === testedBtn ? 'true' : 'false';
    }

    expect(rangeBtns['1M']).toHaveAttribute('aria-checked', shouldBeChecked('1M'));
    expect(rangeBtns['3M']).toHaveAttribute('aria-checked', shouldBeChecked('3M'));
    expect(rangeBtns['6M']).toHaveAttribute('aria-checked', shouldBeChecked('6M'));
    expect(rangeBtns['1Y']).toHaveAttribute('aria-checked', shouldBeChecked('1Y'));
  }

  function testActiveInactiveClasses(testedBtn: ActiveDateRange) {
    const rangeBtns = PaymentHistoryPO.getRangeBtns();

    function defineClasses(currentBtn: ActiveDateRange) {
      if (currentBtn === testedBtn) return PaymentHistoryPO.rangeBtnsClasses.active;

      return PaymentHistoryPO.rangeBtnsClasses.inactive;
    }

    expect(rangeBtns['1M']).toHaveClass(defineClasses('1M'));
    expect(rangeBtns['3M']).toHaveClass(defineClasses('3M'));
    expect(rangeBtns['6M']).toHaveClass(defineClasses('6M'));
    expect(rangeBtns['1Y']).toHaveClass(defineClasses('1Y'));
  }

  it(testName, () => {
    PaymentHistoryPO.render(true);

    const rangeBtns = PaymentHistoryPO.getRangeBtns();
    const totalAmountParagraph = PaymentHistoryPO.getTotalAmountParagraph();
    const periodPercentBadge = PaymentHistoryPO.getPercentBadge();
    const compareTextParagraph = PaymentHistoryPO.getCompareTextParagraph();
    const currentPeriodInfoBlock = PaymentHistoryPO.getCurrentPeriodInfoBlock();

    testAriaChecked('1M');
    testActiveInactiveClasses('1M');

    expect(rangeBtns['1M']).toHaveAttribute('aria-label', PaymentHistoryPO.rangeBtnsAriaLabelTexts['1M']);

    expect(totalAmountParagraph).toHaveTextContent(PaymentHistoryPO.amountsPerPeriod['1M']);
    expect(periodPercentBadge).toHaveTextContent(PaymentHistoryPO.percentPerPeriod['1M']);
    expect(compareTextParagraph).toHaveTextContent(PaymentHistoryPO.compareTextPerPeriod['1M']);
    expect(currentPeriodInfoBlock).toHaveAttribute('aria-label', PaymentHistoryPO.createInfoBlockLabelText(
      PaymentHistoryPO.amountsPerPeriod['1M'],
      PaymentHistoryPO.percentPerPeriod['1M'],
    ));

    btns.forEach((btn) => {
      PaymentHistoryPO.clickOnRangeBtn(btn);

      testAriaChecked(btn);
      testActiveInactiveClasses(btn);

      expect(rangeBtns[btn]).toHaveAttribute('aria-label', PaymentHistoryPO.rangeBtnsAriaLabelTexts[btn]);

      expect(totalAmountParagraph).toHaveTextContent(PaymentHistoryPO.amountsPerPeriod[btn]);
      expect(periodPercentBadge).toHaveTextContent(PaymentHistoryPO.percentPerPeriod[btn]);
      expect(compareTextParagraph).toHaveTextContent(
        PaymentHistoryPO.compareTextPerPeriod[btn],
      );
      expect(currentPeriodInfoBlock).toHaveAttribute('aria-label', PaymentHistoryPO.createInfoBlockLabelText(
        PaymentHistoryPO.amountsPerPeriod[btn],
        PaymentHistoryPO.percentPerPeriod[btn],
      ));
    });
  });
}

async function testTogglingFullscreenBtn(
  paymentHistory: HTMLElement,
  fullScreenButton: HTMLElement,
  isFullScreenOn: boolean,
) {
  const fullScreenBtnIcon = PaymentHistoryPO.getFullScreenBtnIcon();

  expect(paymentHistory).toHaveStyle({
    transitionDuration: '150ms',
    transitionProperty: 'all',
    transitionTimingFunction: 'ease-in-out',
  });

  await waitFor(() => {
    expect(paymentHistory).toHaveStyle({
      transitionDuration: '',
      transitionProperty: '',
      transitionTimingFunction: '',
    });
  });

  if (isFullScreenOn) {
    expect(paymentHistory).toHaveClass(PaymentHistoryPO.paymentHistoryFullScreenOnClass);
    expect(paymentHistory).toHaveStyle({ width: `${PaymentHistoryPO.fullScreenWidth}px` });

    expect(fullScreenButton).toHaveAttribute('aria-label', PaymentHistoryPO.fullScreenBtnOnAriaLabelValue);

    expect(fullScreenBtnIcon).toHaveClass(PaymentHistoryPO.fullScreenBtnIconClasses.on);
  } else {
    expect(paymentHistory).toHaveStyle({ width: `${PaymentHistoryPO.notFullScreenWidth}px` });

    expect(fullScreenButton).toHaveAttribute('aria-label', PaymentHistoryPO.fullScreenBtnOffAriaLabelValue);

    expect(fullScreenBtnIcon).toHaveClass(PaymentHistoryPO.fullScreenBtnIconClasses.off);
  }
}

describe('PaymentHistory utility functions', () => {
  describe('function divideDate', () => {
    const table: {
      day: number, month: string, monthNum: number, year: number, weekday: string
    }[] = [
        { day: 18, month: 'Oct', monthNum: 10, year: 2024, weekday: 'Friday' },
        { day: 2, month: 'Apr', monthNum: 4, year: 2024, weekday: 'Tuesday' },
        { day: 9, month: 'Aug', monthNum: 8, year: 2023, weekday: 'Wednesday' },
        { day: 28, month: 'Feb', monthNum: 2, year: 2023, weekday: 'Tuesday' },
        { day: 31, month: 'Dec', monthNum: 12, year: 2023, weekday: 'Sunday' },
      ];

    it.each(table)(
      '$monthNum-$day-$year should be {day: $day, month: $month, monthNum: $monthNum, year: $year, weekday: $weekday',
      (objDate) => {
        expect(divideDate(`${objDate.monthNum}-${objDate.day}-${objDate.year}`)).toEqual(objDate);
      },
    );
  });

  describe('function calcAndFormatCurrentPeriodTotalAmount', () => {
    it('[1, 10, 100] should be 111', () => {
      expect(calcAndFormatCurrentPeriodTotalAmount(
        createFormattedPaymentStats([1, 10, 100]),
      )).toEqual({
        totalAmount: 111,
        integer: '$111',
        float: '',
      });
    });
    it('[123, -15, 1841.25] should be 1949.25', () => {
      expect(calcAndFormatCurrentPeriodTotalAmount(
        createFormattedPaymentStats([123, -15, 1841.25]),
      )).toEqual({
        totalAmount: 1949.25,
        integer: '$1,949',
        float: '.25',
      });
    });
    it('[24.5612, -152, 11] should be -116.44', () => {
      expect(calcAndFormatCurrentPeriodTotalAmount(
        createFormattedPaymentStats([24.5612, -152, 11]),
      )).toEqual({
        totalAmount: -116.44,
        integer: '$-116',
        float: '.44',
      });
    });
    it('[1251231.14512, -56712.3256, 231.262215] should be 1194750.08', () => {
      expect(calcAndFormatCurrentPeriodTotalAmount(
        createFormattedPaymentStats([1251231.14512, -56712.3256, 231.262215]),
      )).toEqual({
        totalAmount: 1194750.08,
        integer: '$1,194,750',
        float: '.08',
      });
    });
  });

  describe('function calcComparePercent', () => {
    it('compare percent of 20 and 100 should be 400', () => {
      expect(calcComparePercent(20, 100)).toBe(400);
    });
    it('compare percent of 100 and 20 should be -80', () => {
      expect(calcComparePercent(100, 20)).toBe(-80);
    });
    it('compare percent of -20 and 100 should be 600', () => {
      expect(calcComparePercent(-20, 100)).toBe(600);
    });
    it('compare percent of 20 and -100 should be -600', () => {
      expect(calcComparePercent(20, -100)).toBe(-600);
    });
    it('compare percent of -100 and 20 should be 120', () => {
      expect(calcComparePercent(-100, 20)).toBe(120);
    });
    it('compare percent of 100 and -20 should be -120', () => {
      expect(calcComparePercent(100, -20)).toBe(-120);
    });
    it('compare percent of -20 and -100 should be -400', () => {
      expect(calcComparePercent(-20, -100)).toBe(-400);
    });
    it('compare percent of -100 and -20 should be 80', () => {
      expect(calcComparePercent(-100, -20)).toBe(80);
    });
    it('compare percent of 615 and 392 should be -36', () => {
      expect(calcComparePercent(615, 392)).toBe(-36);
    });
    it('compare percent of 5402 and -8508 should be -257', () => {
      expect(calcComparePercent(5402, -8508)).toBe(-257);
    });
    it('compare percent of 783.15 and -679.42 should be -187', () => {
      expect(calcComparePercent(783.15, -679.42)).toBe(-187);
    });
    it('compare percent of 4189.86 and 4449.17 should be 6', () => {
      expect(calcComparePercent(4189.86, 4449.17)).toBe(6);
    });
    it('compare percent of -80364.45 and 97252.94 should be 221', () => {
      expect(calcComparePercent(-80364.45, 97252.94)).toBe(221);
    });
  });
});

describe('PaymentHistory function', () => {
  describe('toggle fullScreenButton', () => {
    it('from off to on to off', async () => {
      PaymentHistoryPO.render();

      const fullScreenButton = PaymentHistoryPO.getFullScreenBtn();
      const paymentHistory = PaymentHistoryPO.getPaymentHistory();

      expect(fullScreenButton).toHaveAttribute('aria-label', PaymentHistoryPO.fullScreenBtnOffAriaLabelValue);
      expect(paymentHistory).toHaveStyle({ width: `${PaymentHistoryPO.notFullScreenWidth}px` });

      PaymentHistoryPO.clickOnFullScreenBtn();

      await testTogglingFullscreenBtn(paymentHistory, fullScreenButton, true);

      PaymentHistoryPO.clickOnFullScreenBtn();

      await testTogglingFullscreenBtn(paymentHistory, fullScreenButton, false);
    });
    it('from on to off to on', async () => {
      PaymentHistoryPO.render(true);

      const fullScreenButton = PaymentHistoryPO.getFullScreenBtn();
      const paymentHistory = PaymentHistoryPO.getPaymentHistory();

      expect(fullScreenButton).toHaveAttribute('aria-label', PaymentHistoryPO.fullScreenBtnOnAriaLabelValue);
      expect(paymentHistory).toHaveStyle({ width: `${PaymentHistoryPO.fullScreenWidth}px` });

      PaymentHistoryPO.clickOnFullScreenBtn();

      await testTogglingFullscreenBtn(paymentHistory, fullScreenButton, false);

      PaymentHistoryPO.clickOnFullScreenBtn();

      await testTogglingFullscreenBtn(paymentHistory, fullScreenButton, true);
    });
  });

  describe('toggle rangeButtons', () => {
    testRangeBtnsFabric('from 1M to 3M to 1M', ['3M', '1M']);
    testRangeBtnsFabric('from 1M to 6M to 1M', ['6M', '1M']);
    testRangeBtnsFabric('from 1M to 1Y to 1M', ['1Y', '1M']);
    testRangeBtnsFabric('from 1M to 3M to 6M to 1Y to 1M', ['3M', '6M', '1Y', '1M']);
  });
});
