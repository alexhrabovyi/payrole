'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import Badge from '@/ui/Badge/Badge';
import DateRangeButton from './DateRangeButton/DateRangeButton';

const paymentStats = [
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
  const [dStrokeAttribute, setDStrokeAttribute] = useState('');
  const [dFillAttribute, setDFillAttribute] = useState('');

  const allAmounts = paymentStats.map((p) => Number(p.amount));
  const minAmount = Math.min(...allAmounts);
  const maxAmount = Math.max(...allAmounts);

  useEffect(() => {
    const svgWrapper = svgWrapperRef.current;
    const svgEl = svgRef.current;

    if (!svgEl) return;
    if (!svgWrapper) return;

    const svgWidth = svgWrapper.offsetWidth;
    const svgHeight = svgWrapper.offsetHeight;

    svgEl.setAttribute('width', String(svgWidth));
    svgEl.setAttribute('height', String(svgHeight));

    function divideDate(dateStr: string) {
      const splittedDate = dateStr.split('-');

      const day = Number(splittedDate[1]);
      const month = MONTHS[Number(splittedDate[0])];
      const year = splittedDate[2];

      return {
        day,
        month,
        year,
      };
    }

    const daysAmount = allAmounts.length;
    const XStep = Number((svgWidth / (daysAmount - 1)).toFixed(5));

    function calcXCoord(day: number): number {
      return Number((day * XStep - XStep).toFixed(0));
    }

    const bottomIndentPercent = 0.2;

    const maxYCoord = Number((svgHeight * (1 - bottomIndentPercent)).toFixed(0));
    const YStep = Number((maxYCoord / (maxAmount - minAmount)).toFixed(5));

    function calcYCoord(amount: number): number {
      return Math.abs(Number(((amount - minAmount) * YStep).toFixed(0)) - 140);
    }

    const enhancedPaymentStatsObjs = paymentStats.map((p) => {
      const dividedDate = divideDate(p.date);

      return {
        amount: p.amount,
        ...dividedDate,
        x: calcXCoord(dividedDate.day),
        y: calcYCoord(Number(p.amount)),
      };
    });

    const firstStatX = enhancedPaymentStatsObjs[0].x;
    const firstStatY = enhancedPaymentStatsObjs[0].y;
    let dStrokeStr = `M ${firstStatX} ${firstStatY}`;

    for (let i = 1; i < enhancedPaymentStatsObjs.length; i += 1) {
      const statObj = enhancedPaymentStatsObjs[i];

      dStrokeStr += ` L ${statObj.x} ${statObj.y}`;
    }

    let dFillStr = dStrokeStr;
    dFillStr += `L  ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

    setDStrokeAttribute(dStrokeStr);
    setDFillAttribute(dFillStr);

    console.log(enhancedPaymentStatsObjs);

    console.log(`
      canvasWidth: ${svgWidth};
      canvasHeight: ${svgHeight};
      maxYCoord: ${maxYCoord};
      minAmount: ${minAmount};
      maxAmount: ${maxAmount};
    `);
  }, [minAmount, maxAmount, allAmounts]);

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
            </defs>
            <path
              d={dStrokeAttribute}
              fill="none"
              strokeWidth="2"
              stroke="#0AAF60"
              strokeLinejoin="round"
            />
            <path
              d={dFillAttribute}
              fill="url(#greenGradient)"
              stroke="none"
              opacity="0.2"
            />
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
