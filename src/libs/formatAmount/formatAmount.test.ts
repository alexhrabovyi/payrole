import { describe, it, expect } from '@jest/globals';

import formatAmount from './formatAmount';

function testFactory(table: Array<[number, string]>) {
  it.each(table)('%i should return %s', (num, expected) => {
    expect(formatAmount(num)).toBe(expected);
  });
}

describe('function formatAmount', () => {
  describe('positive integers', () => {
    testFactory([
      [1, '1'],
      [10, '10'],
      [100, '100'],
      [1000, '1,000'],
      [10000, '10,000'],
      [100000, '100,000'],
      [1000000, '1,000,000'],
    ]);
  });

  describe('negative integers', () => {
    testFactory([
      [-1, '-1'],
      [-10, '-10'],
      [-100, '-100'],
      [-1000, '-1,000'],
      [-10000, '-10,000'],
      [-100000, '-100,000'],
      [-1000000, '-1,000,000'],
    ]);
  });

  describe('positive float numbers', () => {
    testFactory([
      [1.25, '1.25'],
      [10.25, '10.25'],
      [100.25, '100.25'],
      [1000.25, '1,000.25'],
      [10000.25, '10,000.25'],
      [100000.25, '100,000.25'],
      [1000000.25, '1,000,000.25'],
    ]);

    describe('with one-digit float part', () => {
      testFactory([
        [1.2, '1.20'],
        [10.2, '10.20'],
        [100.2, '100.20'],
        [1000.2, '1,000.20'],
        [10000.2, '10,000.20'],
        [100000.2, '100,000.20'],
        [1000000.2, '1,000,000.20'],
      ]);
    });
  });

  describe('negative float numbers', () => {
    testFactory([
      [-1.25, '-1.25'],
      [-10.25, '-10.25'],
      [-100.25, '-100.25'],
      [-1000.25, '-1,000.25'],
      [-10000.25, '-10,000.25'],
      [-100000.25, '-100,000.25'],
      [-1000000.25, '-1,000,000.25'],
    ]);

    describe('with one-digit float part', () => {
      testFactory([
        [-1.2, '-1.20'],
        [-10.2, '-10.20'],
        [-100.2, '-100.20'],
        [-1000.2, '-1,000.20'],
        [-10000.2, '-10,000.20'],
        [-100000.2, '-100,000.20'],
        [-1000000.2, '-1,000,000.20'],
      ]);
    });
  });
});
