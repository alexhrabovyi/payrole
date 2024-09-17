'use client';

import {
  MouseEventHandler, useCallback, useLayoutEffect, useMemo, useRef, useState,
} from 'react';

import useOnResize from '@/hooks/useOnResize';
import Badge from '@/ui/Badge/Badge';
import formatAmount from '@/libs/formatAmount';
import DateRangeButton from './DateRangeButton/DateRangeButton';
import CurrentStatsTip from './CurrentStatsTip/CurrentStatsTip';

type AmountType = 'negative' | 'positive';

export type ActiveDateRange = '1M' | '3M' | '6M' | '1Y';

type CompareText = 'vs last month' | 'vs last 3 months' | 'vs last 6 months' | 'vs last year';

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

interface StatsCoords extends FormattedPaymentStats {
  x: number,
  y: number,
}

export interface TipConfig extends StatsCoords {
  svgElWidth: number,
  svgElHeight: number,
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

interface DateMetrics {
  width: number,
  height: number,
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

interface FormattedTotalAmount {
  totalAmount: number,
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
  const measuredDateRef = useRef<null | HTMLParagraphElement>(null);

  const [activeDateRangeBtn, setActiveDateRangeBtn] = useState<ActiveDateRange>('1M');
  const [svgMetrics, setSvgMetrics] = useState<SvgMetrics | null>(null);
  const [dateMetrics, setDateMetrics] = useState<DateMetrics | null>(null);
  const [isTipActive, setIsTipActive] = useState(false);
  const [tipConfig, setTipConfig] = useState<TipConfig | null>(null);

  console.log('render');

  const TIP_ID = 'statsTipEl';

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

  useLayoutEffect(calcSvgMetric, [calcSvgMetric]);
  useOnResize(calcSvgMetric);

  const setupSVGElem = useCallback(() => {
    const svgEl = svgRef.current;

    if (!svgEl || !svgMetrics) return;

    const svgWidth = svgMetrics.width;
    const svgHeight = svgMetrics.height;

    svgEl.setAttribute('width', String(svgWidth));
    svgEl.setAttribute('height', String(svgHeight));
  }, [svgMetrics]);

  useLayoutEffect(setupSVGElem, [setupSVGElem]);

  const setupDateMetrics = useCallback(() => {
    const measuredDate = measuredDateRef.current;

    if (!measuredDate) return;

    const width = measuredDate.offsetWidth;
    const height = measuredDate.offsetHeight;

    setDateMetrics({
      width,
      height,
    });
  }, []);

  useLayoutEffect(setupDateMetrics, [setupDateMetrics]);

  const formattedAllPaymentStats = useMemo(() => {
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

    const statsObj = paymentStats;

    const formattedPaymentStats: FormattedPaymentStats[] = [];

    statsObj.forEach((s) => {
      const dateInfo = divideDate(s.date);

      formattedPaymentStats.push({
        ...dateInfo,
        amount: Number(s.amount),
      });
    });

    return formattedPaymentStats;
  }, []);

  const currentPeriodFormattedPaymentStats = useMemo(() => {
    let startIndex = 0;
    const endIndex = formattedAllPaymentStats.length;

    if (activeDateRangeBtn === '1M') {
      startIndex = endIndex - 31;
    } else if (activeDateRangeBtn === '3M') {
      startIndex = endIndex - 93;
    } else if (activeDateRangeBtn === '6M') {
      startIndex = endIndex - 186;
    } else if (activeDateRangeBtn === '1Y') {
      startIndex = 0;
    }

    const currentPaymentStats = formattedAllPaymentStats.slice(startIndex, endIndex);

    return currentPaymentStats;
  }, [activeDateRangeBtn, formattedAllPaymentStats]);

  const currentPeriodTotalAmount = useMemo<FormattedTotalAmount>(() => {
    const totalAmount = currentPeriodFormattedPaymentStats.reduce((t, c) => t += c.amount, 0);

    const formattedTotalAmount = formatAmount(totalAmount);
    const integer = `$${formattedTotalAmount.match(/(\d+,)?(\d+)/)![0]}` || '';
    const float = formattedTotalAmount.match(/\.\d\d/)?.[0] || '';

    return {
      totalAmount,
      integer,
      float,
    };
  }, [currentPeriodFormattedPaymentStats]);

