import { calcStyleParams, TipMetrics } from './CurrentStatsTip';
import { TipConfig } from '../GraphAndDates/GraphAndDates';

function createTipConfig(x: number, y: number): TipConfig {
  return {
    x,
    y,
    svgElWidth: 700,
    svgElHeight: 500,
    amount: 100,
    day: 1,
    month: 'January',
    monthNum: 0,
    year: 2024,
    weekday: 'Monday',
  };
}

function calcStyleParamsBinded(tipMetrics: TipMetrics, tipConfig: TipConfig) {
  const TRIANGLE_LONG_SIDE = 12;
  const TRIANGLE_SHORT_SIDE = 9;
  const GAP_BETWEEN_TRIANGLE_AND_CIRCLE = 6;
  const TIP_X_PADDING = 12;
  const TRIANGLE_X_PADDING = 12;
  const VERTICAL_LINE_WIDTH_PX = 2;

  return calcStyleParams(
    tipMetrics,
    tipConfig,
    TIP_X_PADDING,
    VERTICAL_LINE_WIDTH_PX,
    TRIANGLE_SHORT_SIDE,
    TRIANGLE_LONG_SIDE,
    TRIANGLE_X_PADDING,
    GAP_BETWEEN_TRIANGLE_AND_CIRCLE,
  );
}

describe('CurrentStats utility functions', () => {
  describe('calcStyleParams function', () => {
    const tipMetrics: TipMetrics = {
      tipWidth: 200,
      tipHeight: 50,
      circleWidth: 12,
      circleHeight: 12,
    };

    it('tip is not overflow, triangle is not overflow', () => {
      expect(calcStyleParamsBinded(tipMetrics, createTipConfig(300, 200))).toEqual({
        tipXCoord: 200,
        tipYCoord: 129,
        triangleXCoord: 94,
        triangleYCoord: 50,
        triangleClassName: 'absolute transition-[left_top] duration-150 ease-in-out translate-y-[-20%]',
        circleXCoord: 294,
        circleYCoord: 194,
        verticalLineX: 299,
        verticalLineY: 0,
        verticalLineHeight: 500,
        verticalLinePath: 'M 0 0 L 0 500',
      });
    });

    it('tip is left overflow, triangle is not overflow', () => {
      expect(calcStyleParamsBinded(tipMetrics, createTipConfig(80, 200))).toEqual({
        tipXCoord: 12,
        tipYCoord: 129,
        triangleXCoord: 62,
        triangleYCoord: 50,
        triangleClassName: 'absolute transition-[left_top] duration-150 ease-in-out translate-y-[-20%]',
        circleXCoord: 74,
        circleYCoord: 194,
        verticalLineX: 79,
        verticalLineY: 0,
        verticalLineHeight: 500,
        verticalLinePath: 'M 0 0 L 0 500',
      });
    });

    it('tip is left overflow, triangle is left overflow', () => {
      expect(calcStyleParamsBinded(tipMetrics, createTipConfig(15, 200))).toEqual({
        tipXCoord: 36,
        tipYCoord: 175,
        triangleXCoord: -9,
        triangleYCoord: 19,
        triangleClassName: 'absolute transition-[left_top] duration-150 ease-in-out rotate-[90deg]',
        circleXCoord: 9,
        circleYCoord: 194,
        verticalLineX: 14,
        verticalLineY: 0,
        verticalLineHeight: 500,
        verticalLinePath: 'M 0 0 L 0 500',
      });
    });

    it('tip is right overflow, triangle is not overflow', () => {
      expect(calcStyleParamsBinded(tipMetrics, createTipConfig(620, 200))).toEqual({
        tipXCoord: 488,
        tipYCoord: 129,
        triangleXCoord: 126,
        triangleYCoord: 50,
        triangleClassName: 'absolute transition-[left_top] duration-150 ease-in-out translate-y-[-20%]',
        circleXCoord: 614,
        circleYCoord: 194,
        verticalLineX: 619,
        verticalLineY: 0,
        verticalLineHeight: 500,
        verticalLinePath: 'M 0 0 L 0 500',
      });
    });

    it('tip is right overflow, triangle is right overflow', () => {
      expect(calcStyleParamsBinded(tipMetrics, createTipConfig(690, 200))).toEqual({
        tipXCoord: 469,
        tipYCoord: 175,
        triangleXCoord: 200,
        triangleYCoord: 19,
        triangleClassName: 'absolute transition-[left_top] duration-150 ease-in-out rotate-[-90deg] translate-x-[-20%]',
        circleXCoord: 684,
        circleYCoord: 194,
        verticalLineX: 689,
        verticalLineY: 0,
        verticalLineHeight: 500,
        verticalLinePath: 'M 0 0 L 0 500',
      });
    });
  });
});
