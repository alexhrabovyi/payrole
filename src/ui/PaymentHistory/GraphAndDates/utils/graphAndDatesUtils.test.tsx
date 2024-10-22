import { ReactNode } from 'react';
import { FillProps, StatsWithCoords, StrokeProps } from '../GraphAndDates';
import {
  calcYCoord, calcNextAdditionalCoords, calcXYSteps, isZeroLineNeeded, AmountType,
  MinMaxAmount, MinMaxCoords, createGraphElems, XYStepsType, createDateElems,
} from './graphAndDatesUtils';

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

function xCoordsGenerator(amount: number, step: number) {
  const result: number[] = [];

  for (let i = 0; i < amount; i += 1) {
    result.push(i * step);
  }

  return result;
}

function createGraphElemsTestFabric(testName: string, nums: number[], result: ReactNode[]) {
  const XStep = 10;
  const YStep = 10;
  const XYSteps: XYStepsType = {
    XStep,
    YStep,
  };

  const minXCoord = 0;
  const maxXCoord = nums.length * XStep;
  const minYCoord = 0;
  const maxYCoord = nums.length * YStep;
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
    )).toEqual(result);
  });
}

function createDateElemsTestFabric(
  testName: string,
  xCoords: number[],
  isFullScreenOn: boolean,
  result: ReactNode[],
) {
  const OFFSET_X = 10;

  const statsWithCoords: StatsWithCoords[] = xCoords.map((x) => ({
    amount: 0,
    day: 1,
    month: 'January',
    monthNum: 0,
    year: 2024,
    weekday: 'Monday',
    x,
    y: 0,
  }));

  const svgWidth = xCoords[xCoords.length - 1];

  it(testName, () => {
    expect(createDateElems(
      statsWithCoords,
      isFullScreenOn,
      svgWidth,
      OFFSET_X,
    )).toEqual(result);
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
    ])(
      'currentType: $currentAmountType, isNextNeeded: $isNextAdditionalCoordsNeeded, isLast: $isLast, isPrevExist: $isPrevCoordsExist should be $result',
      ({
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
      },
    );
  });

  describe('function createGraphElems', () => {
    const testNums1 = [733, 594, 1781, 1220, 989, 2196, 2186, 3236, 757, 398];
    const testResults1 = [
      // just plain stoke line
      <path
        key="M 0 3250 L 10 1860 L 20 13730 L 30 8120 L 40 5810 L 50 17880 L 60 17780 L 70 28280 L 80 3490 L 90 100"
        d="M 0 3250 L 10 1860 L 20 13730 L 30 8120 L 40 5810 L 50 17880 L 60 17780 L 70 28280 L 80 3490 L 90 100"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      // line as one above, but it also goes to the zeroLine Y coord at the maxXCoord and then
      // to the zeroLine Y coord at the minXCoord and connects with the beginning, and fills
      <path
        key="M 0 3250 L 10 1860 L 20 13730 L 30 8120 L 40 5810 L 50 17880 L 60 17780 L 70 28280 L 80 3490 L 90 100 L 100 100 L 0 100 Z"
        d="M 0 3250 L 10 1860 L 20 13730 L 30 8120 L 40 5810 L 50 17880 L 60 17780 L 70 28280 L 80 3490 L 90 100 L 100 100 L 0 100 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];

    createGraphElemsTestFabric('only positive values, zeroLine isn`t needed', testNums1, testResults1);

    const testNum2 = [
      -3023.11, -1651.2, -858.4, -123.797, -1687.247,
      -361.374, -2075.657, -2929.541, -2665.191, -968.707,
    ];
    const testResults2 = [
      // just plain stoke line
      <path
        key="M 0 100 L 10 13619.1 L 20 21547.1 L 30 28893.13 L 40 13258.630000000001 L 50 26517.36 L 60 9374.529999999999 L 70 835.6899999999996 L 80 3479.1900000000032 L 90 20444.030000000002"
        d="M 0 100 L 10 13619.1 L 20 21547.1 L 30 28893.13 L 40 13258.630000000001 L 50 26517.36 L 60 9374.529999999999 L 70 835.6899999999996 L 80 3479.1900000000032 L 90 20444.030000000002"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      // line as one above, but it also goes to the zeroLine Y coord at the maxXCoord and then
      // to the zeroLine Y coord at the minXCoord and connects with the beginning, and fills
      <path
        key="M 0 100 L 10 13619.1 L 20 21547.1 L 30 28893.13 L 40 13258.630000000001 L 50 26517.36 L 60 9374.529999999999 L 70 835.6899999999996 L 80 3479.1900000000032 L 90 20444.030000000002 L 100 0 L 0 0 Z"
        d="M 0 100 L 10 13619.1 L 20 21547.1 L 30 28893.13 L 40 13258.630000000001 L 50 26517.36 L 60 9374.529999999999 L 70 835.6899999999996 L 80 3479.1900000000032 L 90 20444.030000000002 L 100 0 L 0 0 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];

    createGraphElemsTestFabric('only negative values, zeroLine isn`t needed', testNum2, testResults2);

    const testNum3 = [
      2329.53, 2231.970, 830.199, -2046.189, -3259.621,
      -1309.17, 2786.759, 291.569, 2822.235, 2279.543,
    ];
    const testResults3 = [
      // just plain stoke line that ends not with the position of next num,
      // but with the position of additional coordinates point between current and the next num
      <path
        key="M 0 55791.509999999995 L 10 54815.91 L 20 40798.200000000004 L 22.886255261807516 32496.21"
        d="M 0 55791.509999999995 L 10 54815.91 L 20 40798.200000000004 L 22.886255261807516 32496.21"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      // same as one above, but it goes to the zeroLine Y coord at minXCoord and connects with the
      // beginning, and fills
      <path
        key="M 0 55791.509999999995 L 10 54815.91 L 20 40798.200000000004 L 22.886255261807516 32496.21 L 0 32496.21 Z"
        d="M 0 55791.509999999995 L 10 54815.91 L 20 40798.200000000004 L 22.886255261807516 32496.21 L 0 32496.21 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      // zero line which starts at additional coords where between positive and negative nums and
      // ends at additional coords between negative and positive nums
      <path
        key="zeroLine22.88625526180751653.19627122442796"
        d="M 22.886255261807516 32496.21 L 53.19627122442796 32496.21"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      // negative stroke line which start at first additional coords and ends at second additional
      // coords
      <path
        key="M 22.886255261807516 32496.21 L 30 12034.32 L 40 100 L 50 19404.510000000002 L 53.19627122442796 32496.21"
        d="M 22.886255261807516 32496.21 L 30 12034.32 L 40 100 L 50 19404.510000000002 L 53.19627122442796 32496.21"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      // the same as one above, but it also connects with the beginning and fills
      <path
        key="M 22.886255261807516 32496.21 L 30 12034.32 L 40 100 L 50 19404.510000000002 L 53.19627122442796 32496.21 Z"
        d="M 22.886255261807516 32496.21 L 30 12034.32 L 40 100 L 50 19404.510000000002 L 53.19627122442796 32496.21 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
      // positive line which starts at additional coords which is between negative and positive
      // values
      <path
        key="M 53.19627122442796 32496.21 L 60 60363.8 L 70 35411.9 L 80 60718.56 L 90 55291.64000000001"
        d="M 53.19627122442796 32496.21 L 60 60363.8 L 70 35411.9 L 80 60718.56 L 90 55291.64000000001"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 53.19627122442796 32496.21 L 60 60363.8 L 70 35411.9 L 80 60718.56 L 90 55291.64000000001 L 100 32496.21 Z"
        d="M 53.19627122442796 32496.21 L 60 60363.8 L 70 35411.9 L 80 60718.56 L 90 55291.64000000001 L 100 32496.21 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];

    createGraphElemsTestFabric('positive values, some negative values in the middle with zero line, positive values', testNum3, testResults3);

    const testNum4 = [
      -2329.53, -2231.970, -830.199, 2046.189, 3259.621,
      1309.17, -2786.759, -291.569, -2822.235, -2279.543,
    ];
    const testResults4 = [
      // since after a couple of negative values there starts positive, we need to use additional
      // coords and zeroLine (because there is negative and positive values). This zeroLine starts
      // at minXCoord and ends at first additional coords
      <path
        key="zeroLine022.886255261807516"
        d="M 0 28122.350000000002 L 22.886255261807516 28122.350000000002"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      // negative stroke line which goes to the first additional coords
      <path
        key="M 0 4827.049999999999 L 10 5802.650000000003 L 20 19820.36 L 22.886255261807516 28122.350000000002"
        d="M 0 4827.049999999999 L 10 5802.650000000003 L 20 19820.36 L 22.886255261807516 28122.350000000002"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      // the same as above, but it also goes to zeroLine Y coord at minXCoord and connects
      // with the beginng, and fills
      <path
        key="M 0 4827.049999999999 L 10 5802.650000000003 L 20 19820.36 L 22.886255261807516 28122.350000000002 L 0 28122.350000000002 Z"
        d="M 0 4827.049999999999 L 10 5802.650000000003 L 20 19820.36 L 22.886255261807516 28122.350000000002 L 0 28122.350000000002 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
      // positive line which stars from additional coords since previous value is negative, and it
      // goes to the next additional coords because after a couple of positive values there is a
      // negative one
      <path
        key="M 22.886255261807516 28122.350000000002 L 30 48584.24 L 40 60718.56 L 50 41214.05 L 53.19627122442796 28122.350000000002"
        d="M 22.886255261807516 28122.350000000002 L 30 48584.24 L 40 60718.56 L 50 41214.05 L 53.19627122442796 28122.350000000002"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      // the same as one above, but it also connects with the beginning and fills
      <path
        key="M 22.886255261807516 28122.350000000002 L 30 48584.24 L 40 60718.56 L 50 41214.05 L 53.19627122442796 28122.350000000002 Z"
        d="M 22.886255261807516 28122.350000000002 L 30 48584.24 L 40 60718.56 L 50 41214.05 L 53.19627122442796 28122.350000000002 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      // negative line which is the same as the first negative line, but it goes to the end
      // of the graph
      <path
        key="zeroLine53.19627122442796100"
        d="M 53.19627122442796 28122.350000000002 L 100 28122.350000000002"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 53.19627122442796 28122.350000000002 L 60 254.76000000000113 L 70 25206.660000000003 L 80 100 L 90 5326.92"
        d="M 53.19627122442796 28122.350000000002 L 60 254.76000000000113 L 70 25206.660000000003 L 80 100 L 90 5326.92"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 53.19627122442796 28122.350000000002 L 60 254.76000000000113 L 70 25206.660000000003 L 80 100 L 90 5326.92 L 100 28122.350000000002 Z"
        d="M 53.19627122442796 28122.350000000002 L 60 254.76000000000113 L 70 25206.660000000003 L 80 100 L 90 5326.92 L 100 28122.350000000002 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];

    createGraphElemsTestFabric(
      'negative values with zero line, some positive values in the middle without zero line,negative values with zero line',
      testNum4,
      testResults4,
    );

    const testNum5 = [1159.29, -1782.58, -1818.953, -2044.561, -1163.768];
    const testResults5 = [
      // the first value is positive, but the next one is negative, so we need to use additional
      // coords between current and next value. zeroLine is not needed since it's positive value
      <path
        key="M 0 31988.509999999995 L 3.9406567931281806 20395.61"
        d="M 0 31988.509999999995 L 3.9406567931281806 20395.61"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      // the same as above, but it also goes to the zeroLine Y coord at minXCoord and then connects
      // with the beginnig, and fills
      <path
        key="M 0 31988.509999999995 L 3.9406567931281806 20395.61 L 0 20395.61 Z"
        d="M 0 31988.509999999995 L 3.9406567931281806 20395.61 L 0 20395.61 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="zeroLine3.940656793128180650"
        d="M 3.9406567931281806 20395.61 L 50 20395.61"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 3.9406567931281806 20395.61 L 10 2569.81 L 20 2206.0799999999995 L 30 50 L 40 8757.929999999998"
        d="M 3.9406567931281806 20395.61 L 10 2569.81 L 20 2206.0799999999995 L 30 50 L 40 8757.929999999998"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 3.9406567931281806 20395.61 L 10 2569.81 L 20 2206.0799999999995 L 30 50 L 40 8757.929999999998 L 50 20395.61 Z"
        d="M 3.9406567931281806 20395.61 L 10 2569.81 L 20 2206.0799999999995 L 30 50 L 40 8757.929999999998 L 50 20395.61 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];
    createGraphElemsTestFabric(
      'first value is positive, and the next are negatives, so there should be addCoords and zeroLine with the negative nums',
      testNum5,
      testResults5,
    );

    const testNum6 = [-1159.29, 1782.58, 1818.953, 2044.561, 1163.768];
    const testResults6 = [
      // the first value is negative and the next one is positive, so stroke line goes to the
      // additional coords between current and next value. Stroke line for filling also goes
      // to the zeroLine Y coord at minXCoord and then connects with the beginning, and fills.
      // Since current value is negative, zeroLine is required, it starts from the minXCoord and
      // ends at additional coords.
      <path
        key="zeroLine03.9406567931281806"
        d="M 0 11542.9 L 3.9406567931281806 11542.9"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 0 50 L 3.9406567931281806 11542.9"
        d="M 0 50 L 3.9406567931281806 11542.9"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 0 50 L 3.9406567931281806 11542.9 L 0 11542.9 Z"
        d="M 0 50 L 3.9406567931281806 11542.9 L 0 11542.9 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="M 3.9406567931281806 11542.9 L 10 29368.699999999997 L 20 29732.43 L 30 31988.509999999995 L 40 23180.58"
        d="M 3.9406567931281806 11542.9 L 10 29368.699999999997 L 20 29732.43 L 30 31988.509999999995 L 40 23180.58"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 3.9406567931281806 11542.9 L 10 29368.699999999997 L 20 29732.43 L 30 31988.509999999995 L 40 23180.58 L 50 11542.9 Z"
        d="M 3.9406567931281806 11542.9 L 10 29368.699999999997 L 20 29732.43 L 30 31988.509999999995 L 40 23180.58 L 50 11542.9 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];

    createGraphElemsTestFabric(
      'first value is negative, and the next are positive, so there should be addCoords and zeroLine from start to positive values',
      testNum6,
      testResults6,
    );

    const testNum7 = [1159.29, 1782.58, 1818.953, 2044.561, -1163.768];
    const testResults7 = [
      // positive line which goes till additional coords between positive and negative one
      <path
        key="M 0 23180.58 L 10 29413.48 L 20 29777.21 L 30 32033.289999999997 L 36.37266626957522 11587.68"
        d="M 0 23180.58 L 10 29413.48 L 20 29777.21 L 30 32033.289999999997 L 36.37266626957522 11587.68"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 0 23180.58 L 10 29413.48 L 20 29777.21 L 30 32033.289999999997 L 36.37266626957522 11587.68 L 0 11587.68 Z"
        d="M 0 23180.58 L 10 29413.48 L 20 29777.21 L 30 32033.289999999997 L 36.37266626957522 11587.68 L 0 11587.68 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      // negative stroke line starts from additional coords between current and previous value, and
      // goes to the coords of this last negative values. Stroke line for filling is the same as one
      // above, but then it goes to the zeroLine Y coord at maxXCoord and connects with the
      // beginning, and fills. Since there are positive and negative values, zeroLine is required.
      // It starts from additional coords and goes to zeroLine Y coord at the maxXCoord.
      <path
        key="zeroLine36.3726662695752250"
        d="M 36.37266626957522 11587.68 L 50 11587.68"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 36.37266626957522 11587.68 L 40 50"
        d="M 36.37266626957522 11587.68 L 40 50"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 36.37266626957522 11587.68 L 40 50 L 50 11587.68 Z"
        d="M 36.37266626957522 11587.68 L 40 50 L 50 11587.68 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];

    createGraphElemsTestFabric(
      'positive values and the negative one as last, so zeroLine is required for the negative value',
      testNum7,
      testResults7,
    );

    const testNum8 = [-1159.29, -1782.58, -1818.953, -2044.561, 1163.768];
    const testResults8 = [
      // since there are negative and positive value, negative line goes to the additional coords
      // between negative and positive values. zeroLine is required from the beginning till the
      // additional coords
      <path
        key="zeroLine036.37266626957522"
        d="M 0 20395.61 L 36.37266626957522 20395.61"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 0 8802.71 L 10 2569.81 L 20 2206.0799999999995 L 30 50 L 36.37266626957522 20395.61"
        d="M 0 8802.71 L 10 2569.81 L 20 2206.0799999999995 L 30 50 L 36.37266626957522 20395.61"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 0 8802.71 L 10 2569.81 L 20 2206.0799999999995 L 30 50 L 36.37266626957522 20395.61 L 0 20395.61 Z"
        d="M 0 8802.71 L 10 2569.81 L 20 2206.0799999999995 L 30 50 L 36.37266626957522 20395.61 L 0 20395.61 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
      // positive stroke line starts from the additional coords between current and the previous one
      // values. Then it goes to the coordinates of this last num. Stroke line for filling is the
      // same as one above, but then it goes to the zeroLine Y coord at the maxXCoord, and the to
      // the beginning, and fills. zeroLine isn't needed since it's a positive value.
      <path
        key="M 36.37266626957522 20395.61 L 40 32033.289999999997"
        d="M 36.37266626957522 20395.61 L 40 32033.289999999997"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 36.37266626957522 20395.61 L 40 32033.289999999997 L 50 20395.61 Z"
        d="M 36.37266626957522 20395.61 L 40 32033.289999999997 L 50 20395.61 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];

    createGraphElemsTestFabric(
      'negative values and the positive one as last, so zeroLine is required for the negative values',
      testNum8,
      testResults8,
    );

    const testNum9 = [1159.29, 1782.58, -1818.953, -2044.561, -1163.768];
    const testResults9 = [
      <path
        key="M 0 31988.509999999995 L 10 38221.409999999996 L 14.949503447559692 20395.61"
        d="M 0 31988.509999999995 L 10 38221.409999999996 L 14.949503447559692 20395.61"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 0 31988.509999999995 L 10 38221.409999999996 L 14.949503447559692 20395.61 L 0 20395.61 Z"
        d="M 0 31988.509999999995 L 10 38221.409999999996 L 14.949503447559692 20395.61 L 0 20395.61 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      // so it's the same as test 7, but the additional coords not just before the coords of the
      // last value, but much more earlier, but the principle of generating stroke coords is the
      // the same
      <path
        key="zeroLine14.94950344755969250"
        d="M 14.949503447559692 20395.61 L 50 20395.61"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 14.949503447559692 20395.61 L 20 2206.0799999999995 L 30 50 L 40 8757.929999999998"
        d="M 14.949503447559692 20395.61 L 20 2206.0799999999995 L 30 50 L 40 8757.929999999998"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 14.949503447559692 20395.61 L 20 2206.0799999999995 L 30 50 L 40 8757.929999999998 L 50 20395.61 Z"
        d="M 14.949503447559692 20395.61 L 20 2206.0799999999995 L 30 50 L 40 8757.929999999998 L 50 20395.61 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];

    createGraphElemsTestFabric(
      'period of positive values and a period of negative values at the end',
      testNum9,
      testResults9,
    );

    const testNum10 = [-1159.29, -1782.58, 1818.953, 2044.561, 1163.768];
    const testResults10 = [
      <path
        key="zeroLine014.949503447559692"
        d="M 0 17775.8 L 14.949503447559692 17775.8"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 0 6182.9 L 10 50 L 14.949503447559692 17775.8"
        d="M 0 6182.9 L 10 50 L 14.949503447559692 17775.8"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 0 6182.9 L 10 50 L 14.949503447559692 17775.8 L 0 17775.8 Z"
        d="M 0 6182.9 L 10 50 L 14.949503447559692 17775.8 L 0 17775.8 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
      // so it's the same as test 8, but the additional coords not just before the coords of the
      // last value, but much more earlier, but the principle of generating stroke coords is the
      // the same
      <path
        key="M 14.949503447559692 17775.8 L 20 35965.33 L 30 38221.409999999996 L 40 29413.48"
        d="M 14.949503447559692 17775.8 L 20 35965.33 L 30 38221.409999999996 L 40 29413.48"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 14.949503447559692 17775.8 L 20 35965.33 L 30 38221.409999999996 L 40 29413.48 L 50 17775.8 Z"
        d="M 14.949503447559692 17775.8 L 20 35965.33 L 30 38221.409999999996 L 40 29413.48 L 50 17775.8 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];

    createGraphElemsTestFabric(
      'period of negative values and a period of positive values at the end',
      testNum10,
      testResults10,
    );

    const testNum11 = [
      4696.433, 3540.186, -1627.405, 3459.214, -3302.897, -4146.79, 3836.140,
      4084.401, 2376.555, -4762.213, 1971.377, 2918.991, -4258.70, 3896.257,
      -3030.843, -1398.479, -4063.822, 2021.292, 3205.217, -2671.101,
    ];
    const testResults11 = [
      <path
        key="M 0 94386.46 L 10 82823.98999999999 L 16.850747282437794 47422.13"
        d="M 0 94386.46 L 10 82823.98999999999 L 16.850747282437794 47422.13"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 0 94386.46 L 10 82823.98999999999 L 16.850747282437794 47422.13 L 0 47422.13 Z"
        d="M 0 94386.46 L 10 82823.98999999999 L 16.850747282437794 47422.13 L 0 47422.13 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="zeroLine16.85074728243779423.199384502751236"
        d="M 16.850747282437794 47422.13 L 23.199384502751236 47422.13"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 16.850747282437794 47422.13 L 20 31148.08 L 23.199384502751236 47422.13"
        d="M 16.850747282437794 47422.13 L 20 31148.08 L 23.199384502751236 47422.13"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 16.850747282437794 47422.13 L 20 31148.08 L 23.199384502751236 47422.13 Z"
        d="M 16.850747282437794 47422.13 L 20 31148.08 L 23.199384502751236 47422.13 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="M 23.199384502751236 47422.13 L 30 82014.26999999999 L 35.11558298880335 47422.13"
        d="M 23.199384502751236 47422.13 L 30 82014.26999999999 L 35.11558298880335 47422.13"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 23.199384502751236 47422.13 L 30 82014.26999999999 L 35.11558298880335 47422.13 Z"
        d="M 23.199384502751236 47422.13 L 30 82014.26999999999 L 35.11558298880335 47422.13 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="zeroLine35.1155829888033555.19457141676051"
        d="M 35.11558298880335 47422.13 L 55.19457141676051 47422.13"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 35.11558298880335 47422.13 L 40 14393.159999999998 L 50 5954.229999999998 L 55.19457141676051 47422.13"
        d="M 35.11558298880335 47422.13 L 40 14393.159999999998 L 50 5954.229999999998 L 55.19457141676051 47422.13"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 35.11558298880335 47422.13 L 40 14393.159999999998 L 50 5954.229999999998 L 55.19457141676051 47422.13 Z"
        d="M 35.11558298880335 47422.13 L 40 14393.159999999998 L 50 5954.229999999998 L 55.19457141676051 47422.13 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="M 55.19457141676051 47422.13 L 60 85783.53 L 70 88266.14 L 80 71187.68 L 83.32908283334044 47422.13"
        d="M 55.19457141676051 47422.13 L 60 85783.53 L 70 88266.14 L 80 71187.68 L 83.32908283334044 47422.13"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 55.19457141676051 47422.13 L 60 85783.53 L 70 88266.14 L 80 71187.68 L 83.32908283334044 47422.13 Z"
        d="M 55.19457141676051 47422.13 L 60 85783.53 L 70 88266.14 L 80 71187.68 L 83.32908283334044 47422.13 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="zeroLine83.3290828333404497.07232397576924"
        d="M 83.32908283334044 47422.13 L 97.07232397576924 47422.13"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 83.32908283334044 47422.13 L 90 200 L 97.07232397576924 47422.13"
        d="M 83.32908283334044 47422.13 L 90 200 L 97.07232397576924 47422.13"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 83.32908283334044 47422.13 L 90 200 L 97.07232397576924 47422.13 Z"
        d="M 83.32908283334044 47422.13 L 90 200 L 97.07232397576924 47422.13 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="M 97.07232397576924 47422.13 L 100 67135.9 L 110 76612.04 L 114.0667548937395 47422.13"
        d="M 97.07232397576924 47422.13 L 100 67135.9 L 110 76612.04 L 114.0667548937395 47422.13"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 97.07232397576924 47422.13 L 100 67135.9 L 110 76612.04 L 114.0667548937395 47422.13 Z"
        d="M 97.07232397576924 47422.13 L 100 67135.9 L 110 76612.04 L 114.0667548937395 47422.13 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="zeroLine114.0667548937395125.22222250834676"
        d="M 114.0667548937395 47422.13 L 125.22222250834676 47422.13"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 114.0667548937395 47422.13 L 120 4835.129999999999 L 125.22222250834676 47422.13"
        d="M 114.0667548937395 47422.13 L 120 4835.129999999999 L 125.22222250834676 47422.13"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 114.0667548937395 47422.13 L 120 4835.129999999999 L 125.22222250834676 47422.13 Z"
        d="M 114.0667548937395 47422.13 L 120 4835.129999999999 L 125.22222250834676 47422.13 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="M 125.22222250834676 47422.13 L 130 86384.7 L 135.62465822638623 47422.13"
        d="M 125.22222250834676 47422.13 L 130 86384.7 L 135.62465822638623 47422.13"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 125.22222250834676 47422.13 L 130 86384.7 L 135.62465822638623 47422.13 Z"
        d="M 125.22222250834676 47422.13 L 130 86384.7 L 135.62465822638623 47422.13 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="zeroLine135.62465822638623166.67830052156788"
        d="M 135.62465822638623 47422.13 L 166.67830052156788 47422.13"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 135.62465822638623 47422.13 L 140 17113.699999999997 L 150 33437.34 L 160 6783.909999999996 L 166.67830052156788 47422.13"
        d="M 135.62465822638623 47422.13 L 140 17113.699999999997 L 150 33437.34 L 160 6783.909999999996 L 166.67830052156788 47422.13"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 135.62465822638623 47422.13 L 140 17113.699999999997 L 150 33437.34 L 160 6783.909999999996 L 166.67830052156788 47422.13 Z"
        d="M 135.62465822638623 47422.13 L 140 17113.699999999997 L 150 33437.34 L 160 6783.909999999996 L 166.67830052156788 47422.13 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="M 166.67830052156788 47422.13 L 170 67635.04999999999 L 180 79474.3 L 185.45446485367196 47422.13"
        d="M 166.67830052156788 47422.13 L 170 67635.04999999999 L 180 79474.3 L 185.45446485367196 47422.13"
        fill="none"
        stroke="#0AAF60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 166.67830052156788 47422.13 L 170 67635.04999999999 L 180 79474.3 L 185.45446485367196 47422.13 Z"
        d="M 166.67830052156788 47422.13 L 170 67635.04999999999 L 180 79474.3 L 185.45446485367196 47422.13 Z"
        fill="url(#greenGradient)"
        opacity="0.3"
        stroke="none"
      />,
      <path
        key="zeroLine185.45446485367196200"
        d="M 185.45446485367196 47422.13 L 200 47422.13"
        fill="none"
        stroke="#CACACE"
        strokeDasharray="5,5"
        strokeWidth="2"
      />,
      <path
        key="M 185.45446485367196 47422.13 L 190 20711.119999999995"
        d="M 185.45446485367196 47422.13 L 190 20711.119999999995"
        fill="none"
        stroke="#FA4545"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />,
      <path
        key="M 185.45446485367196 47422.13 L 190 20711.119999999995 L 200 47422.13 Z"
        d="M 185.45446485367196 47422.13 L 190 20711.119999999995 L 200 47422.13 Z"
        fill="url(#redGradient)"
        opacity="0.3"
        stroke="none"
      />,
    ];

    createGraphElemsTestFabric(
      'complex test of 20 float nums',
      testNum11,
      testResults11,
    );
  });

  describe('function createDateElems', () => {
    const xCoords1 = xCoordsGenerator(31, 2.581);
    const result1 = [
      <p
        key="10.324"
        style={
          {
            left: '10.324px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="20.648"
        style={
          {
            left: '20.648px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="33.553"
        style={
          {
            left: '33.553px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="43.877"
        style={
          {
            left: '43.877px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="56.782"
        style={
          {
            left: '56.782px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="67.106"
        style={
          {
            left: '67.106px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
    ];

    createDateElemsTestFabric(
      'from 0 to 77.43 with step 2.581, 31 nums, fullScreen = false',
      xCoords1,
      false,
      result1,
    );

    const result2 = [
      <p
        key="10.324"
        style={
          {
            left: '10.324px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="18.067"
        style={
          {
            left: '18.067px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="25.81"
        style={
          {
            left: '25.81px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="33.553"
        style={
          {
            left: '33.553px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="43.877"
        style={
          {
            left: '43.877px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="51.62"
        style={
          {
            left: '51.62px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="59.363"
        style={
          {
            left: '59.363px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="67.106"
        style={
          {
            left: '67.106px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
    ];

    createDateElemsTestFabric(
      'from 0 to 77.43 with step 2.581, 31 nums, fullScreen = true',
      xCoords1,
      true,
      result2,
    );

    const xCoords2 = xCoordsGenerator(93, 4.817);
    const result3 = [
      <p
        key="9.634"
        style={
          {
            left: '9.634px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="96.34"
        style={
          {
            left: '96.34px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="178.229"
        style={
          {
            left: '178.229px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="264.935"
        style={
          {
            left: '264.935px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="346.824"
        style={
          {
            left: '346.824px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="433.53000000000003"
        style={
          {
            left: '433.53000000000003px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
    ];

    createDateElemsTestFabric(
      'from 0 to 443.164 with step 4.817, 93 nums, fullScreen = false',
      xCoords2,
      false,
      result3,
    );

    const result4 = [
      <p
        key="9.634"
        style={
          {
            left: '9.634px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="72.255"
        style={
          {
            left: '72.255px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="130.059"
        style={
          {
            left: '130.059px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="192.68"
        style={
          {
            left: '192.68px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="250.484"
        style={
          {
            left: '250.484px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="313.105"
        style={
          {
            left: '313.105px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="370.909"
        style={
          {
            left: '370.909px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="433.53000000000003"
        style={
          {
            left: '433.53000000000003px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
    ];

    createDateElemsTestFabric(
      'from 0 to 443.164 with step 4.817, 93 nums, fullScreen = true',
      xCoords2,
      true,
      result4,
    );

    const xCoords3 = xCoordsGenerator(186, 7.511);
    const result5 = [
      <p
        key="7.511"
        style={
          {
            left: '7.511px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="285.418"
        style={
          {
            left: '285.418px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="555.814"
        style={
          {
            left: '555.814px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="833.721"
        style={
          {
            left: '833.721px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="1104.117"
        style={
          {
            left: '1104.117px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="1382.0240000000001"
        style={
          {
            left: '1382.0240000000001px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
    ];

    createDateElemsTestFabric(
      'from 0 to 1389.535 with step 7.511, 186 nums, fullScreen = false',
      xCoords3,
      false,
      result5,
    );

    const result6 = [
      <p
        key="7.511"
        style={
          {
            left: '7.511px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="202.797"
        style={
          {
            left: '202.797px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="398.083"
        style={
          {
            left: '398.083px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="593.369"
        style={
          {
            left: '593.369px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="796.166"
        style={
          {
            left: '796.166px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="991.452"
        style={
          {
            left: '991.452px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="1186.738"
        style={
          {
            left: '1186.738px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="1382.0240000000001"
        style={
          {
            left: '1382.0240000000001px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
    ];

    createDateElemsTestFabric(
      'from 0 to 1389.535 with step 7.511, 186 nums, fullScreen = true',
      xCoords3,
      true,
      result6,
    );

    const xCoords4 = xCoordsGenerator(372, 3.512);
    const result7 = [
      <p
        key="10.536"
        style={
          {
            left: '10.536px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="266.912"
        style={
          {
            left: '266.912px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="523.288"
        style={
          {
            left: '523.288px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="779.664"
        style={
          {
            left: '779.664px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="1036.04"
        style={
          {
            left: '1036.04px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="1292.416"
        style={
          {
            left: '1292.416px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
    ];

    createDateElemsTestFabric(
      'from 0 to 1302.952 with step 3.512, 372 nums, fullScreen = false',
      xCoords4,
      false,
      result7,
    );

    const result8 = [
      <p
        key="10.536"
        style={
          {
            left: '10.536px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="193.16"
        style={
          {
            left: '193.16px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="375.784"
        style={
          {
            left: '375.784px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="558.408"
        style={
          {
            left: '558.408px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="744.544"
        style={
          {
            left: '744.544px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="927.168"
        style={
          {
            left: '927.168px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="1109.792"
        style={
          {
            left: '1109.792px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
      <p
        key="1292.416"
        style={
          {
            left: '1292.416px',
            position: 'absolute',
            transform: 'translateX(-50%)',
          }
        }
      >
        January 1
      </p>,
    ];

    createDateElemsTestFabric(
      'from 0 to 1302.952 with step 3.512, 372 nums, fullScreen = true',
      xCoords4,
      true,
      result8,
    );
  });
});