  const compareText = useMemo(() => {
    let newCompareText: CompareText;

    switch (activeDateRangeBtn) {
      case '1M':
        newCompareText = 'vs last month';
        break;
      case '3M':
        newCompareText = 'vs last 3 months';
        break;
      case '6M':
        newCompareText = 'vs last 6 months';
        break;
      case '1Y':
        newCompareText = 'vs last year';
        break;
    }

    return newCompareText;
  }, [activeDateRangeBtn]);

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

    const svgEl = svgRef.current;

    if (!svgEl || !svgMetrics) return;

    const svgWidth = svgMetrics.width;
    const svgHeight = svgMetrics.height;

    svgEl.setAttribute('width', String(svgWidth));
    svgEl.setAttribute('height', String(svgHeight));

    const allAmounts = currentPeriodFormattedPaymentStats.map((p) => p.amount);
    const minAmount = Math.min(...allAmounts);
    const maxAmount = Math.max(...allAmounts);

    const daysAmount = currentPeriodFormattedPaymentStats.length;

    const minYCoord = TOP_INDENT_PX;
    const maxYCoord = svgHeight * (1 - BOTTOM_INDENT_PERCENT);
    const minXCoord = 0;
    const maxXCoord = svgWidth;

    const XStep = (maxXCoord - minXCoord) / (daysAmount - 1);
    const YStep = (maxYCoord - minYCoord) / (maxAmount - minAmount);

    const zeroLineYCoord = calcYCoord(0, minAmount, YStep, maxYCoord);

    const newStatsCoords: StatsCoords[] = currentPeriodFormattedPaymentStats
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
  }, [currentPeriodFormattedPaymentStats, svgMetrics]);

  const statsCoords = statsCoordsAndGraphElemsAndStepX?.statsCoords;
  const graphElems = statsCoordsAndGraphElemsAndStepX?.graphElems;
  const XStep = statsCoordsAndGraphElemsAndStepX?.XStep;

  const dateElems = useMemo(() => {
    if (!statsCoords || !svgMetrics || !dateMetrics) return;

    const PADDING_X_PX = 24;

    const dateHalfWidth = dateMetrics.width / 2;
    const startX = dateHalfWidth + PADDING_X_PX;
    const endX = svgMetrics.width - PADDING_X_PX - dateHalfWidth;
    // const xStep = (endX - startX) / 5;
    // const xStep = ((svgMetrics.width - PADDING_X_PX - dateMetrics.width) - (PADDING_X_PX + dateMetrics.width)) / 3;

    let firstSuitableStatIndex: number;
    let lastSuitableStatIndex: number;

    for (let i = 1; i < statsCoords.length; i += 1) {
      const currentStat = statsCoords[i];

      if (currentStat.x >= startX) {
        const prevStat = statsCoords[i - 1];
        const prevStatXDiff = startX - prevStat.x;
        const currentStatXDiff = currentStat.x - startX;

        if (prevStatXDiff < currentStatXDiff) {
          firstSuitableStatIndex = i - 1;
        } else {
          firstSuitableStatIndex = i;
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
          lastSuitableStatIndex = i + 1;
        } else {
          lastSuitableStatIndex = i;
        }

        break;
      }
    }

    const suitableStats = [
      statsCoords[firstSuitableStatIndex!], statsCoords[lastSuitableStatIndex!]];

    // statsCoords.forEach((s, i) => {
    //   if (currentX <= s.x) {
    //     suitableStats.push(s);
    //     currentX += xStep;
    //   }

    // if (s.x <= currentX && statsCoords[i + 1]?.x > currentX) {
    //   suitableStats.push(s);
    //   currentX += xStep;
    // }

    // console.log(suitableStats, xStep, startX, endX, svgMetrics.width, dateMetrics.width);

    const newDateElems = suitableStats.map((s) => {
      const text = `${s.month} ${s.day}`;

      return (
        <p
          key={s.x}
          className="absolute top-0 translate-x-[-50%]"
          style={{
            left: `${s.x}px`,
          }}
        >
          {text}
        </p>
      );
    });

    return newDateElems;
  }, [dateMetrics, statsCoords, svgMetrics]);

