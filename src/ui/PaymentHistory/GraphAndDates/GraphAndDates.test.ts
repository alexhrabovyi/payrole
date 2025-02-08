/* eslint-disable testing-library/no-node-access */
import { waitFor } from '@testing-library/react';
import { inferNewActiveStatsIndex } from './GraphAndDates';
import GraphAndDatesPO from './GraphAndDates.po';
import CurrentStatsTipPO from '../CurrentStatsTip/CurrentStatsTip.po';

/*
FUNCTIONALITY DESCRIPTION / CHECKLIST
svgMetrics???
tipConfig (if currentActiveIndex >= statsWithCoords.length, currentActiveIndex = 0)???

=== inferNewActiveStatsIndex
== return if StatsWithCoords or XStep are undefined [DONE]
== if x < 0, index = 0 [DONE]
== if x > lastElement.x, index = index of lastElement [DONE]
== x in the middle of SVGEl (standart situation) [DONE]

=== onFocus
== isTipActive = true [DONE] (could be checked internally by state or by styles of tip)

=== onBlur
== isTipActive = false [DONE] (could be checked internally by state or by styles of tip)

=== onKeyDown
== ArrowLeft []
== ArrowDown []
== ArrowRight []
== ArrowUp []
== PageDown []
== PageUp []
== Home []
== End []

=== onPointerOver []
=== onPointerMove []
=== onPointerOut []
=== onPointerDown []
=== OnPointerUp []
*/

async function checkStatsTipActiveInactiveStyles(isActive: boolean) {
  const type = isActive ? 'active' : 'inactive';

  const VerticalLineSVG = GraphAndDatesPO.getVerticalLineSvg();
  const CircleSpan = GraphAndDatesPO.getCircleSpan();
  const StatsTipWrapper = GraphAndDatesPO.getStatsTipWrapper();

  await waitFor(() => {
    expect(VerticalLineSVG).toHaveStyle({
      opacity: CurrentStatsTipPO.commonStyles.opacity[type],
      pointerEvents: CurrentStatsTipPO.commonStyles.pointerEvents[type],
    });
  });

  await waitFor(() => {
    expect(CircleSpan).toHaveStyle({
      opacity: CurrentStatsTipPO.commonStyles.opacity[type],
      pointerEvents: CurrentStatsTipPO.commonStyles.pointerEvents[type],
    });
  });

  await waitFor(() => {
    expect(StatsTipWrapper).toHaveStyle({
      opacity: CurrentStatsTipPO.commonStyles.opacity[type],
      pointerEvents: CurrentStatsTipPO.commonStyles.pointerEvents[type],
    });
  });
}

describe('inferNewActiveStatsIndex function', () => {
  const { statsWithCoords } = GraphAndDatesPO;
  const { XStep } = GraphAndDatesPO.XYSteps;

  it('statsWithCoords = undefined, so the function returns undefined', () => {
    expect(inferNewActiveStatsIndex(undefined, 1, 1)).toBeUndefined();
  });

  it('XStep = undefined, so the function returns undefined', () => {
    expect(inferNewActiveStatsIndex([], undefined, 1)).toBeUndefined();
  });

  it('x <= 0, so the function returns 0 ', () => {
    expect(inferNewActiveStatsIndex([], 1, 0)).toBe(0);
    expect(inferNewActiveStatsIndex([], 1, -10)).toBe(0);
  });

  it('x > lastStats.x, so the function returns index of lastStats', () => {
    const lastStatsIndex = statsWithCoords.length - 1;
    const lastStatsX = statsWithCoords[lastStatsIndex].x;

    const testedX = lastStatsX + 1;

    expect(inferNewActiveStatsIndex(statsWithCoords, XStep, testedX)).toBe(lastStatsIndex);
  });

  it.each([
    [3, 0.4, 'add', 3],
    [5, 0.6, 'add', 6],
    [11, 0.3, 'sub', 11],
    [13, 0.7, 'sub', 12],
    [27, 0, 'sub', 27],
  ])('Test different x values between stats', (index, multiplyCoef, operation, expectedIndex) => {
    const additionalNum = XStep * multiplyCoef;
    let testedX = statsWithCoords[index].x;

    if (operation === 'add') {
      testedX += additionalNum;
    } else {
      testedX -= additionalNum;
    }

    expect(inferNewActiveStatsIndex(statsWithCoords, XStep, testedX)).toBe(expectedIndex);
  });
});

describe('GraphAndDates function', () => {
  it('onFocus and onBlur on GraphAndDates', async () => {
    GraphAndDatesPO.render();

    const GraphAndDates = GraphAndDatesPO.getGraphAndDates();

    await checkStatsTipActiveInactiveStyles(false);

    GraphAndDates.focus();

    expect(GraphAndDates).toHaveFocus();

    await checkStatsTipActiveInactiveStyles(true);

    GraphAndDates.blur();

    await checkStatsTipActiveInactiveStyles(false);
  });
});
