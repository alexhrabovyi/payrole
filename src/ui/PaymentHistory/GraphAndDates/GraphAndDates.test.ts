/* eslint-disable testing-library/no-node-access */
import { TipConfig } from './GraphAndDates';
import { calcStyleParams, TipMetrics } from '../CurrentStatsTip/CurrentStatsTip';
import GraphAndDatesPO from './GraphAndDates.po';
import CurrentStatsTipPO from '../CurrentStatsTip/CurrentStatsTip.po';

/*
FUNCTIONALITY DESCRIPTION / CHECKLIST
*/

describe('GraphAndDates function', () => {
  describe('amount of date elems', () => {
    it('fullScreenOn = false', () => {
      GraphAndDatesPO.render();

      expect(GraphAndDatesPO.getDateElemsBlock().children.length).toBe(6);
    });

    it('fullScreenOn = true', () => {
      GraphAndDatesPO.render(true);

      expect(GraphAndDatesPO.getDateElemsBlock().children.length).toBe(8);
    });
  });

  // describe('with CurrentStatsTip function', () => {
  //   it('ArrowUp keyboard event', () => {
  //     const { formattedPaymentStats, width, height } = GraphAndDatesPO;

  //     let activeIndex = 0;

  //     const currentTipXCoord = GraphAndDatesPO.calcXCoord(activeIndex);
  //     const currentTipYCoord = GraphAndDatesPO
  //       .calcYCoord(formattedPaymentStats[activeIndex].amount);

  //     const tipConfig: TipConfig = {
  //       ...formattedPaymentStats[activeIndex],
  //       x: currentTipXCoord,
  //       y: currentTipYCoord,
  //       svgElWidth: width,
  //       svgElHeight: height,
  //     };

  //     const TRIANGLE_LONG_SIDE = 12;
  //     const TRIANGLE_SHORT_SIDE = 9;
  //     const GAP_BETWEEN_TRIANGLE_AND_CIRCLE = 6;
  //     const TIP_X_PADDING = 12;
  //     const TRIANGLE_X_PADDING = 12;
  //     const VERTICAL_LINE_WIDTH_PX = 2;

  //     const TIP_WIDTH = 200;
  //     const TIP_HEIGHT = 50;
  //     const CIRCLE_WIDTH = 16;
  //     const CIRCLE_HEIGHT = 16;

  //     const tipMetrics: TipMetrics = {
  //       tipWidth: TIP_WIDTH,
  //       tipHeight: TIP_HEIGHT,
  //       circleWidth: CIRCLE_WIDTH,
  //       circleHeight: CIRCLE_HEIGHT,
  //     };

  //     const tipExpectedStyles = calcStyleParams(
  //       tipMetrics,
  //       tipConfig,
  //       TIP_X_PADDING,
  //       VERTICAL_LINE_WIDTH_PX,
  //       TRIANGLE_SHORT_SIDE,
  //       TRIANGLE_LONG_SIDE,
  //       TRIANGLE_X_PADDING,
  //       GAP_BETWEEN_TRIANGLE_AND_CIRCLE,
  //     );

  //     GraphAndDatesPO.render();

  //     Object.defineProperty(GraphAndDatesPO.getSvgWrapper(), 'offsetHeight', {
  //       value: height,
  //       writable: true,
  //     });

  //     Object.defineProperty(CurrentStatsTipPO.getCurrentStatsTip(), 'offsetWidth', {
  //       value: TIP_WIDTH,
  //       writable: true,
  //     });

  //     Object.defineProperty(CurrentStatsTipPO.getCurrentStatsTip(), 'offsetHeight', {
  //       value: TIP_HEIGHT,
  //       writable: true,
  //     });

  //     Object.defineProperty(CurrentStatsTipPO.getCircleSpan(), 'offsetWidth', {
  //       value: CIRCLE_WIDTH,
  //       writable: true,
  //     });

  //     Object.defineProperty(CurrentStatsTipPO.getCircleSpan(), 'offsetHeight', {
  //       value: CIRCLE_HEIGHT,
  //       writable: true,
  //     });

  //     GraphAndDatesPO.rerender();

  //     console.log(GraphAndDatesPO.getSvgWrapper().offsetHeight);

  //     expect(CurrentStatsTipPO.getVerticalLineSvg()).toHaveStyle({
  //       height: `${tipExpectedStyles.verticalLineHeight}px`,
  //       top: `${tipExpectedStyles.verticalLineY}px`,
  //       left: `${tipExpectedStyles.verticalLineX}px`,
  //       opacity: '0',
  //       pointerEvents: 'none',
  //     });
  //   });
  // });
});
