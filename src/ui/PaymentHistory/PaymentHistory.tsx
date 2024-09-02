'use client';

import {
  ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import useOnResize from '@/hooks/useOnResize';
import Badge from '@/ui/Badge/Badge';
import DateRangeButton from './DateRangeButton/DateRangeButton';
import CurrentStatsTip from './CurrentStatsTip/CurrentStatsTip';

interface PaymentStats {
  date: string,
  amount: string,
}

interface AdjustedPaymentStats {
  amount: number,
  day: number,
  month: string,
  monthNum: number,
  year: number,
  weekday: string,
}

interface PaymentStatsWithCoords extends AdjustedPaymentStats {
  x: number,
  y: number,
}

export interface TipConfig extends PaymentStatsWithCoords {
  svgElX: number,
  svgElY: number,
  id: string,
}

interface SvgMetrics {
  width: number,
  height: number,
  x: number,
  y: number,
}

interface StrokeProps {
  width: string,
  colorGreen: string,
  colorRed: string,
  linejoin: 'round' | 'miter' | 'bevel' | 'inherit',
  strokeLinecap: 'butt' | 'square' | 'round'
}

interface PrevAdditionalCoords {
  x: number,
  y: number,
}

type AmountType = 'negative' | 'positive';

function generateRandomStats(): PaymentStats[] {
  function generateRandomNum(min: number, max: number) {
    return (Math.random() * (max - min + 1) + min).toFixed(0);
  }

  function createStatsObj(amount: string, year: number, month: number, day: number): PaymentStats {
    return {
      amount,
      date: `${month + 1}-${day}-${year}`,
    };
  }

  const MIN_AMOUNT = -1500;
  const MAX_AMOUNT = 3500;

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthFirstDay = new Date(currentYear, currentMonth, 1).getDate();

  const monthAgoDate = new Date(currentYear, currentMonth, currentDay - 32);
  const monthAgoDay = monthAgoDate.getDate();
  const monthAgoMonth = monthAgoDate.getMonth();
  const monthAgoYear = monthAgoDate.getFullYear();

  const prevMonthMaxDay = new Date(currentYear, currentMonth, 0).getDate();

  const arrOfPaymentStats: PaymentStats[] = [];

  for (let i = monthAgoDay; i <= prevMonthMaxDay; i += 1) {
    const randomNum = generateRandomNum(MIN_AMOUNT, MAX_AMOUNT);

    const statsObj = createStatsObj(randomNum, monthAgoYear, monthAgoMonth, i);
    arrOfPaymentStats.push(statsObj);
  }

  for (let i = currentMonthFirstDay; i <= currentDay; i += 1) {
    const randomNum = generateRandomNum(MIN_AMOUNT, MAX_AMOUNT);

    const statsObj = createStatsObj(randomNum, currentYear, currentMonth, i);
    arrOfPaymentStats.push(statsObj);
  }

  return arrOfPaymentStats;
}

const paymentStats = generateRandomStats();

const MONTHS: Record<number, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const WEEKDAYS: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

export default function PaymentHistory() {
  const graphAndDatesRef = useRef<null | HTMLDivElement>(null);
  const svgWrapperRef = useRef<null | HTMLDivElement>(null);
  const svgRef = useRef<null | SVGSVGElement>(null);

  const [bodyEl, setBodyEl] = useState<HTMLElement | null>(null);
  const [activeDateRangeBtn, setActiveDateRangeBtn] = useState('1M');
  const [svgMetrics, setSvgMetrics] = useState<SvgMetrics | null>(null);
  const [adjustedPaymentStats, setAdjustedPaymentStats] = useState<AdjustedPaymentStats[]>([]);
  const [statsWithCoords, setStatsWithCoords] = useState<PaymentStatsWithCoords[]>([]);
  const [svgPaths, setSvgPaths] = useState<ReactNode[]>([]);
  const [isTipAndVerticalLineActive, setIsTipAndVerticalLineActive] = useState(false);
  const [verticalLineDStroke, setVerticalLineDStroke] = useState('');
  const [tipConfig, setTipConfig] = useState<TipConfig | null>(null);

  const tipId = 'statsTipEl';

  const findBody = useCallback(() => {
    const body = document.querySelector('body');

    setBodyEl(body);
  }, []);

  useEffect(findBody, [findBody]);

  const calcSvgMetric = useCallback(() => {
    const svgWrapper = svgWrapperRef.current;

    if (!svgWrapper) return;

    const width = svgWrapper.offsetWidth;
    const height = svgWrapper.offsetHeight;

    const { x: windowX, y: windowY } = svgWrapper.getBoundingClientRect();
    const x = windowX + window.scrollX;
    const y = windowY + window.scrollY;

    setSvgMetrics({
      width,
      height,
      x,
      y,
    });
  }, []);

  useLayoutEffect(calcSvgMetric, [calcSvgMetric]);
  useOnResize(calcSvgMetric);

  const adjustPaymentStats = useCallback(() => {
    const statsObj = paymentStats;

    function divideDate(dateStr: string) {
      const splittedDate = dateStr.split('-');

      const day = Number(splittedDate[1]);
      const monthNum = Number(splittedDate[0]);
      const month = MONTHS[monthNum];
      const year = Number(splittedDate[2]);

      const dateObj = new Date(year, monthNum - 1, day);
      const weekday = WEEKDAYS[dateObj.getDay()];

      return {
        day,
        month,
        monthNum,
        year,
        weekday,
      };
    }

    const adjustedPaymentStatsObj: AdjustedPaymentStats[] = [];

    statsObj.forEach((obj) => {
      const dateInfo = divideDate(obj.date);

      adjustedPaymentStatsObj.push({
        ...dateInfo,
        amount: Number(obj.amount),
      });
    });

    setAdjustedPaymentStats(adjustedPaymentStatsObj);
  }, []);

  const paintGraph = useCallback(() => {
    const TOP_INDENT_PX = 60;
    const BOTTOM_INDENT_PERCENT = 0.1;

    const STROKE_PROPS: StrokeProps = {
      width: '2',
      colorGreen: '#0AAF60',
      colorRed: '#FA4545',
      linejoin: 'round',
      strokeLinecap: 'round',
    };

    const FILL_PROPS = {
      colorGreen: 'url(#greenGradient)',
      colorRed: 'url(#redGradient)',
      opacity: '0.3',
    };

    function calcXCoord(statsArrIndex: number, step: number) {
      return Number((statsArrIndex * step).toFixed(0));
    }

    function calcYCoord(amount: number, step: number, minAmount: number, maxYCoord: number) {
      return Math.abs(Number(((amount - minAmount) * step).toFixed(0)) - maxYCoord);
    }

    function checkAmountType(amount: number): AmountType {
      return amount >= 0 ? 'positive' : 'negative';
    }

    function startPath(x: number, y: number) {
      return `M ${x} ${y}`;
    }

    function calcNextAdditionalCoords(
      currentX: number,
      nextX: number,
      currentAmount: number,
      nextAmount: number,
      zeroLineYCoord: number,
    ) {
      const ABSAmountSum = Math.abs(currentAmount) + Math.abs(nextAmount);
      const currentAmountPercent = Math.abs(currentAmount) / ABSAmountSum;

      const additionalCoordX = currentX + (nextX - currentX) * currentAmountPercent;
      const additionalCoordY = zeroLineYCoord;

      return {
        x: additionalCoordX,
        y: additionalCoordY,
      };
    }

    function addGraphPaths(
      pathsArr: ReactNode[],
      color: 'colorGreen' | 'colorRed',
      strokeStr: string,
      fillStr: string,
    ) {
      pathsArr.push(
        <path
          d={strokeStr}
          fill="none"
          strokeWidth={STROKE_PROPS.width}
          stroke={STROKE_PROPS[color]}
          strokeLinejoin={STROKE_PROPS.linejoin}
          strokeLinecap={STROKE_PROPS.strokeLinecap}
        />,
        <path
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
      pathsArr: ReactNode[],
      zeroLineY: number,
      x1: number,
      x2: number,
    ) {
      pathsArr.push(
        <path
          d={`M ${x1} ${zeroLineY} L ${x2} ${zeroLineY}`}
          fill="none"
          strokeWidth="2"
          stroke="#CACACE"
          strokeDasharray="5,5"
        />,
      );
    }

    const svgWrapper = svgWrapperRef.current;
    const svgEl = svgRef.current;

    if (!svgEl || !svgWrapper) return;

    const svgWidth = svgWrapper.offsetWidth;
    const svgHeight = svgWrapper.offsetHeight;

    svgEl.setAttribute('width', String(svgWidth));
    svgEl.setAttribute('height', String(svgHeight));

    const paths: ReactNode[] = [];

    const allAmounts = adjustedPaymentStats.map((p) => p.amount);
    const minAmount = Math.min(...allAmounts);
    const maxAmount = Math.max(...allAmounts);

    const daysAmount = adjustedPaymentStats.length;
    const minYCoord = TOP_INDENT_PX;
    const maxYCoord = Number((svgHeight * (1 - BOTTOM_INDENT_PERCENT)).toFixed(0));

    const XStep = Number((svgWidth / (daysAmount - 1)).toFixed(5));
    const YStep = Number(((maxYCoord - minYCoord) / (maxAmount - minAmount)).toFixed(5));

    const zeroLineYCoord = calcYCoord(0, YStep, minAmount, maxYCoord);

    const paymentStatsWithCoords: PaymentStatsWithCoords[] = adjustedPaymentStats.map((p, i) => ({
      ...p,
      x: calcXCoord(i, XStep),
      y: calcYCoord(p.amount, YStep, minAmount, maxYCoord),
    }));

    setStatsWithCoords(paymentStatsWithCoords);

    let dStrokeStr: string;
    let prevAdditionalCoords: PrevAdditionalCoords;

    paymentStatsWithCoords.forEach((p, i) => {
      const prevStatsAmount = paymentStatsWithCoords[i - 1]?.amount;
      const currenStatsAmount = p.amount;
      const nextStatsAmount = paymentStatsWithCoords[i + 1]?.amount;

      const currentAmountType = checkAmountType(currenStatsAmount);

      const { x: currentX, y: currentY } = p;
      const color = currentAmountType === 'positive' ? 'colorGreen' : 'colorRed';

      if (i === 0) {
        dStrokeStr = startPath(currentX, currentY);

        const nextAmountType = checkAmountType(nextStatsAmount);
        const isNextAdditionalCoordsNeeded = currentAmountType !== nextAmountType;

        if (isNextAdditionalCoordsNeeded) {
          const { x: nextX } = paymentStatsWithCoords[i + 1];

          const { x: additionalCoordX, y: additionalCoordY } = calcNextAdditionalCoords(
            currentX,
            nextX,
            currenStatsAmount,
            nextStatsAmount,
            zeroLineYCoord,
          );

          dStrokeStr += ` L ${additionalCoordX} ${additionalCoordY}`;
          const dFillStr = `${dStrokeStr} L 0 ${zeroLineYCoord} Z`;

          if (isZeroLineNeeded(
            currentAmountType,
            isNextAdditionalCoordsNeeded,
            false,
            !!prevAdditionalCoords,
          )) {
            drawAndAddZeroLinePath(paths, zeroLineYCoord, 0, additionalCoordX);
          }

          addGraphPaths(paths, color, dStrokeStr, dFillStr);

          prevAdditionalCoords = {
            x: additionalCoordX,
            y: additionalCoordY,
          };
        }
      } else if (i === daysAmount - 1) {
        const prevAmountType = checkAmountType(prevStatsAmount);
        const isPrevAdditionalCoordsUsed = prevAmountType !== currentAmountType;
        const isNextAdditionalCoordsNeeded = false;

        if (isPrevAdditionalCoordsUsed) {
          dStrokeStr = startPath(prevAdditionalCoords.x, prevAdditionalCoords.y);
        }

        dStrokeStr += ` L ${currentX} ${currentY}`;
        let dFillStr = `${dStrokeStr} ${svgWidth} ${zeroLineYCoord}`;

        if (isPrevAdditionalCoordsUsed) {
          dFillStr += ' Z';
        } else {
          dFillStr += `L 0 ${zeroLineYCoord} Z`;
        }

        if (isZeroLineNeeded(
          currentAmountType,
          isNextAdditionalCoordsNeeded,
          true,
          !!prevAdditionalCoords,
        )) {
          drawAndAddZeroLinePath(paths, zeroLineYCoord, prevAdditionalCoords.x, svgWidth);
        }

        addGraphPaths(paths, color, dStrokeStr, dFillStr);
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
          const { x: nextX } = paymentStatsWithCoords[i + 1];

          const { x: additionalCoordX, y: additionalCoordY } = calcNextAdditionalCoords(
            currentX,
            nextX,
            currenStatsAmount,
            nextStatsAmount,
            zeroLineYCoord,
          );

          dStrokeStr += ` L ${additionalCoordX} ${additionalCoordY}`;
          let dFillStr = dStrokeStr;

          if (!prevAdditionalCoords) {
            dFillStr += ` L 0 ${zeroLineYCoord} Z`;
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
              paths,
              zeroLineYCoord,
              prevAdditionalCoords?.x || 0,
              additionalCoordX,
            );
          }

          addGraphPaths(paths, color, dStrokeStr, dFillStr);

          prevAdditionalCoords = {
            x: additionalCoordX,
            y: additionalCoordY,
          };
        }
      }
    });

    setSvgPaths(paths);
  }, [adjustedPaymentStats]);

  useEffect(adjustPaymentStats, [adjustPaymentStats]);
  useEffect(paintGraph, [paintGraph]);

  const onGraphHover = useCallback((e: MouseEventInit) => {
    const clientX = e.clientX || -1;
    const clientY = e.clientY || -1;

    const elemBelow = document.elementFromPoint(clientX, clientY);
    const graphAndDatesElement = elemBelow?.closest('#graphAndDatesBlock') || elemBelow?.closest(`#${tipId}`);

    if (graphAndDatesElement && svgMetrics) {
      const currentSvgX = clientX - svgMetrics.x;
      let currentHoveredStats: PaymentStatsWithCoords | undefined;

      for (let i = 0; i < statsWithCoords.length; i += 1) {
        if (currentSvgX <= statsWithCoords[i].x) {
          currentHoveredStats = statsWithCoords[i];
          break;
        }
      }

      if (!currentHoveredStats) return;

      const verticalLineBottomY = svgMetrics.height;

      const newTipConfig = {
        ...currentHoveredStats,
        svgElX: svgMetrics.x,
        svgElY: svgMetrics.y,
        id: tipId,
      };

      setTipConfig(newTipConfig);
      setVerticalLineDStroke(`M ${currentHoveredStats.x || 0} 0 L ${currentHoveredStats.x || 0} ${verticalLineBottomY}`);
      setIsTipAndVerticalLineActive(true);
    } else {
      setIsTipAndVerticalLineActive(false);
    }
  }, [statsWithCoords, svgMetrics]);

  const addGraphHoverListener = useCallback(() => {
    document.addEventListener('mousemove', onGraphHover);

    return () => {
      document.removeEventListener('mousemove', onGraphHover);
    };
  }, [onGraphHover]);

  useEffect(addGraphHoverListener, [addGraphHoverListener]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-[10px] border-grey">
      <div className="w-full flex flex-col justify-start items-start gap-[10px] px-[24px] pt-[24px]">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-tthoves font-medium text-[20px] text-darkBlue">
            Payment History
          </h2>
          <div className="flex justify-start items-center gap-[8px]">
            <DateRangeButton
              dateBtnType="1M"
              activeButton={activeDateRangeBtn}
              setActiveButton={setActiveDateRangeBtn}
            >
              1M
            </DateRangeButton>
            <DateRangeButton
              dateBtnType="3M"
              activeButton={activeDateRangeBtn}
              setActiveButton={setActiveDateRangeBtn}
            >
              3M
            </DateRangeButton>
            <DateRangeButton
              dateBtnType="6M"
              activeButton={activeDateRangeBtn}
              setActiveButton={setActiveDateRangeBtn}
            >
              6M
            </DateRangeButton>
            <DateRangeButton
              dateBtnType="1Y"
              activeButton={activeDateRangeBtn}
              setActiveButton={setActiveDateRangeBtn}
            >
              1Y
            </DateRangeButton>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-[10px]">
          <p className="font-tthoves font-medium text-[42px] text-darkBlue">
            $12,135
            <span className="text-[32px] text-grey-400">
              .69
            </span>
          </p>
          <div className="flex justify-start items-center gap-[8px]">
            <Badge>
              +23%
            </Badge>
            <p className="font-tthoves text-[14px] text-grey-400">
              vs last month
            </p>
          </div>
        </div>
      </div>
      <div
        id="graphAndDatesBlock"
        ref={graphAndDatesRef}
        className="w-full h-full flex flex-col justify-start items-start gap-[16px]"
      >
        {bodyEl && createPortal(
          <CurrentStatsTip
            isActive={isTipAndVerticalLineActive}
            tipConfig={tipConfig}
          />,
          document.body,
        )}
        <div
          ref={svgWrapperRef}
          className="w-full h-full"
        >
          <svg
            ref={svgRef}
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
            {...svgPaths}
            {isTipAndVerticalLineActive && (
              <path
                d={verticalLineDStroke}
                fill="none"
                strokeWidth="2"
                stroke="#CACACE"
                strokeDasharray="5,5"
              />
            )}
          </svg>
        </div>
        <div className="w-full px-[24px] pb-[24px] flex justify-between items-center
          font-tthoves text-[14px] text-grey-400"
        >
          <p>Feb 1</p>
          <p>Feb 7</p>
          <p>Feb 14</p>
          <p>Feb 21</p>
          <p>Feb 28</p>
        </div>
      </div>
    </div>
  );
}
