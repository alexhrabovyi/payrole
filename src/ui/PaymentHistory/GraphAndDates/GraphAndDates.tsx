/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { KeyboardEventHandler, PointerEventHandler, useCallback, useMemo, useRef, useState } from 'react';

import { PaymentAndTransactionMetrics } from '@/ui/PaymentAndTransactionWrapper/PaymentAndTransactionWrapper';
import { FormattedPaymentStats } from '@/ui/PaymentHistory/PaymentHistory';
import {
  calcMinMaxAmount, calcMinMaxCoords, calcXYSteps,
  createGraphElems, createStatsWithCoords, createDateElems,
} from './utils/graphAndDatesUtils';

import CurrentStatsTip from '../CurrentStatsTip/CurrentStatsTip';

export interface StatsWithCoords extends FormattedPaymentStats {
  x: number,
  y: number,
}

export interface TipConfig extends StatsWithCoords {
  svgElWidth: number,
  svgElHeight: number,
}

export interface SvgMetrics {
  width: number,
  height: number,
  pageX: number,
  pageY: number,
}

export interface StrokeProps {
  width: string,
  colorGreen: string,
  colorRed: string,
  linejoin: 'round' | 'miter' | 'bevel' | 'inherit',
  strokeLinecap: 'butt' | 'square' | 'round'
}

export interface FillProps {
  colorGreen: string,
  colorRed: string,
  opacity: string,
}

interface GraphAndDatesProps {
  readonly paymentStats: FormattedPaymentStats[];
  readonly isFullScreenOn: boolean,
  readonly wrapperMetrics: PaymentAndTransactionMetrics | null;
}

