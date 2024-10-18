import { calcYCoord } from './GraphAndDates';

describe('GraphAndDatesProps utility functions', () => {
  describe('function calcYCoord', () => {
    it.each([
      {
        currentAmount: 324,
        minAmount: -526,
        Ystep: 0.03,
        maxYCoord: 311,
        result: 285.5,
      },
      {
        currentAmount: -452,
        minAmount: -1586,
        Ystep: 0.0015,
        maxYCoord: 527,
        result: 525.299,
      },
      {
        currentAmount: 10523,
        minAmount: -168001,
        Ystep: 0.00002356,
        maxYCoord: 321,
        result: 316.79397456,
      },
    ])('currentAmount: $currentAmount, minAmount: $minAmount, Ystep: $Ystep, maxYCoord: $maxYCoord should be $result', ({
      currentAmount,
      minAmount,
      Ystep,
      maxYCoord,
      result,
    }) => {
      expect(calcYCoord(currentAmount, minAmount, Ystep, maxYCoord)).toBe(result);
    });
  });
});
