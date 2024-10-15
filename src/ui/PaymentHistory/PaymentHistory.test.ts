import { describe, it, expect } from '@jest/globals';

import { calcCurrentPeriodTotalAmount, FormattedPaymentStats } from './PaymentHistory';

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
  describe('function calcCurrentPeriodTotalAmount', () => {
    it('[1, 10, 100] should be 111', () => {
      expect(calcCurrentPeriodTotalAmount(createFormattedPaymentStats([1, 10, 100]))).toEqual({
        totalAmount: 111,
        integer: '$111',
        float: '',
      });
    });
    it('[123, -15, 1841.25] should be 1949.25', () => {
      expect(calcCurrentPeriodTotalAmount(
        createFormattedPaymentStats([123, -15, 1841.25]),
      )).toEqual({
        totalAmount: 1949.25,
        integer: '$1,949',
        float: '.25',
      });
    });
    it('[24.5612, -152, 11] should be -116.44', () => {
      expect(calcCurrentPeriodTotalAmount(
        createFormattedPaymentStats([24.5612, -152, 11]),
      )).toEqual({
        totalAmount: -116.44,
        integer: '$-116',
        float: '.44',
      });
    });
    it('[1251231.14512, -56712.3256, 231.262215] should be 1194750.08', () => {
      expect(calcCurrentPeriodTotalAmount(
        createFormattedPaymentStats([1251231.14512, -56712.3256, 231.262215]),
      )).toEqual({
        totalAmount: 1194750.08,
        integer: '$1,194,750',
        float: '.08',
      });
    });
  });
});
