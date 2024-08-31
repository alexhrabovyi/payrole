'use client';

import {
  ReactNode, useCallback, useEffect, useRef, useState,
} from 'react';
import clsx from 'clsx';

import Badge from '@/ui/Badge/Badge';
import DateRangeButton from './DateRangeButton/DateRangeButton';

interface PaymentStats {
  date: string,
  amount: string,
}

interface AdjustedPaymentStats {
  amount: number,
  day: number,
  month: string,
  year: number,
}

interface PaymentStatsWithCoords extends AdjustedPaymentStats {
  x: number,
  y: number,
}

// 31 day of the same month. Only positive numbers;
const paymentStats: PaymentStats[] = [
  {
    date: '12-01-2023',
    amount: '3232',
  },
  {
    date: '12-02-2023',
    amount: '500',
  },
  {
    date: '12-03-2023',
    amount: '4518',
  },
  {
    date: '12-04-2023',
    amount: '311',
  },
  {
    date: '12-05-2023',
    amount: '7846',
  },
  {
    date: '12-06-2023',
    amount: '1024',
  },
  {
    date: '12-07-2023',
    amount: '2854',
  },
  {
    date: '12-08-2023',
    amount: '4853',
  },
  {
    date: '12-09-2023',
    amount: '783',
  },
  {
    date: '12-10-2023',
    amount: '561',
  },
  {
    date: '12-11-2023',
    amount: '1145',
  },
  {
    date: '12-12-2023',
    amount: '434',
  },
  {
    date: '12-13-2023',
    amount: '1643',
  },
  {
    date: '12-14-2023',
    amount: '754',
  },
  {
    date: '12-15-2023',
    amount: '1132',
  },
  {
    date: '12-16-2023',
    amount: '2165',
  },
  {
    date: '12-17-2023',
    amount: '3781',
  },
  {
    date: '12-18-2023',
    amount: '1784',
  },
  {
    date: '12-19-2023',
    amount: '831',
  },
  {
    date: '12-20-2023',
    amount: '411',
  },
  {
    date: '12-21-2023',
    amount: '932',
  },
  {
    date: '12-22-2023',
    amount: '1315',
  },
  {
    date: '12-23-2023',
    amount: '1810',
  },
  {
    date: '12-24-2023',
    amount: '1284',
  },
  {
    date: '12-25-2023',
    amount: '2914',
  },
  {
    date: '12-26-2023',
    amount: '611',
  },
  {
    date: '12-27-2023',
    amount: '341',
  },
  {
    date: '12-28-2023',
    amount: '2931',
  },
  {
    date: '12-29-2023',
    amount: '1983',
  },
  {
    date: '12-30-2023',
    amount: '3010',
  },
  {
    date: '12-31-2023',
    amount: '2071',
  },
];

// 5 days of the same month. Only positive numbers;
const paymentStats1: PaymentStats[] = [
  {
    date: '12-03-2023',
    amount: '2071',
  },
  {
    date: '12-11-2023',
    amount: '1325',
  },
  {
    date: '12-15-2023',
    amount: '3561',
  },
  {
    date: '12-16-2023',
    amount: '2323',
  },
  {
    date: '12-28-2023',
    amount: '1531',
  },
];

// 5 days of the same month. One negative number;
const paymentStats2: PaymentStats[] = [
  {
    date: '12-03-2023',
    amount: '2071',
  },
  {
    date: '12-14-2023',
    amount: '2561',
  },
  {
    date: '12-15-2023',
    amount: '-1432',
  },
  {
    date: '12-16-2023',
    amount: '2323',
  },
  {
    date: '12-28-2023',
    amount: '1531',
  },
];

