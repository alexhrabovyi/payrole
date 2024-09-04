'use client';

import {
  MouseEventHandler,
  ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';

import useOnResize from '@/hooks/useOnResize';
import Badge from '@/ui/Badge/Badge';
import formatAmount from '@/libs/formatAmount';
import DateRangeButton from './DateRangeButton/DateRangeButton';
import CurrentStatsTip from './CurrentStatsTip/CurrentStatsTip';

type AmountType = 'negative' | 'positive';

export type ActiveDateRange = '1M' | '3M' | '6M' | '1Y';

type VersusText = 'vs last month' | 'vs last 3 months' | 'vs last 6 months' | 'vs last year';

interface PaymentStats {
  date: string,
  amount: string,
}

interface FormattedPaymentStats {
  amount: number,
  day: number,
  month: string,
  monthNum: number,
  year: number,
  weekday: string,
}

interface PaymentStatsWithCoords extends FormattedPaymentStats {
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

interface CalcYCoordProps {
  currentAmount: number,
  minAmount: number,
  step: number,
  maxYCoord: number
}

interface CalcNextAdditionalCoordsProps {
  currentX: number,
  nextX: number,
  currentAmount: number,
  nextAmount: number,
  zeroLineYCoord: number,
}

interface AddGraphPathsProps {
  pathsArr: ReactNode[],
  color: 'colorGreen' | 'colorRed',
  strokeStr: string,
  fillStr: string,
}

interface IsZeroLineNeededProps {
  currentAmountType: AmountType,
  isNextAdditionalCoordsNeeded: boolean,
  isLast: boolean,
  isPrevCoordsExist: boolean,
}

interface DrawAndAddZeroLinePathProps {
  pathsArr: ReactNode[],
  zeroLineY: number,
  x1: number,
  x2: number,
}

interface FormattedTotalAmount {
  integer: string,
  float: string,
}

interface PrevAdditionalCoords {
  x: number,
  y: number,
}

function generateRandomStats(): PaymentStats[] {
  function generateRandomNum(min: number, max: number) {
    return (Math.random() * (max - min + 1) + min).toFixed(2);
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

  const arrOfPaymentStats: PaymentStats[] = [];

  for (let i = 365; i >= 0; i -= 1) {
    const randomNum = generateRandomNum(MIN_AMOUNT, MAX_AMOUNT);

    const prevDate = new Date(currentYear, currentMonth, currentDay - i);
    const prevDay = prevDate.getDate();
    const prevMonth = prevDate.getMonth();
    const prevYear = prevDate.getFullYear();

    const statsObj = createStatsObj(randomNum, prevYear, prevMonth, prevDay);
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
  const [activeDateRangeBtn, setActiveDateRangeBtn] = useState<ActiveDateRange>('1M');
  const [svgMetrics, setSvgMetrics] = useState<SvgMetrics | null>(null);
  const [formattedPaymentStats, setFormattedPaymentStats] = useState<FormattedPaymentStats[]>([]);
  const [currentPaymentStats, setCurrentPaymentStats] = useState<FormattedPaymentStats[]>([]);
  const [statsWithCoords, setStatsWithCoords] = useState<PaymentStatsWithCoords[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [formattedTotalAmount, setFormattedTotalAmount] = useState<FormattedTotalAmount>({ integer: '0', float: '' });
  const [versusText, setVersusText] = useState<VersusText>('vs last month');
  const [svgPaths, setSvgPaths] = useState<ReactNode[]>([]);
  const [dateElems, setDateElems] = useState<ReactNode[]>([]);
  const [isTipActive, setIsTipActive] = useState(false);
  const [verticalLineDStroke, setVerticalLineDStroke] = useState('');
  const [tipConfig, setTipConfig] = useState<TipConfig | null>(null);

  const TIP_ID = 'statsTipEl';

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

  const findBody = useCallback(() => {
    const body = document.querySelector('body');

    setBodyEl(body);
  }, []);

  const calcSvgMetric = useCallback(() => {
    const svgWrapper = svgWrapperRef.current;

    if (!svgWrapper) return;

    const width = svgWrapper.offsetWidth;
    const height = svgWrapper.offsetHeight;

    const { x: windowX, y: windowY } = svgWrapper.getBoundingClientRect();
    const pageX = windowX + window.scrollX;
    const pageY = windowY + window.scrollY;

    setSvgMetrics({
      width,
      height,
      pageX,
      pageY,
    });
  }, []);

  const formatAllPaymentStats = useCallback(() => {
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

    const newFormattedPaymentStats: FormattedPaymentStats[] = [];

    statsObj.forEach((s) => {
      const dateInfo = divideDate(s.date);

      newFormattedPaymentStats.push({
        ...dateInfo,
        amount: Number(s.amount),
      });
    });

    setFormattedPaymentStats(newFormattedPaymentStats);
  }, []);

  const extractCurrentPaymentStats = useCallback(() => {
    let startIndex = 0;
    const endIndex = formattedPaymentStats.length;

    if (activeDateRangeBtn === '1M') {
      startIndex = formattedPaymentStats.length - 32;
    } else if (activeDateRangeBtn === '3M') {
      startIndex = formattedPaymentStats.length - 94;
    } else if (activeDateRangeBtn === '6M') {
      startIndex = formattedPaymentStats.length - 187;
    } else if (activeDateRangeBtn === '1Y') {
      startIndex = 0;
    }

    const newCurrentPaymentStats = formattedPaymentStats.slice(startIndex, endIndex);

    setCurrentPaymentStats(newCurrentPaymentStats);
  }, [formattedPaymentStats, activeDateRangeBtn]);

  const calcTotalAmount = useCallback(() => {
    const currenttotalAmount = currentPaymentStats.slice(1).reduce((t, c) => t += c.amount, 0);

    setTotalAmount(currenttotalAmount);
  }, [currentPaymentStats]);

  const formatTotalAmount = useCallback(() => {
    const newFormattedTotalAmount = formatAmount(totalAmount);
    const integer = `$${newFormattedTotalAmount.match(/(\d+,)?(\d+)/)![0]}`;
    const float = newFormattedTotalAmount.match(/\.\d\d/)?.[0] || '';

    setFormattedTotalAmount({
      integer,
      float,
    });
  }, [totalAmount]);

  const setupVersusText = useCallback(() => {
    let newVersusText: VersusText;

    switch (activeDateRangeBtn) {
      case '1M':
        newVersusText = 'vs last month';
        break;
      case '3M':
        newVersusText = 'vs last 3 months';
        break;
      case '6M':
        newVersusText = 'vs last 6 months';
        break;
      case '1Y':
        newVersusText = 'vs last year';
        break;
    }

    setVersusText(newVersusText);
  }, [activeDateRangeBtn]);

  const calcXCoord = useCallback((indexInArray: number, step: number) => indexInArray * step, []);

  const calcYCoord = useCallback(({
    currentAmount, minAmount, step, maxYCoord,
  }: CalcYCoordProps) => Math.abs((currentAmount - minAmount) * step - maxYCoord), []);

  const checkAmountType = useCallback((amount: number) => {
    const type: AmountType = amount >= 0 ? 'positive' : 'negative';
    return type;
  }, []);

  const startPath = useCallback((x: number, y: number) => `M ${x} ${y}`, []);

  const calcNextAdditionalCoords = useCallback(({
    currentX,
    nextX,
    currentAmount,
    nextAmount,
    zeroLineYCoord,
  }: CalcNextAdditionalCoordsProps) => {
    const ABSAmountSum = Math.abs(currentAmount) + Math.abs(nextAmount);
    const currentAmountPercent = Math.abs(currentAmount) / ABSAmountSum;

    const additionalCoordX = currentX + (nextX - currentX) * currentAmountPercent;
    const additionalCoordY = zeroLineYCoord;

    return {
      x: additionalCoordX,
      y: additionalCoordY,
    };
  }, []);

  const addGraphPaths = useCallback(({
    pathsArr, color, strokeStr, fillStr,
  }: AddGraphPathsProps) => {
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
  }, [STROKE_PROPS, FILL_PROPS]);

  const isZeroLineNeeded = useCallback(({
    currentAmountType,
    isNextAdditionalCoordsNeeded,
    isLast,
    isPrevCoordsExist,
  }: IsZeroLineNeededProps) => {
    if (currentAmountType === 'negative' && (isNextAdditionalCoordsNeeded || (isLast && isPrevCoordsExist))) {
      return true;
    }

    return false;
  }, []);

  const drawAndAddZeroLinePath = useCallback(({
    pathsArr,
    zeroLineY,
    x1,
    x2,
  }: DrawAndAddZeroLinePathProps) => {
    pathsArr.push(
      <path
        d={`M ${x1} ${zeroLineY} L ${x2} ${zeroLineY}`}
        fill="none"
        strokeWidth="2"
        stroke="#CACACE"
        strokeDasharray="5,5"
      />,
    );
  }, []);

  const paintGraph = useCallback(() => {
    const TOP_INDENT_PX = 60;
    const BOTTOM_INDENT_PERCENT = 0.1;

    const svgEl = svgRef.current;

    if (!svgEl || !svgMetrics) return;

    const svgWidth = svgMetrics.width;
    const svgHeight = svgMetrics.height;

    svgEl.setAttribute('width', String(svgWidth));
    svgEl.setAttribute('height', String(svgHeight));

    const allAmounts = currentPaymentStats.map((p) => p.amount);
    const minAmount = Math.min(...allAmounts);
    const maxAmount = Math.max(...allAmounts);

    const daysAmount = currentPaymentStats.length;

    const minYCoord = TOP_INDENT_PX;
    const maxYCoord = svgHeight * (1 - BOTTOM_INDENT_PERCENT);
    const minXCoord = 0;
    const maxXCoord = svgWidth;

    const XStep = (maxXCoord - minXCoord) / (daysAmount - 1);
    const YStep = (maxYCoord - minYCoord) / (maxAmount - minAmount);

    const zeroLineYCoord = calcYCoord({
      currentAmount: 0,
      minAmount,
      step: YStep,
      maxYCoord,
    });

    const paymentStatsWithCoords: PaymentStatsWithCoords[] = currentPaymentStats.map((p, i) => ({
      ...p,
      x: calcXCoord(i, XStep),
      y: calcYCoord({
        currentAmount: p.amount,
        minAmount,
        step: YStep,
        maxYCoord,
      }),
    }));

    const paths: ReactNode[] = [];
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

          const { x: additionalCoordX, y: additionalCoordY } = calcNextAdditionalCoords({
            currentX,
            nextX,
            currentAmount: currenStatsAmount,
            nextAmount: nextStatsAmount,
            zeroLineYCoord,
          });

          dStrokeStr += ` L ${additionalCoordX} ${additionalCoordY}`;
          const dFillStr = `${dStrokeStr} L ${minXCoord} ${zeroLineYCoord} Z`;

          if (isZeroLineNeeded({
            currentAmountType,
            isNextAdditionalCoordsNeeded,
            isLast: false,
            isPrevCoordsExist: !!prevAdditionalCoords,
          })) {
            drawAndAddZeroLinePath({
              pathsArr: paths,
              zeroLineY: zeroLineYCoord,
              x1: minXCoord,
              x2: additionalCoordX,
            });
          }

          addGraphPaths({
            pathsArr: paths,
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
        const isPrevAdditionalCoordsUsed = prevAmountType !== currentAmountType;
        const isNextAdditionalCoordsNeeded = false;

        if (isPrevAdditionalCoordsUsed) {
          dStrokeStr = startPath(prevAdditionalCoords.x, prevAdditionalCoords.y);
        }

        dStrokeStr += ` L ${currentX} ${currentY}`;
        let dFillStr = `${dStrokeStr} ${maxXCoord} ${zeroLineYCoord}`;

        if (isPrevAdditionalCoordsUsed) {
          dFillStr += ' Z';
        } else {
          dFillStr += `L ${minXCoord} ${zeroLineYCoord} Z`;
        }

        if (isZeroLineNeeded({
          currentAmountType,
          isNextAdditionalCoordsNeeded,
          isLast: true,
          isPrevCoordsExist: !!prevAdditionalCoords,
        })) {
          drawAndAddZeroLinePath({
            pathsArr: paths,
            zeroLineY: zeroLineYCoord,
            x1: prevAdditionalCoords.x,
            x2: maxXCoord,
          });
        }

        addGraphPaths({
          pathsArr: paths,
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
          const { x: nextX } = paymentStatsWithCoords[i + 1];

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

          if (isZeroLineNeeded({
            currentAmountType,
            isNextAdditionalCoordsNeeded,
            isLast: false,
            isPrevCoordsExist: !!prevAdditionalCoords,
          })) {
            drawAndAddZeroLinePath({
              pathsArr: paths,
              zeroLineY: zeroLineYCoord,
              x1: prevAdditionalCoords?.x || minXCoord,
              x2: additionalCoordX,
            });
          }

          addGraphPaths({
            pathsArr: paths,
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

    setStatsWithCoords(paymentStatsWithCoords);
    setSvgPaths(paths);
  }, [addGraphPaths, calcNextAdditionalCoords, calcXCoord, calcYCoord, svgMetrics,
    checkAmountType, drawAndAddZeroLinePath, currentPaymentStats, isZeroLineNeeded, startPath]);

  const renderDates = useCallback(() => {
    const periodStartObjs: PaymentStatsWithCoords[] = [];

    if (activeDateRangeBtn === '1M') {
      for (let i = 1; i < statsWithCoords.length - 2; i += 4) {
        periodStartObjs.push(statsWithCoords[i]);
      }
    } else if (activeDateRangeBtn === '3M') {
      for (let i = 3; i < statsWithCoords.length - 3; i += 7) {
        periodStartObjs.push(statsWithCoords[i]);
      }
    } else if (activeDateRangeBtn === '6M') {
      for (let i = 5; i < statsWithCoords.length - 3; i += 14) {
        periodStartObjs.push(statsWithCoords[i]);
      }
    } else if (activeDateRangeBtn === '1Y') {
      for (let i = 12; i < statsWithCoords.length - 3; i += 28) {
        periodStartObjs.push(statsWithCoords[i]);
      }
    }

    const pElms = periodStartObjs.map((m) => {
      const text = `${m.month} ${m.day}`;

      return (
        <p
          key={m.x}
          className="absolute top-0 translate-x-[-50%]"
          style={{
            left: `${m.x}px`,
          }}
        >
          {text}
        </p>
      );
    });

    setDateElems(pElms);
  }, [activeDateRangeBtn, statsWithCoords]);

  const onGraphAndDatesHover = useCallback((e: MouseEventInit) => {
    const { clientX, clientY } = e;

    if (!clientX || !clientY || !svgMetrics) return;

    const currentSvgX = clientX - svgMetrics.pageX;
    let currentHoveredStats: PaymentStatsWithCoords | undefined;

    for (let i = 1; i < statsWithCoords.length; i += 1) {
      if (currentSvgX <= statsWithCoords[i].x) {
        currentHoveredStats = statsWithCoords[i];
        break;
      }
    }

    if (!currentHoveredStats) return;

    const verticalLineBottomY = svgMetrics.height;

    const newTipConfig = {
      ...currentHoveredStats,
      svgElX: svgMetrics.pageX,
      svgElY: svgMetrics.pageY,
      id: TIP_ID,
    };

    setTipConfig(newTipConfig);
    setVerticalLineDStroke(`M ${currentHoveredStats.x} 0 L ${currentHoveredStats.x} ${verticalLineBottomY}`);
  }, [statsWithCoords, svgMetrics]);

  const onGraphAndDatesOut = useCallback((e: MouseEvent) => {
    const nextElem = (e.relatedTarget as HTMLElement | null)?.closest('#graphAndDatesBlock')
      || (e.relatedTarget as HTMLElement | null)?.closest(`#${TIP_ID}`);

    if (!nextElem) {
      setIsTipActive(false);
      document.removeEventListener('mousemove', onGraphAndDatesHover);
    }
  }, [onGraphAndDatesHover]);

  const onGraphAndDatesOver = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    const prevElem = (e.relatedTarget as HTMLElement | null)?.closest('#graphAndDatesBlock')
      || (e.relatedTarget as HTMLElement | null)?.closest(`#${TIP_ID}`);

    if (prevElem) return;

    setIsTipActive(true);
    document.addEventListener('mousemove', onGraphAndDatesHover);
  }, [onGraphAndDatesHover]);

  useLayoutEffect(findBody, [findBody]);
  useEffect(calcSvgMetric, [calcSvgMetric]);
  useOnResize(calcSvgMetric);
  useEffect(formatAllPaymentStats, [formatAllPaymentStats]);
  useEffect(extractCurrentPaymentStats, [extractCurrentPaymentStats]);
  useEffect(calcTotalAmount, [calcTotalAmount]);
  useEffect(setupVersusText, [setupVersusText]);
  useEffect(formatTotalAmount, [formatTotalAmount]);
  useEffect(paintGraph, [paintGraph]);
  useEffect(renderDates, [renderDates]);

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
            {formattedTotalAmount.integer}
            <span className="text-[32px] text-grey-400">
              {formattedTotalAmount.float}
            </span>
          </p>
          <div className="flex justify-start items-center gap-[8px]">
            <Badge>
              +23%
            </Badge>
            <p className="font-tthoves text-[14px] text-grey-400">
              {versusText}
            </p>
          </div>
        </div>
      </div>
      <div
        id="graphAndDatesBlock"
        ref={graphAndDatesRef}
        className="w-full h-full flex flex-col justify-start items-start gap-[16px]"
        onMouseOver={onGraphAndDatesOver}
        onMouseOut={onGraphAndDatesOut}
      >
        {bodyEl && createPortal(
          <CurrentStatsTip
            isActive={isTipActive}
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
            {isTipActive && (
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
        <div className="relative w-full h-[45px] px-[24px] pb-[24px] font-tthoves text-[14px] text-grey-400">
          {...dateElems}
        </div>
      </div>
    </div>
  );
}
