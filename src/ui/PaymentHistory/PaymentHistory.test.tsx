/* eslint-disable indent */
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { PaymentAndTransactionMetrics } from '../PaymentAndTransactionWrapper/PaymentAndTransactionWrapper';
import PaymentHistory, {
  calcAndFormatCurrentPeriodTotalAmount,
  FormattedPaymentStats,
  divideDate,
  calcComparePercent,
} from './PaymentHistory';

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
    it('from off to on', () => {
      const WrapperElement = () => {
        const [isFullScreenOn, setIsFullScreenOn] = useState(false);
        const wrapperMetrics: PaymentAndTransactionMetrics = {
          width: 100,
          height: 100,
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

      const fullScreenButton = screen.getByTestId('fullScreenButton');

      expect(fullScreenButton).toHaveAttribute('aria-label', 'Show payment history chart on fullscreen');

      fireEvent.click(screen.getByTestId('fullScreenButton'));

      expect(fullScreenButton).toHaveAttribute('aria-label', 'Close fullscreen payment history chart');
    });
    // it('from on to off', () => {
    //   render(PaymentHistory as unknown as ReactNode);
    //   const fullScreenButton = screen.getByTestId('fullScreenButton');

    //   expect(fullScreenButton).toHaveAttribute('aria-label', 'Show payment history chart on fullscreen');

    //   fireEvent.click(screen.getByTestId('fullScreenButton'));

    //   expect(fullScreenButton).toHaveAttribute('aria-label', 'Close fullscreen payment history chart');
    // });
  });
});
