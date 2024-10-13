/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { KeyboardEventHandler, PointerEventHandler, useCallback, useMemo, useRef, useState } from 'react';

import { PaymentAndTransactionMetrics } from '@/ui/PaymentAndTransactionHistories/PaymentAndTransactionHistories';
import { FormattedPaymentStats } from '@/ui/PaymentHistory/PaymentHistory';

import CurrentStatsTip from '../CurrentStatsTip/CurrentStatsTip';

type AmountType = 'negative' | 'positive';

interface StatsCoords extends FormattedPaymentStats {
  x: number,
  y: number,
}

export interface TipConfig extends StatsCoords {
  svgElWidth: number,
  svgElHeight: number,
}

interface SvgMetrics {
  width: number,
  height: number,
  pageX: number,
  pageY: number,
}

interface StrokeProps {
  width: string,
  colorGreen: string,
  colorRed: string,
  linejoin: 'round' | 'miter' | 'bevel' | 'inherit',
  strokeLinecap: 'butt' | 'square' | 'round'
}

interface FillProps {
  colorGreen: string,
  colorRed: string,
  opacity: string,
}

interface CalcNextAdditionalCoordsProps {
  currentX: number,
  nextX: number,
  currentAmount: number,
  nextAmount: number,
  zeroLineYCoord: number,
}

interface AddGraphPathsProps {
  pathsArr: React.ReactNode[],
  color: 'colorGreen' | 'colorRed',
  strokeStr: string,
  fillStr: string,
}

interface PrevAdditionalCoords {
  x: number,
  y: number,
}

interface GraphAndDatesProps {
  paymentStats: FormattedPaymentStats[];
  isFullScreenOn: boolean,
  wrapperMetrics: PaymentAndTransactionMetrics | null;
}

