import { FillProps, StatsWithCoords, StrokeProps } from '../GraphAndDates';
import { calcYCoord, calcNextAdditionalCoords, calcXYSteps, isZeroLineNeeded, AmountType, MinMaxAmount, MinMaxCoords, createGraphElems, XYStepsType } from './graphAndDatesUtils';

function createGraphElemsTestFabric(testName: string, nums: number[]) {
  const STROKE_PROPS: StrokeProps = {
    width: '2',
    colorGreen: '#0AAF60',
    colorRed: '#FA4545',
    linejoin: 'round',
    strokeLinecap: 'round',
  };

  const FILL_PROPS: FillProps = {
    colorGreen: 'url(#greenGradient)',
    colorRed: 'url(#redGradient)',
    opacity: '0.3',
  };

  const XStep = 10;
  const YStep = 10;
  const XYSteps: XYStepsType = {
    XStep,
    YStep,
  };

  const minXCoord = 0;
  const maxXCoord = nums.length * XStep;
  const minYCoord = 0;
  const maxYCoord = YStep * nums.length;
  const minMaxCoords: MinMaxCoords = {
    minXCoord,
    maxXCoord,
    minYCoord,
    maxYCoord,
  };

  const minAmount = Math.min(...nums);
  const maxAmount = Math.max(...nums);
  const minMaxAmount: MinMaxAmount = {
    minAmount,
    maxAmount,
  };

  const statsWithCoords: StatsWithCoords[] = nums.map((num, i) => ({
    amount: num,
    day: 1,
    month: 'January',
    monthNum: 0,
    year: 2024,
    weekday: 'Monday',
    x: XStep * i,
    y: calcYCoord(num, minAmount, YStep, maxYCoord),
  }));

  it(testName, () => {
    expect(createGraphElems(
      statsWithCoords,
      minMaxAmount,
      minMaxCoords,
      XYSteps,
      STROKE_PROPS,
      FILL_PROPS,
    )).toEqual();
  });
}

describe('GraphAndDates utility functions', () => {
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

  describe('function calcNextAdditionalCoords', () => {
    it.each([
      {
        currentX: 15,
        nextX: 31,
        currentAmount: 316,
        nextAmount: 1824,
        zeroLineYCoord: 30,
        result: {
          x: 17.362616822429906,
          y: 30,
        },
      },
      {
        currentX: 110,
        nextX: 317,
        currentAmount: -125,
        nextAmount: 1256,
        zeroLineYCoord: 10,
        result: {
          x: 128.7364228819696,
          y: 10,
        },
      },
      {
        currentX: 171,
        nextX: 1721,
        currentAmount: 1623,
        nextAmount: -112362,
        zeroLineYCoord: 100,
        result: {
          x: 193.07000921173838,
          y: 100,
        },
      },
      {
        currentX: 61.25873456,
        nextX: 512.89621,
        currentAmount: -262342.25,
        nextAmount: -12315.71,
        zeroLineYCoord: 525.12,
        result: {
          x: 492.64470819516913,
          y: 525.12,
        },
      },
    ])('currentX: $currentX, nextX: $nextX, currentAmount: $currentAmount, ... should be {x: $result.x, y: $result.y}', ({
      currentX,
      nextX,
      currentAmount,
      nextAmount,
      zeroLineYCoord,
      result,
    }) => {
      expect(calcNextAdditionalCoords({
        currentX,
        nextX,
        currentAmount,
        nextAmount,
        zeroLineYCoord,
      })).toEqual(result);
    });
  });

  describe('function calcXYSteps', () => {
    it.each([
      {
        minMaxCoords: {
          minXCoord: 100,
          maxXCoord: 1000,
          minYCoord: 100,
          maxYCoord: 1000,
        },
        minMaxAmount: {
          minAmount: 0,
          maxAmount: 1000,
        },
        daysAmount: 31,
        result: {
          XStep: 30,
          YStep: 0.9,
        },
      },
      {
        minMaxCoords: {
          minXCoord: 4861.24,
          maxXCoord: 6259.53,
          minYCoord: 4303.80,
          maxYCoord: 8980.89,
        },
        minMaxAmount: {
          minAmount: -1806,
          maxAmount: 7818,
        },
        daysAmount: 64,
        result: {
          XStep: 22.195079365079366,
          YStep: 0.48598192019950115,
        },
      },
      {
        minMaxCoords: {
          minXCoord: 177.69,
          maxXCoord: 598.46,
          minYCoord: 222.90,
          maxYCoord: 481.76,
        },
        minMaxAmount: {
          minAmount: 1056.50,
          maxAmount: 6167.80,
        },
        daysAmount: 54,
        result: {
          XStep: 7.939056603773586,
          YStep: 0.05064465008901845,
        },
      },
    ])('minMaxAmount, minMaxCoords, daysAmount: $daysAmount, should be XStep: $result.XStep, YStep: $result.YStep', ({
      minMaxCoords,
      minMaxAmount,
      daysAmount,
      result,
    }) => {
      expect(calcXYSteps(minMaxAmount, minMaxCoords, daysAmount)).toEqual(result);
    });
  });

  describe('function isZeroLineNeeded', () => {
    it.each<{
      currentAmountType: AmountType,
      isNextAdditionalCoordsNeeded: boolean,
      isLast: boolean,
      isPrevCoordsExist: boolean,
      result: boolean,
    }>([
      {
        currentAmountType: 'negative',
        isNextAdditionalCoordsNeeded: false,
        isLast: false,
        isPrevCoordsExist: false,
        result: false,
      },
      {
        currentAmountType: 'negative',
        isNextAdditionalCoordsNeeded: true,
        isLast: false,
        isPrevCoordsExist: false,
        result: true,
      },
      {
        currentAmountType: 'negative',
        isNextAdditionalCoordsNeeded: false,
        isLast: true,
        isPrevCoordsExist: false,
        result: false,
      },
      {
        currentAmountType: 'negative',
        isNextAdditionalCoordsNeeded: false,
        isLast: true,
        isPrevCoordsExist: true,
        result: true,
      },
      {
        currentAmountType: 'positive',
        isNextAdditionalCoordsNeeded: false,
        isLast: false,
        isPrevCoordsExist: false,
        result: false,
      },
      {
        currentAmountType: 'positive',
        isNextAdditionalCoordsNeeded: true,
        isLast: false,
        isPrevCoordsExist: false,
        result: false,
      },
      {
        currentAmountType: 'positive',
        isNextAdditionalCoordsNeeded: false,
        isLast: true,
        isPrevCoordsExist: false,
        result: false,
      },
      {
        currentAmountType: 'positive',
        isNextAdditionalCoordsNeeded: false,
        isLast: true,
        isPrevCoordsExist: true,
        result: false,
      },
    ])('currentType: $currentAmountType, isNextNeeded: $isNextAdditionalCoordsNeeded, isLast: $isLast, isPrevExist: $isPrevCoordsExist should be $result', ({
      currentAmountType,
      isNextAdditionalCoordsNeeded,
      isLast,
      isPrevCoordsExist,
      result,
    }) => {
      expect(isZeroLineNeeded(
        currentAmountType,
        isNextAdditionalCoordsNeeded,
        isLast,
        isPrevCoordsExist,
      )).toBe(result);
    });
  });

  describe('function createGraphElems', () => {

  });
});