// it can be remade as enum
const MONTHS: Record<number, string> = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export default function PaymentHistory() {
  const svgWrapperRef = useRef<null | HTMLDivElement>(null);
  const svgRef = useRef<null | SVGSVGElement>(null);

  const [activeDateRangeBtn, setActiveDateRangeBtn] = useState('1M');
  const [svgPaths, setSvgPaths] = useState<ReactNode[]>([]);

  const adjustPaymentStats = useCallback((statsObj: PaymentStats[]) => {
    function divideDate(dateStr: string) {
      const splittedDate = dateStr.split('-');

      const day = Number(splittedDate[1]);
      const month = MONTHS[Number(splittedDate[0])];
      const year = Number(splittedDate[2]);

      return {
        day,
        month,
        year,
      };
    }

    function fillWithPaymentStats(
      resultingStatsObj: AdjustedPaymentStats[],
      startDate: number,
      endDate: number,
      month: string,
      year: number,
    ) {
      for (let i = startDate; i < endDate; i += 1) {
        resultingStatsObj.push({
          amount: 0,
          day: i,
          month,
          year,
        });
      }
    }

    const adjustedPaymentStatsObj: AdjustedPaymentStats[] = [];

    const firstAdjustedStatsDate = divideDate(statsObj[0].date);

    if (firstAdjustedStatsDate.day !== 1) {
      fillWithPaymentStats(
        adjustedPaymentStatsObj,
        1,
        firstAdjustedStatsDate.day,
        firstAdjustedStatsDate.month,
        firstAdjustedStatsDate.year,
      );
    }

    statsObj.forEach((obj, i) => {
      const currentObjAdjustedDate = divideDate(obj.date);

      adjustedPaymentStatsObj.push({
        amount: Number(obj.amount),
        ...currentObjAdjustedDate,
      });

      const nextObj = statsObj[i + 1];

      if (!nextObj) {
        if (currentObjAdjustedDate.day !== 31) {
          fillWithPaymentStats(
            adjustedPaymentStatsObj,
            currentObjAdjustedDate.day + 1,
            32,
            firstAdjustedStatsDate.month,
            firstAdjustedStatsDate.year,
          );
        }

        return;
      }

      const nextObjAdjustedDate = divideDate(nextObj.date);
      const currentObjDay = currentObjAdjustedDate.day;
      const nextObjDay = nextObjAdjustedDate.day;

      const daysDiff = nextObjDay - currentObjDay;

      if (daysDiff !== 1) {
        fillWithPaymentStats(
          adjustedPaymentStatsObj,
          currentObjDay + 1,
          nextObjDay,
          firstAdjustedStatsDate.month,
          firstAdjustedStatsDate.year,
        );
      }
    });

    return adjustedPaymentStatsObj;
  }, []);

  const paintGraph = useCallback(() => {
    const svgWrapper = svgWrapperRef.current;
    const svgEl = svgRef.current;

    if (!svgEl) return;
    if (!svgWrapper) return;

    const svgWidth = svgWrapper.offsetWidth;
    const svgHeight = svgWrapper.offsetHeight;

    svgEl.setAttribute('width', String(svgWidth));
    svgEl.setAttribute('height', String(svgHeight));

    const adjustedPaymentStatsObj = adjustPaymentStats(paymentStats1);
    const paths: ReactNode[] = [];

    // needs to be deleted
    let zeroLinePath: ReactNode;

    const allAmounts = adjustedPaymentStatsObj.map((p) => p.amount);
    const minAmount = Math.min(...allAmounts);
    const maxAmount = Math.max(...allAmounts);

    const daysAmount = adjustedPaymentStatsObj.length;
    const bottomIndentPercent = 0.2;
    const maxYCoord = Number((svgHeight * (1 - bottomIndentPercent)).toFixed(0));

    const XStep = Number((svgWidth / (daysAmount - 1)).toFixed(5));
    const YStep = Number((maxYCoord / (maxAmount - minAmount)).toFixed(5));

    function calcXCoord(day: number): number {
      return Number((day * XStep - XStep).toFixed(0));
    }

    function calcYCoord(amount: number): number {
      return Math.abs(Number(((amount - minAmount) * YStep).toFixed(0)) - maxYCoord);
    }

    // needs to be deleted
    if (minAmount <= 0) {
      const zeroLineYCoord = calcYCoord(0);

      zeroLinePath = (
        <path
          d={`M 0 ${zeroLineYCoord} L ${svgWidth} ${zeroLineYCoord}`}
          fill="none"
          strokeWidth="2"
          stroke="#9096A2"
          strokeDasharray="5,5"
        />
      );
    }

    const paymentStatsWithCoords: PaymentStatsWithCoords[] = adjustedPaymentStatsObj.map((p) => ({
      ...p,
      x: calcXCoord(p.day),
      y: calcYCoord(p.amount),
    }));

    // ===================

    interface StrokeProps {
      width: string,
      colorGreen: string,
      colorRed: string,
      linejoin: 'round' | 'miter' | 'bevel' | 'inherit',
    }

    interface PrevAdditionalCoords {
      x: number,
      y: number,
    }

    type AmountType = 'negative' | 'positive';

    const strokeProps: StrokeProps = {
      width: '2',
      colorGreen: '#0AAF60',
      colorRed: '#FA4545',
      linejoin: 'round',
    };

    const fillProps = {
      colorGreen: 'url(#greenGradient)',
      colorRed: 'url(#redGradient)',
      opacity: '0.2',
    };

    let dStrokeStr: string;
    let prevAdditionalCoords: PrevAdditionalCoords;

    paymentStatsWithCoords.forEach((p, i) => {
      // should be remade to ts type expression IS
      function checkAmountType(amount: number): AmountType {
        return amount >= 0 ? 'positive' : 'negative';
      }

      function drawFromPreviousAdditionalCoord() {
        dStrokeStr += `M ${prevAdditionalCoords.x} ${prevAdditionalCoords.y}`;
      }

      function drawToNextAdditionalCoords() {

      }

      let prevAmountType: AmountType;
      let nextAmountType: AmountType;

      let isPrevAdditionalCoordsUsed: boolean;
      let isNextAdditionalCoordsNeeded: boolean;

      const prevStatsAmount = paymentStatsWithCoords[i - 1]?.amount;
      const currenStatsAmount = p.amount;
      const nextStatsAmount = paymentStatsWithCoords[i + 1]?.amount;

      const currentAmountType = checkAmountType(currenStatsAmount);

      if (i === 0) {
        dStrokeStr = `M ${p.x} ${p.y}`;

        nextAmountType = checkAmountType(nextStatsAmount);
        isPrevAdditionalCoordsUsed = false;
        isNextAdditionalCoordsNeeded = currentAmountType === nextAmountType;
      } else if (i === daysAmount - 1) {
        prevAmountType = checkAmountType(prevStatsAmount);
        isPrevAdditionalCoordsUsed = prevAmountType === currentAmountType;
        isNextAdditionalCoordsNeeded = false;
      } else {
        prevAmountType = checkAmountType(prevStatsAmount);
        nextAmountType = checkAmountType(nextStatsAmount);
        isPrevAdditionalCoordsUsed = prevAmountType === currentAmountType;
        isNextAdditionalCoordsNeeded = currentAmountType === nextAmountType;
      }

      // const color = currentTrend === 'plus' ? 'colorGreen' : 'colorRed';

      // if (isTrendTheSame && i === daysAmount - 1) {
      //   paths.push(
      //     <path
      //       d={dStrokeStr}
      //       fill="none"
      //       strokeWidth={strokeProps.width}
      //       stroke={strokeProps[color]}
      //       strokeLinejoin={strokeProps.linejoin}
      //     />,
      //     <path
      //       d={`${dStrokeStr} Z`}
      //       fill={fillProps[color]}
      //       stroke="none"
      //       opacity={fillProps.opacity}
      //     />,
      //   );
      // }
    });

    // needs to be deleted
    if (zeroLinePath) paths.push(zeroLinePath);

    // ==============================

    setSvgPaths(paths);

    console.log(paymentStatsWithCoords);
  }, [adjustPaymentStats]);

  useEffect(paintGraph, [paintGraph]);

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
      <div className="w-full h-full pt-[80px] flex flex-col justify-start items-start gap-[16px]">
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
