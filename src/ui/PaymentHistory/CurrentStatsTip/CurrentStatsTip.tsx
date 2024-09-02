import {
  useCallback, useLayoutEffect, useRef, useState,
} from 'react';

import useOnResize from '@/hooks/useOnResize';
import formatAmount from '@/libs/formatAmount';
import { TipConfig } from '../PaymentHistory';
import RevenueIcon from './imgs/revenue_icon.svg';

interface StatsTipProps {
  isActive: boolean
  tipConfig: TipConfig | null,
}

interface TipMetrics {
  tipHeight: number,
  circleHeight: number,
}

const CurrentStatsTip: React.FC<StatsTipProps> = ({ isActive, tipConfig }) => {
  const tipRef = useRef<HTMLDivElement | null>(null);
  const circleSpanRef = useRef<HTMLSpanElement | null>(null);

  const [tipMetrics, setTipMetrics] = useState<TipMetrics>({
    tipHeight: 0,
    circleHeight: 0,
  });

  const calcTipMetrics = useCallback(() => {
    const tip = tipRef.current;
    const circleSpan = circleSpanRef.current;

    if (!tip || !circleSpan) return;

    const tipHeight = tip.offsetHeight;
    const circleHeight = circleSpan.offsetHeight;

    setTipMetrics({
      tipHeight,
      circleHeight,
    });
  }, []);

  useLayoutEffect(calcTipMetrics, [calcTipMetrics]);
  useOnResize(calcTipMetrics);

  let XCoord;
  let YCoord;

  if (tipConfig) {
    XCoord = tipConfig.svgElX + tipConfig.x;
    YCoord = (tipConfig.svgElY + tipConfig.y)
      - tipMetrics.tipHeight + (tipMetrics.circleHeight / 2);
  } else {
    XCoord = 0;
    YCoord = 0;
  }

  const dateStr = `${tipConfig?.weekday}, ${tipConfig?.month} ${tipConfig?.day}, ${tipConfig?.year}`;
  const amount = `$${formatAmount(tipConfig?.amount || 0)}`;

  return (
    <div
      ref={tipRef}
      id={tipConfig?.id}
      className="absolute w-auto flex flex-col justify-start items-center gap-[12px] z-10 translate-x-[-50%]"
      style={{
        left: `${XCoord}px`,
        top: `${YCoord}px`,
        opacity: isActive ? '1' : '0',
        pointerEvents: isActive ? 'all' : 'none',
      }}
    >
      <div className="relative w-full min-w-[200px] flex flex-col justify-start items-start gap-[10px] p-[16px_12px_12px_12px] rounded-[8px] bg-white shadow-[0_20px_40px_0_rgba(208,213,221,0.5)]">
        <p className="font-tthoves font-medium text-[14px] text-grey-500">
          {dateStr}
        </p>
        <div className="w-full flex justify-start items-center gap-[8px] p-[8px] rounded-[8px] bg-[#F3F4F7]">
          <RevenueIcon className="w-[24px] h-auto" />
          <p className="font-tthoves font-medium text-[14px] text-grey-500">
            {(tipConfig?.amount || 0) >= 0 ? 'Profit' : 'Lesion'}
          </p>
          <p className="font-tthoves font-medium text-[16px] text-darkBlue">
            {amount}
          </p>
        </div>
        <svg
          className="absolute bottom-0 left-[50%] translate-y-[80%] translate-x-[-50%]"
          width="12"
          height="9"
          viewBox="0 0 12 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7.44115 7.50231C6.65435 8.31998 5.34565 8.31998 4.55885 7.50231L0.598648 3.38675C-0.623995 2.11615 0.27648 1.25385e-06 2.0398 1.11324e-06L9.96019 4.81637e-07C11.7235 3.41023e-07 12.624 2.11614 11.4014 3.38675L7.44115 7.50231Z" fill="white" />
        </svg>
      </div>
      <span
        ref={circleSpanRef}
        className="w-[16px] h-[16px] flex justify-center items-center rounded-[50%] bg-white shadow-[0_4px_10px_0_rgba(77,100,255,0.5)]"
      >
        <span className="w-[6px] h-[6px] rounded-[50%] bg-blue" />
      </span>
    </div>
  );
};

export default CurrentStatsTip;