const GraphAndDates: React.FC<GraphAndDatesProps> = ({
  paymentStats, isFullScreenOn, wrapperMetrics,
}) => {
  const graphAndDatesBlockRef = useRef<HTMLDivElement | null>(null);
  const svgWrapperRef = useRef<null | HTMLDivElement>(null);

  const [isTipActive, setIsTipActive] = useState(false);
  const [activeStatsIndex, setActiveStatsIndex] = useState(0);

  const STATS_TIP_ID = 'statsTip';

  const svgMetrics = useMemo<SvgMetrics | undefined>(() => {
    const svgWrapper = svgWrapperRef.current;

    if (!svgWrapper || !wrapperMetrics) return;

    let width: number;

    if (isFullScreenOn) {
      width = wrapperMetrics.width;
    } else {
      width = (wrapperMetrics.width - wrapperMetrics.colGap) / 2;
    }

    const height = svgWrapper.offsetHeight;

    const { x: windowX, y: windowY } = svgWrapper.getBoundingClientRect();
    const pageX = windowX + window.scrollX;
    const pageY = windowY + window.scrollY;

    return {
      width,
      height,
      pageX,
      pageY,
    };
  }, [isFullScreenOn, wrapperMetrics]);

  const statsCoordsAndGraphElemsAndStepX = useMemo(() => {
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

    const TOP_INDENT_PX = 60;
    const BOTTOM_INDENT_PERCENT = 0.1;

    function calcXCoord(indexInArray: number, Xstep: number) {
      return indexInArray * Xstep;
    }

    function calcYCoord(
      currentAmount: number,
      minAmount: number,
      Ystep: number,
      maxYCoord: number,
    ) {
      return Math.abs((currentAmount - minAmount) * Ystep - maxYCoord);
    }

    function checkAmountType(amount: number): AmountType {
      return amount >= 0 ? 'positive' : 'negative';
    }

    function startPath(x: number, y: number) {
      return `M ${x} ${y}`;
    }

    function calcNextAdditionalCoords(props: CalcNextAdditionalCoordsProps) {
      const {
        currentX,
        nextX,
        currentAmount,
        nextAmount,
        zeroLineYCoord,
      } = props;

      const ABSAmountSum = Math.abs(currentAmount) + Math.abs(nextAmount);
      const currentAmountPercent = Math.abs(currentAmount) / ABSAmountSum;

      const additionalCoordX = currentX + (nextX - currentX) * currentAmountPercent;
      const additionalCoordY = zeroLineYCoord;

      return {
        x: additionalCoordX,
        y: additionalCoordY,
      };
    }

    function addGraphPaths(props: AddGraphPathsProps) {
      const { pathsArr, color, strokeStr, fillStr } = props;

      pathsArr.push(
        <path
          key={strokeStr}
          d={strokeStr}
          fill="none"
          strokeWidth={STROKE_PROPS.width}
          stroke={STROKE_PROPS[color]}
          strokeLinejoin={STROKE_PROPS.linejoin}
          strokeLinecap={STROKE_PROPS.strokeLinecap}
        />,
        <path
          key={fillStr}
          d={fillStr}
          fill={FILL_PROPS[color]}
          stroke="none"
          opacity={FILL_PROPS.opacity}
        />,
      );
    }

    function isZeroLineNeeded(
      currentAmountType: AmountType,
      isNextAdditionalCoordsNeeded: boolean,
      isLast: boolean,
      isPrevCoordsExist: boolean,
    ) {
      if (currentAmountType === 'negative' && (isNextAdditionalCoordsNeeded || (isLast && isPrevCoordsExist))) {
        return true;
      }

      return false;
    }

    function drawAndAddZeroLinePath(
      pathsArr: React.ReactNode[],
      zeroLineY: number,
      x1: number,
      x2: number,
    ) {
      pathsArr.push(
        <path
          key={`zeroLine${x1}${x2}`}
          d={`M ${x1} ${zeroLineY} L ${x2} ${zeroLineY}`}
          fill="none"
          strokeWidth="2"
          stroke="#CACACE"
          strokeDasharray="5,5"
        />,
      );
    }

    if (!svgMetrics) return;

    const svgWidth = svgMetrics.width;
    const svgHeight = svgMetrics.height;

    const allAmounts = paymentStats.map((p) => p.amount);
    const minAmount = Math.min(...allAmounts);
    const maxAmount = Math.max(...allAmounts);

    const daysAmount = paymentStats.length;

    const minYCoord = TOP_INDENT_PX;
    const maxYCoord = svgHeight * (1 - BOTTOM_INDENT_PERCENT);
    const minXCoord = 0;
    const maxXCoord = svgWidth;

    const XStep = (maxXCoord - minXCoord) / (daysAmount - 1);
    const YStep = (maxYCoord - minYCoord) / (maxAmount - minAmount);

    const zeroLineYCoord = calcYCoord(0, minAmount, YStep, maxYCoord);

    const newStatsCoords: StatsCoords[] = paymentStats
      .map((s, i) => ({
        ...s,
        x: calcXCoord(i, XStep),
        y: calcYCoord(s.amount, minAmount, YStep, maxYCoord),
      }));

    const newGraphElems: React.ReactNode[] = [];
    let dStrokeStr: string;
    let prevAdditionalCoords: PrevAdditionalCoords;

    newStatsCoords.forEach((s, i) => {
      const prevStatsAmount = newStatsCoords[i - 1]?.amount;
      const currenStatsAmount = s.amount;
      const nextStatsAmount = newStatsCoords[i + 1]?.amount;

      const currentAmountType = checkAmountType(currenStatsAmount);

      const { x: currentX, y: currentY } = s;
      const color = currentAmountType === 'positive' ? 'colorGreen' : 'colorRed';

      if (i === 0) {
        dStrokeStr = startPath(currentX, currentY);

        const nextAmountType = checkAmountType(nextStatsAmount);
        const isNextAdditionalCoordsNeeded = currentAmountType !== nextAmountType;

        if (isNextAdditionalCoordsNeeded) {
          const { x: nextX } = newStatsCoords[i + 1];

          const { x: additionalCoordX, y: additionalCoordY } = calcNextAdditionalCoords({
            currentX,
            nextX,
            currentAmount: currenStatsAmount,
            nextAmount: nextStatsAmount,
            zeroLineYCoord,
          });

          dStrokeStr += ` L ${additionalCoordX} ${additionalCoordY}`;
          const dFillStr = `${dStrokeStr} L ${minXCoord} ${zeroLineYCoord} Z`;

          if (isZeroLineNeeded(
            currentAmountType,
            isNextAdditionalCoordsNeeded,
            false,
            !!prevAdditionalCoords,
          )) {
            drawAndAddZeroLinePath(newGraphElems, zeroLineYCoord, minXCoord, additionalCoordX);
          }

          addGraphPaths({
            pathsArr: newGraphElems,
            color,
            strokeStr: dStrokeStr,
            fillStr: dFillStr,
          });

          prevAdditionalCoords = {
            x: additionalCoordX,
            y: additionalCoordY,
          };
        }
      } else if (i === daysAmount - 1) {
        const prevAmountType = checkAmountType(prevStatsAmount);
        const isPrevAdditionalCoordsUsed = !!prevAdditionalCoords;
        const isNextAdditionalCoordsNeeded = false;

        if (prevAmountType !== currentAmountType) {
          dStrokeStr = startPath(prevAdditionalCoords.x, prevAdditionalCoords.y);
        }

        dStrokeStr += ` L ${currentX} ${currentY}`;
        let dFillStr = `${dStrokeStr} L ${maxXCoord} ${zeroLineYCoord}`;

        if (isPrevAdditionalCoordsUsed) {
          dFillStr += ' Z';
        } else {
          dFillStr += ` L ${minXCoord} ${zeroLineYCoord} Z`;
        }

        if (isZeroLineNeeded(
          currentAmountType,
          isNextAdditionalCoordsNeeded,
          true,
          !!prevAdditionalCoords,
        )) {
          drawAndAddZeroLinePath(newGraphElems, zeroLineYCoord, prevAdditionalCoords.x, maxXCoord);
        }

        addGraphPaths({
          pathsArr: newGraphElems,
          color,
          strokeStr: dStrokeStr,
          fillStr: dFillStr,
        });
      } else {
        const prevAmountType = checkAmountType(prevStatsAmount);
        const nextAmountType = checkAmountType(nextStatsAmount);
        const isPrevAdditionalCoordsUsed = prevAmountType !== currentAmountType;
        const isNextAdditionalCoordsNeeded = currentAmountType !== nextAmountType;

        if (isPrevAdditionalCoordsUsed) {
          dStrokeStr = startPath(prevAdditionalCoords.x, prevAdditionalCoords.y);
        }

        dStrokeStr += ` L ${currentX} ${currentY}`;

        if (isNextAdditionalCoordsNeeded) {
          const { x: nextX } = newStatsCoords[i + 1];

          const { x: additionalCoordX, y: additionalCoordY } = calcNextAdditionalCoords({
            currentX,
            nextX,
            currentAmount: currenStatsAmount,
            nextAmount: nextStatsAmount,
            zeroLineYCoord,
          });

          dStrokeStr += ` L ${additionalCoordX} ${additionalCoordY}`;
          let dFillStr = dStrokeStr;

          if (!prevAdditionalCoords) {
            dFillStr += ` L ${minXCoord} ${zeroLineYCoord} Z`;
          } else {
            dFillStr += ' Z';
          }

          if (isZeroLineNeeded(
            currentAmountType,
            isNextAdditionalCoordsNeeded,
            false,
            !!prevAdditionalCoords,
          )) {
            drawAndAddZeroLinePath(
              newGraphElems,
              zeroLineYCoord,
              prevAdditionalCoords?.x || minXCoord,
              additionalCoordX,
            );
          }

          addGraphPaths({
            pathsArr: newGraphElems,
            color,
            strokeStr: dStrokeStr,
            fillStr: dFillStr,
          });

          prevAdditionalCoords = {
            x: additionalCoordX,
            y: additionalCoordY,
          };
        }
      }
    });

    return {
      statsCoords: newStatsCoords,
      graphElems: newGraphElems,
      XStep,
    };
  }, [paymentStats, svgMetrics]);

  const statsCoords = statsCoordsAndGraphElemsAndStepX?.statsCoords;
  const graphElems = statsCoordsAndGraphElemsAndStepX?.graphElems;
  const XStep = statsCoordsAndGraphElemsAndStepX?.XStep;

  const dateElems = useMemo(() => {
    if (!statsCoords || !svgMetrics) return;

    const OFFSET_X_PX = 50;
    const amountOfMiddleDates = isFullScreenOn ? 6 : 4;

    const startX = OFFSET_X_PX;
    const endX = svgMetrics.width - OFFSET_X_PX;

    let firstSuitableStatIndex: number;

    let firstSuitableStat: StatsCoords;
    let lastSuitableStat: StatsCoords;

    for (let i = 1; i < statsCoords.length; i += 1) {
      const currentStat = statsCoords[i];

      if (currentStat.x >= startX) {
        const prevStat = statsCoords[i - 1];
        const prevStatXDiff = startX - prevStat.x;
        const currentStatXDiff = currentStat.x - startX;

        if (prevStatXDiff < currentStatXDiff) {
          firstSuitableStatIndex = i - 1;
          firstSuitableStat = prevStat;
        } else {
          firstSuitableStatIndex = i;
          firstSuitableStat = currentStat;
        }

        break;
      }
    }

    for (let i = statsCoords.length - 1; i >= 0; i -= 1) {
      const currentStat = statsCoords[i];

      if (currentStat.x <= endX) {
        const nextStat = statsCoords[i + 1];
        const nextStatXDiff = nextStat.x - endX;
        const currentStatXDiff = endX - currentStat.x;

        if (nextStatXDiff < currentStatXDiff) {
          lastSuitableStat = nextStat;
        } else {
          lastSuitableStat = currentStat;
        }

        break;
      }
    }

    const middleDatesStartX = firstSuitableStat!.x;
    const middleDatesEndX = lastSuitableStat!.x;

    const xStep = (middleDatesEndX - middleDatesStartX) / (amountOfMiddleDates + 1);

    const middleDatesBreakpoints = [];

    for (let i = 1; i <= amountOfMiddleDates; i += 1) {
      const breakPoint = middleDatesStartX + xStep * i;
      middleDatesBreakpoints.push(breakPoint);
    }

    let currentBreakPointIndex = 0;
    const middleDates: StatsCoords[] = [];

    for (let i = firstSuitableStatIndex! + 1; i < statsCoords.length; i += 1) {
      const currentBreakPoint = middleDatesBreakpoints[currentBreakPointIndex];

      if (!currentBreakPoint) break;

      const currentStatX = statsCoords[i].x;
      const prevStatX = statsCoords[i - 1].x;

      if (currentStatX > currentBreakPoint) {
        const currentStatDiffer = currentStatX - currentBreakPoint;
        const prevStatDiffer = currentBreakPoint - prevStatX;

        if (prevStatDiffer < currentStatDiffer) {
          middleDates.push(statsCoords[i - 1]);
        } else {
          middleDates.push(statsCoords[i]);
        }

        currentBreakPointIndex += 1;
      }
    }

    const suitableStats = [firstSuitableStat!, ...middleDates, lastSuitableStat!];

    const newDateElems = suitableStats.map((s) => {
      const text = `${s.month} ${s.day}`;

      return (
        <p
          key={s.x}
          style={{
            position: 'absolute',
            left: `${s.x}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {text}
        </p>
      );
    });

    return newDateElems;
  }, [isFullScreenOn, statsCoords, svgMetrics]);

  // when current period changes, tipconfig rendering takes too much time
  const tipConfig = useMemo(() => {
    if (!statsCoords || !svgMetrics) return;

    let currentActiveIndex = activeStatsIndex;

    if (currentActiveIndex >= statsCoords.length) {
      currentActiveIndex = 0;
      setActiveStatsIndex(currentActiveIndex);
    }

    const activeStats = statsCoords[currentActiveIndex];

    const newTipConfig: TipConfig = {
      ...activeStats,
      svgElHeight: svgMetrics.height,
      svgElWidth: svgMetrics.width,
    };

    return newTipConfig;
  }, [activeStatsIndex, statsCoords, svgMetrics]);

  const inferNewActiveStatsIndex = useCallback((x: number) => {
    if (!statsCoords || !XStep) return;

    const halfOfXStep = XStep / 2;

    if (x <= 0) {
      return 0;
    }

    if (x >= statsCoords[statsCoords.length - 1].x) {
      return statsCoords.length - 1;
    }

    for (let i = 0; i < statsCoords.length; i += 1) {
      const currentStatsMinX = statsCoords[i].x - halfOfXStep;
      const currentStatsMaxX = statsCoords[i].x + halfOfXStep;

      if (x >= currentStatsMinX && x <= currentStatsMaxX) {
        return i;
      }
    }
  }, [XStep, statsCoords]);

  // useCallback might be unnecessary there
  const onGraphAndDatesFocus = useCallback(() => {
    setIsTipActive(true);
  }, []);

  // useCallback might be unnecessary there
  const onGraphAndDatesBlur = useCallback(() => {
    setIsTipActive(false);
  }, []);

  // useCallback might be unnecessary there
  const onGraphAndDatesKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>((e) => {
    if (!statsCoords) return;

    const suitableKeyboardCodes = [
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];

    const { code } = e;

    if (suitableKeyboardCodes.includes(code)) {
      e.preventDefault();

      let newActiveStatsIndex: number;

      switch (code) {
        case 'ArrowLeft':
        case 'ArrowDown':
          newActiveStatsIndex = activeStatsIndex - 1;
          if (newActiveStatsIndex < 0) newActiveStatsIndex = 0;
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          newActiveStatsIndex = activeStatsIndex + 1;
          if (newActiveStatsIndex === statsCoords.length) {
            newActiveStatsIndex = statsCoords.length - 1;
          }
          break;
        case 'PageDown':
          newActiveStatsIndex = activeStatsIndex - 5;
          if (newActiveStatsIndex < 0) newActiveStatsIndex = 0;
          break;
        case 'PageUp':
          newActiveStatsIndex = activeStatsIndex + 5;
          if (newActiveStatsIndex >= statsCoords.length) {
            newActiveStatsIndex = statsCoords.length - 1;
          }
          break;
        case 'Home':
          newActiveStatsIndex = statsCoords.length - 1;
          break;
        case 'End':
          newActiveStatsIndex = 0;
          break;
      }

      setActiveStatsIndex(newActiveStatsIndex!);
    }
  }, [activeStatsIndex, statsCoords]);

  const onGraphAndDatesMove = useCallback((e: PointerEvent) => {
    e.preventDefault();

    const { clientX } = e;

    if (!clientX || !svgMetrics) return;

    const currentSvgX = clientX - svgMetrics.pageX;

    const newIndex = inferNewActiveStatsIndex(currentSvgX);
    setActiveStatsIndex(newIndex!);
  }, [inferNewActiveStatsIndex, svgMetrics]);

  const onGraphAndDatesOut = useCallback((e: PointerEvent) => {
    const graphAndDatesBlock = graphAndDatesBlockRef.current;
    const nextElem = (e.relatedTarget as HTMLElement | null)?.closest('#graphAndDatesBlock');

    if (!nextElem && graphAndDatesBlock) {
      graphAndDatesBlock.removeEventListener('pointermove', onGraphAndDatesMove);
      graphAndDatesBlock.removeEventListener('pointerout', onGraphAndDatesOut);

      setIsTipActive(false);
    }
  }, [onGraphAndDatesMove]);

  const onGraphAndDatesOver = useCallback<PointerEventHandler<HTMLDivElement>>((e) => {
    const graphAndDatesBlock = graphAndDatesBlockRef.current;
    const { clientX, pointerType, pointerId } = e;

    if (!graphAndDatesBlock || pointerType !== 'mouse' || !clientX || !svgMetrics) return;

    const prevElem = (e.relatedTarget as HTMLElement | null)?.closest('#graphAndDatesBlock');

    if (!prevElem) {
      const currentSvgX = clientX - svgMetrics.pageX;
      const newIndex = inferNewActiveStatsIndex(currentSvgX);

      setActiveStatsIndex(newIndex!);
      setIsTipActive(true);

      graphAndDatesBlock.setPointerCapture(pointerId);

      graphAndDatesBlock.addEventListener('pointermove', onGraphAndDatesMove);
      graphAndDatesBlock.addEventListener('pointerout', onGraphAndDatesOut);
    }
  }, [inferNewActiveStatsIndex, onGraphAndDatesMove, onGraphAndDatesOut, svgMetrics]);

  const onGraphAndDatesUp = useCallback(() => {
    const graphAndDatesBlock = graphAndDatesBlockRef.current;

    if (!graphAndDatesBlock) return;

    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';

    graphAndDatesBlock.removeEventListener('pointermove', onGraphAndDatesMove);
    graphAndDatesBlock.removeEventListener('pointerup', onGraphAndDatesUp);

    setIsTipActive(false);
  }, [onGraphAndDatesMove]);

  const onGraphAndDatesDown = useCallback<PointerEventHandler<HTMLDivElement>>((e) => {
    const graphAndDatesBlock = graphAndDatesBlockRef.current;
    const { clientX, pointerType, pointerId } = e;

    if (graphAndDatesBlock && clientX && svgMetrics && pointerType !== 'mouse') {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';

      const currentSvgX = clientX - svgMetrics.pageX;
      const newIndex = inferNewActiveStatsIndex(currentSvgX);

      setActiveStatsIndex(newIndex!);
      setIsTipActive(true);

      graphAndDatesBlock.setPointerCapture(pointerId);

      graphAndDatesBlock.addEventListener('pointermove', onGraphAndDatesMove);
      graphAndDatesBlock.addEventListener('pointerup', onGraphAndDatesUp);
    }
  }, [inferNewActiveStatsIndex, onGraphAndDatesMove, onGraphAndDatesUp, svgMetrics]);

  return (
    <div
      ref={graphAndDatesBlockRef}
      id="graphAndDatesBlock"
      className="relative w-full h-full flex flex-col justify-start items-start gap-[16px] touch-none"
      onFocus={onGraphAndDatesFocus}
      onBlur={onGraphAndDatesBlur}
      onKeyDown={onGraphAndDatesKeyDown}
      onPointerOver={onGraphAndDatesOver}
      onPointerDown={onGraphAndDatesDown}
      tabIndex={0}
      aria-label="This is a chart for the chosen period.
        You can use keyboard arrows and other keys to change day which payment information is displayed for."
      aria-describedby={STATS_TIP_ID}
    >
      <CurrentStatsTip
        id={STATS_TIP_ID}
        isActive={isTipActive}
        tipConfig={tipConfig}
      />
      <div
        ref={svgWrapperRef}
        className="w-full h-full max-h-[265px]"
      >
        <svg
          className="w-full h-full"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="greenGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#30C559" stopOpacity="0.7" />
              <stop offset="1" stopColor="#30C559" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#FA4545" stopOpacity="0" />
              <stop offset="1" stopColor="#FA4545" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {graphElems}
        </svg>
      </div>
      <div className="relative w-full px-[24px] pb-[24px] flex justify-between items-center font-tthoves text-[14px] text-grey-400">
        {dateElems}
      </div>
    </div>
  );
};

export default GraphAndDates;

// when all values negative there is a bug (screenshot is in tg)