  // const dateElems = useMemo(() => {
  //   if (!statsCoords) return;

  //   const periodStartObjs: StatsCoords[] = [];

  //   if (activeDateRangeBtn === '1M') {
  //     for (let i = 1; i < statsCoords.length - 2; i += 4) {
  //       periodStartObjs.push(statsCoords[i]);
  //     }
  //   } else if (activeDateRangeBtn === '3M') {
  //     for (let i = 3; i < statsCoords.length - 3; i += 7) {
  //       periodStartObjs.push(statsCoords[i]);
  //     }
  //   } else if (activeDateRangeBtn === '6M') {
  //     for (let i = 5; i < statsCoords.length - 3; i += 14) {
  //       periodStartObjs.push(statsCoords[i]);
  //     }
  //   } else if (activeDateRangeBtn === '1Y') {
  //     for (let i = 12; i < statsCoords.length - 3; i += 28) {
  //       periodStartObjs.push(statsCoords[i]);
  //     }
  //   }

  //   const newDateElems = periodStartObjs.map((m) => {
  //     const text = `${m.month} ${m.day}`;

  //     return (
  //       <p
  //         key={m.x}
  //         className="absolute top-0 translate-x-[-50%]"
  //         style={{
  //           left: `${m.x}px`,
  //         }}
  //       >
  //         {text}
  //       </p>
  //     );
  //   });

  //   return newDateElems;
  // }, [activeDateRangeBtn, statsCoords]);

  const onGraphAndDatesHover = useCallback((e: MouseEventInit) => {
    const { clientX } = e;

    if (!clientX || !svgMetrics || !statsCoords || !XStep) return;

    const halfOfXStep = XStep / 2;
    const currentSvgX = clientX - svgMetrics.pageX;
    let currentHoveredStats: StatsCoords | undefined;

    for (let i = 0; i < statsCoords.length; i += 1) {
      const currentStatsMinX = statsCoords[i].x - halfOfXStep;
      const currentStatsMaxX = statsCoords[i].x + halfOfXStep;

      if (currentSvgX >= currentStatsMinX && currentSvgX <= currentStatsMaxX) {
        currentHoveredStats = statsCoords[i];
        break;
      }
    }

    if (!currentHoveredStats) return;

    const newTipConfig = {
      ...currentHoveredStats,
      svgElHeight: svgMetrics.height,
      svgElWidth: svgMetrics.width,
      svgElX: svgMetrics.pageX,
      svgElY: svgMetrics.pageY,
      id: TIP_ID,
    };

    setTipConfig(newTipConfig);
  }, [XStep, statsCoords, svgMetrics]);

  const onGraphAndDatesOut = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
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
            {currentPeriodTotalAmount.integer}
            <span className="text-[32px] text-grey-400">
              {currentPeriodTotalAmount.float}
            </span>
          </p>
          <div className="flex justify-start items-center gap-[8px]">
            <Badge>
              +23%
            </Badge>
            <p className="font-tthoves text-[14px] text-grey-400">
              {compareText}
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
        <CurrentStatsTip
          isActive={isTipActive}
          tipConfig={tipConfig}
        />
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
            {graphElems}
          </svg>
        </div>
        <div className="relative w-full pb-[24px] font-tthoves text-[14px] text-grey-400">
          <p
            ref={measuredDateRef}
            className="opacity-0 inline"
            aria-hidden
          >
            Aug 30
          </p>
          {dateElems}
        </div>
        {/* <div className="relative w-full h-[45px] px-[24px] pb-[24px] font-tthoves text-[14px] text-grey-400">
          {dateElems}
        </div> */}
      </div>
    </div>
  );
}

// переделать ивенты с учетом того, что тип уже только в пределах дива с свг
// пофиксить даты
// пофиксить баг с ререндерами на ховер (возможно, само пофикситься, когда тип уйдет от документа)\
// вынести див с свг и датами в отдельный компонент
