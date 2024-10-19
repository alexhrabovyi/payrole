/* eslint-disable indent */
import {
  calcAndFormatCurrentPeriodTotalAmount,
  FormattedPaymentStats,
  divideDate,
  calcComparePercent,
  ActiveDateRange,
} from './PaymentHistory';
import PaymentHistoryPO from './PaymentHistory.po';

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
  function shouldBeChecked(testBtn: ActiveDateRange, testedBtn: ActiveDateRange) {
    return testBtn === testedBtn ? 'true' : 'false';
  }

  it(testName, () => {
    PaymentHistoryPO.render(true);

    const rangeBtns = PaymentHistoryPO.getRangeBtns();
    const totalAmountParagraph = PaymentHistoryPO.getTotalAmountParagraph();
    const periodPercentBadge = PaymentHistoryPO.getPercentBadge();
    const compareTextParagraph = PaymentHistoryPO.getCompareTextParagraph();

    expect(rangeBtns['1M']).toHaveAttribute('aria-checked', 'true');
    expect(rangeBtns['3M']).toHaveAttribute('aria-checked', 'false');
    expect(rangeBtns['6M']).toHaveAttribute('aria-checked', 'false');
    expect(rangeBtns['1Y']).toHaveAttribute('aria-checked', 'false');

    expect(totalAmountParagraph).toHaveTextContent(PaymentHistoryPO.amountsPerPeriod['1M']);
    expect(periodPercentBadge).toHaveTextContent(PaymentHistoryPO.percentPerPeriod['1M']);
    expect(compareTextParagraph).toHaveTextContent(PaymentHistoryPO.compareTextPerPeriod['1M']);

    btns.forEach((btn) => {
      PaymentHistoryPO.clickOnRangeBtn(btn);

      expect(rangeBtns['1M']).toHaveAttribute('aria-checked', shouldBeChecked('1M', btn));
      expect(rangeBtns['3M']).toHaveAttribute('aria-checked', shouldBeChecked('3M', btn));
      expect(rangeBtns['6M']).toHaveAttribute('aria-checked', shouldBeChecked('6M', btn));
      expect(rangeBtns['1Y']).toHaveAttribute('aria-checked', shouldBeChecked('1Y', btn));

      expect(totalAmountParagraph).toHaveTextContent(PaymentHistoryPO.amountsPerPeriod[btn]);
      expect(periodPercentBadge).toHaveTextContent(PaymentHistoryPO.percentPerPeriod[btn]);
      expect(compareTextParagraph).toHaveTextContent(
        PaymentHistoryPO.compareTextPerPeriod[btn],
      );
    });
  });
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
    it('from off to on to off', () => {
      PaymentHistoryPO.render();

      const fullScreenButton = PaymentHistoryPO.getFullScreenBtn();
      const paymentHistory = PaymentHistoryPO.getPaymentHistory();

      expect(fullScreenButton).toHaveAttribute('aria-label', PaymentHistoryPO.fullScreenBtnOffAriaLabelValue);
      expect(paymentHistory).toHaveStyle({ width: `${PaymentHistoryPO.notFullScreenWidth}px` });

      PaymentHistoryPO.clickOnFullScreenBtn();

      expect(fullScreenButton).toHaveAttribute('aria-label', PaymentHistoryPO.fullScreenBtnOnAriaLabelValue);
      expect(paymentHistory).toHaveStyle({ width: `${PaymentHistoryPO.fullScreenWidth}px` });

      PaymentHistoryPO.clickOnFullScreenBtn();

      expect(fullScreenButton).toHaveAttribute('aria-label', PaymentHistoryPO.fullScreenBtnOffAriaLabelValue);
      expect(paymentHistory).toHaveStyle({ width: `${PaymentHistoryPO.notFullScreenWidth}px` });
    });
    it('from on to off to on', () => {
      PaymentHistoryPO.render(true);

      const fullScreenButton = PaymentHistoryPO.getFullScreenBtn();
      const paymentHistory = PaymentHistoryPO.getPaymentHistory();

      expect(fullScreenButton).toHaveAttribute('aria-label', PaymentHistoryPO.fullScreenBtnOnAriaLabelValue);
      expect(paymentHistory).toHaveStyle({ width: `${PaymentHistoryPO.fullScreenWidth}px` });

      PaymentHistoryPO.clickOnFullScreenBtn();

      expect(fullScreenButton).toHaveAttribute('aria-label', PaymentHistoryPO.fullScreenBtnOffAriaLabelValue);
      expect(paymentHistory).toHaveStyle({ width: `${PaymentHistoryPO.notFullScreenWidth}px` });

      PaymentHistoryPO.clickOnFullScreenBtn();

      expect(fullScreenButton).toHaveAttribute('aria-label', PaymentHistoryPO.fullScreenBtnOnAriaLabelValue);
      expect(paymentHistory).toHaveStyle({ width: `${PaymentHistoryPO.fullScreenWidth}px` });
    });
  });

  describe('toggle rangeButtons', () => {
    testRangeBtnsFabric('from 1M to 3M to 1M', ['3M', '1M']);
    testRangeBtnsFabric('from 1M to 6M to 1M', ['6M', '1M']);
    testRangeBtnsFabric('from 1M to 1Y to 1M', ['1Y', '1M']);
    testRangeBtnsFabric('from 1M to 3M to 6M to 1Y to 1M', ['3M', '6M', '1Y', '1M']);
  });
});
