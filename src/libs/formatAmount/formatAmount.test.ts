import { describe, it, expect } from '@jest/globals';

import formatAmount from './formatAmount';

// what is coverage and how it is supposed to look like. Performance
// how to test certain files, not all
// vscode extension
// recreate these tests to fabric style
// check commented options in jest.config.js

describe('function formatAmount', () => {
  describe('positive integers', () => {
    it('1 should return 1', () => {
      expect(formatAmount(1)).toBe('1');
    });
    it('10 should return 10', () => {
      expect(formatAmount(10)).toBe('10');
    });
    it('100 should return 100', () => {
      expect(formatAmount(100)).toBe('100');
    });
    it('1000 should return 1,000', () => {
      expect(formatAmount(1000)).toBe('1,000');
    });
    it('10000 should return 10,000', () => {
      expect(formatAmount(10000)).toBe('10,000');
    });
    it('100000 should return 100,000', () => {
      expect(formatAmount(100000)).toBe('100,000');
    });
    it('1000000 should return 1,000,000', () => {
      expect(formatAmount(1000000)).toBe('1,000,000');
    });
  });

  describe('negative integers', () => {
    it('-1 should return -1', () => {
      expect(formatAmount(-1)).toBe('-1');
    });
    it('-10 should return -10', () => {
      expect(formatAmount(-10)).toBe('-10');
    });
    it('-100 should return -100', () => {
      expect(formatAmount(-100)).toBe('-100');
    });
    it('-1000 should return -1,000', () => {
      expect(formatAmount(-1000)).toBe('-1,000');
    });
    it('-10000 should return -10,000', () => {
      expect(formatAmount(-10000)).toBe('-10,000');
    });
    it('-100000 should return -100,000', () => {
      expect(formatAmount(-100000)).toBe('-100,000');
    });
    it('-1000000 should return -1,000,000', () => {
      expect(formatAmount(-1000000)).toBe('-1,000,000');
    });
  });

  describe('positive float numbers', () => {
    it('1.25 should return 1.25', () => {
      expect(formatAmount(1.25)).toBe('1.25');
    });
    it('10.25 should return 10.25', () => {
      expect(formatAmount(10.25)).toBe('10.25');
    });
    it('100.25 should return 100.25', () => {
      expect(formatAmount(100.25)).toBe('100.25');
    });
    it('1000.25 should return 1,000.25', () => {
      expect(formatAmount(1000.25)).toBe('1,000.25');
    });
    it('10000.25 should return 10,000.25', () => {
      expect(formatAmount(10000.25)).toBe('10,000.25');
    });
    it('100000.25 should return 100,000.25', () => {
      expect(formatAmount(100000.25)).toBe('100,000.25');
    });
    it('1000000.25 should return 1,000,000.25', () => {
      expect(formatAmount(1000000.25)).toBe('1,000,000.25');
    });

    describe('with one-digit float part', () => {
      it('1.2 should return 1.20', () => {
        expect(formatAmount(1.2)).toBe('1.20');
      });
      it('10.2 should return 10.20', () => {
        expect(formatAmount(10.2)).toBe('10.20');
      });
      it('100.2 should return 100.20', () => {
        expect(formatAmount(100.2)).toBe('100.20');
      });
      it('1000.2 should return 1,000.20', () => {
        expect(formatAmount(1000.2)).toBe('1,000.20');
      });
      it('10000.2 should return 10,000.20', () => {
        expect(formatAmount(10000.2)).toBe('10,000.20');
      });
      it('100000.2 should return 100,000.20', () => {
        expect(formatAmount(100000.2)).toBe('100,000.20');
      });
      it('1000000.2 should return 1,000,000.20', () => {
        expect(formatAmount(1000000.2)).toBe('1,000,000.20');
      });
    });
  });

  describe('negative float numbers', () => {
    it('-1.25 should return -1.25', () => {
      expect(formatAmount(-1.25)).toBe('-1.25');
    });
    it('-10.25 should return -10.25', () => {
      expect(formatAmount(-10.25)).toBe('-10.25');
    });
    it('-100.25 should return -100.25', () => {
      expect(formatAmount(-100.25)).toBe('-100.25');
    });
    it('-1000.25 should return -1,000.25', () => {
      expect(formatAmount(-1000.25)).toBe('-1,000.25');
    });
    it('-10000.25 should return -10,000.25', () => {
      expect(formatAmount(-10000.25)).toBe('-10,000.25');
    });
    it('-100000.25 should return -100,000.25', () => {
      expect(formatAmount(-100000.25)).toBe('-100,000.25');
    });
    it('-1000000.25 should return -1,000,000.25', () => {
      expect(formatAmount(-1000000.25)).toBe('-1,000,000.25');
    });

    describe('with one-digit float part', () => {
      it('-1.2 should return -1.20', () => {
        expect(formatAmount(-1.2)).toBe('-1.20');
      });
      it('-10.2 should return -10.20', () => {
        expect(formatAmount(-10.2)).toBe('-10.20');
      });
      it('-100.2 should return -100.20', () => {
        expect(formatAmount(-100.2)).toBe('-100.20');
      });
      it('-1000.2 should return -1,000.20', () => {
        expect(formatAmount(-1000.2)).toBe('-1,000.20');
      });
      it('-10000.2 should return -10,000.20', () => {
        expect(formatAmount(-10000.2)).toBe('-10,000.20');
      });
      it('-100000.2 should return -100,000.20', () => {
        expect(formatAmount(-100000.2)).toBe('-100,000.20');
      });
      it('-1000000.2 should return -1,000,000.20', () => {
        expect(formatAmount(-1000000.2)).toBe('-1,000,000.20');
      });
    });
  });
});