const GraphAndDates: React.FC<GraphAndDatesProps> = ({
  paymentStats, isFullScreenOn, wrapperMetrics,
}) => {
  const graphAndDatesBlockRef = useRef<HTMLDivElement | null>(null);
  const svgWrapperRef = useRef<null | HTMLDivElement>(null);

  const [isTipActive, setIsTipActive] = useState(false);
  const [activeStatsIndex, setActiveStatsIndex] = useState(0);

  const STATS_TIP_ID = 'statsTip';

  const TOP_INDENT_PX = 60;
  const BOTTOM_INDENT_PERCENT = 0.1;
  const DATES_OFFSET_X_PX = 50;

  const STROKE_PROPS = useMemo<StrokeProps>(() => ({
    width: '2',
    colorGreen: '#0AAF60',
    colorRed: '#FA4545',
    linejoin: 'round',
    strokeLinecap: 'round',
  }), []);

  const FILL_PROPS = useMemo<FillProps>(() => ({
    colorGreen: 'url(#greenGradient)',
    colorRed: 'url(#redGradient)',
    opacity: '0.3',
  }), []);

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

  const minMaxAmount = useMemo(() => calcMinMaxAmount(paymentStats), [paymentStats]);
  const minMaxCoords = useMemo(
    () => calcMinMaxCoords(TOP_INDENT_PX, BOTTOM_INDENT_PERCENT, svgMetrics),
    [svgMetrics],
  );

  const XYSteps = useMemo(
    () => calcXYSteps(minMaxAmount, minMaxCoords, paymentStats.length),
    [minMaxAmount, minMaxCoords, paymentStats.length],
  );

  const XStep = XYSteps?.XStep;

  const statsWithCoords = useMemo(
    () => createStatsWithCoords(paymentStats, minMaxAmount, minMaxCoords, XYSteps),
    [XYSteps, minMaxAmount, minMaxCoords, paymentStats],
  );

  const graphElems = useMemo(
    () => createGraphElems(
      statsWithCoords,
      minMaxAmount,
      minMaxCoords,
      XYSteps,
      STROKE_PROPS,
      FILL_PROPS,
    ),
    [statsWithCoords, minMaxAmount, minMaxCoords, XYSteps, STROKE_PROPS, FILL_PROPS],
  );

  const dateElems = useMemo(() => createDateElems(
    statsWithCoords,
    isFullScreenOn,
    svgMetrics?.width,
    DATES_OFFSET_X_PX,
  ), [isFullScreenOn, statsWithCoords, svgMetrics?.width]);

  const tipConfig = useMemo(() => {
    if (!statsWithCoords || !svgMetrics) return;

    let currentActiveIndex = activeStatsIndex;

    if (currentActiveIndex >= statsWithCoords.length) {
      currentActiveIndex = 0;
      setActiveStatsIndex(currentActiveIndex);
    }

    const activeStats = statsWithCoords[currentActiveIndex];

    const newTipConfig: TipConfig = {
      ...activeStats,
      svgElHeight: svgMetrics.height,
      svgElWidth: svgMetrics.width,
    };

    return newTipConfig;
  }, [activeStatsIndex, statsWithCoords, svgMetrics]);

  const inferNewActiveStatsIndex = useCallback((x: number) => {
    if (!statsWithCoords || !XStep) return;

    const halfOfXStep = XStep / 2;

    if (x <= 0) {
      return 0;
    }

    if (x >= statsWithCoords[statsWithCoords.length - 1].x) {
      return statsWithCoords.length - 1;
    }

    for (let i = 0; i < statsWithCoords.length; i += 1) {
      const currentStatsMinX = statsWithCoords[i].x - halfOfXStep;
      const currentStatsMaxX = statsWithCoords[i].x + halfOfXStep;

      if (x >= currentStatsMinX && x <= currentStatsMaxX) {
        return i;
      }
    }
  }, [XStep, statsWithCoords]);

  function onGraphAndDatesFocus() {
    setIsTipActive(true);
  }

  function onGraphAndDatesBlur() {
    setIsTipActive(false);
  }

  const onGraphAndDatesKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!statsWithCoords) return;

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
          if (newActiveStatsIndex === statsWithCoords.length) {
            newActiveStatsIndex = statsWithCoords.length - 1;
          }
          break;
        case 'PageDown':
          newActiveStatsIndex = activeStatsIndex - 5;
          if (newActiveStatsIndex < 0) newActiveStatsIndex = 0;
          break;
        case 'PageUp':
          newActiveStatsIndex = activeStatsIndex + 5;
          if (newActiveStatsIndex >= statsWithCoords.length) {
            newActiveStatsIndex = statsWithCoords.length - 1;
          }
          break;
        case 'Home':
          newActiveStatsIndex = statsWithCoords.length - 1;
          break;
        case 'End':
          newActiveStatsIndex = 0;
          break;
      }

      setActiveStatsIndex(newActiveStatsIndex!);
    }
  };

  function onGraphAndDatesMove(e: PointerEvent) {
    e.preventDefault();

    const { clientX } = e;

    if (!clientX || !svgMetrics) return;

    const currentSvgX = clientX - svgMetrics.pageX;

    const newIndex = inferNewActiveStatsIndex(currentSvgX);

    setActiveStatsIndex(newIndex!);
  }

  function onGraphAndDatesOut(e: PointerEvent) {
    const graphAndDatesBlock = graphAndDatesBlockRef.current;
    const nextElem = (e.relatedTarget as HTMLElement | null)?.closest('#graphAndDatesBlock');

    if (!nextElem && graphAndDatesBlock) {
      graphAndDatesBlock.removeEventListener('pointermove', onGraphAndDatesMove);
      graphAndDatesBlock.removeEventListener('pointerout', onGraphAndDatesOut);

      setIsTipActive(false);
    }
  }

  const onGraphAndDatesOver: PointerEventHandler<HTMLDivElement> = (e) => {
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
  };

  function onGraphAndDatesUp() {
    const graphAndDatesBlock = graphAndDatesBlockRef.current;

    if (!graphAndDatesBlock) return;

    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';

    graphAndDatesBlock.removeEventListener('pointermove', onGraphAndDatesMove);
    graphAndDatesBlock.removeEventListener('pointerup', onGraphAndDatesUp);

    setIsTipActive(false);
  }

  const onGraphAndDatesDown: PointerEventHandler<HTMLDivElement> = (e) => {
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
  };

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
