import {
  useCallback, useMemo, useRef,
} from 'react';

import formatAmount from '@/libs/formatAmount';
import { TipConfig } from '../PaymentHistory';
import RevenueIcon from './imgs/revenue_icon.svg';

interface StatsTipProps {
  isActive: boolean
  tipConfig: TipConfig | null,
}

interface TipMetrics {
  tipWidth: number,
  tipHeight: number,
  circleWidth: number,
  circleHeight: number,
}

interface StyleParams {
  tipXCoord: number,
  tipYCoord: number,
  triangleXCoord: number,
  triangleYCoord: number,
  triangleClassName: string,
  circleXCoord: number,
  circleYCoord: number,
  verticalLineX: number,
  verticalLineY: number,
  verticalLineHeight: number,
  verticalLinePath: string,
}

const CurrentStatsTip: React.FC<StatsTipProps> = ({ isActive, tipConfig }) => {
  const TRIANGLE_LONG_SIDE = 12;
  const TRIANGLE_SHORT_SIDE = 9;
  const GAP_BETWEEN_TRIANGLE_AND_CIRCLE = 6;
  const TIP_X_PADDING = 12;
  const TRIANGLE_X_PADDING = 12;

  const tipRef = useRef<HTMLDivElement | null>(null);
  const circleSpanRef = useRef<HTMLSpanElement | null>(null);

  const calcTipMetrics = useCallback<() => TipMetrics | undefined>(() => {
    const tip = tipRef.current;
    const circleSpan = circleSpanRef.current;

    if (!tip || !circleSpan) return;

    const tipWidth = tip.offsetWidth;
    const tipHeight = tip.offsetHeight;

    const circleWidth = circleSpan.offsetWidth;
    const circleHeight = circleSpan.offsetHeight;

    return {
      tipWidth,
      tipHeight,
      circleWidth,
      circleHeight,
    };
  }, []);

  const styleParams = useMemo<StyleParams>(() => {
    let tipXCoord = 0;
    let tipYCoord = 0;

    let triangleXCoord = 0;
    let triangleYCoord = 0;
    let triangleClassName = 'absolute transition-[left_top] duration-150 ease-in-out';

    let circleXCoord = 0;
    let circleYCoord = 0;

    let verticalLineX = 0;
    let verticalLineY = 0;
    let verticalLineHeight = 0;
    let verticalLinePath = '';

    const tipMetrics = calcTipMetrics();

    if (tipConfig && tipMetrics) {
      const { tipWidth, tipHeight, circleWidth, circleHeight } = tipMetrics;

      const svgElLeft = tipConfig.svgElX;
      const svgElRight = tipConfig.svgElX + tipConfig.svgElWidth;
      const statPageX = svgElLeft + tipConfig.x;
      const statPageY = tipConfig.svgElY + tipConfig.y;

      const isTipRightOverflow = statPageX + tipWidth / 2 > svgElRight - TIP_X_PADDING;
      const isTipLeftOverflow = statPageX - tipWidth / 2 < svgElLeft + TIP_X_PADDING;

      circleXCoord = statPageX - circleWidth / 2;
      circleYCoord = statPageY - circleHeight / 2;

      verticalLineX = statPageX - 1;
      verticalLineY = tipConfig.svgElY;
      verticalLineHeight = tipConfig.svgElHeight;
      verticalLinePath = `M 0 0 L 0 ${verticalLineHeight}`;

      if (isTipRightOverflow) {
        tipXCoord = svgElRight - TIP_X_PADDING - tipWidth;
        triangleXCoord = statPageX - tipXCoord - TRIANGLE_LONG_SIDE / 2;

        const isTriangleRightOverflow = triangleXCoord
          + TRIANGLE_LONG_SIDE > tipWidth - TRIANGLE_X_PADDING;

        if (isTriangleRightOverflow) {
          tipXCoord = statPageX
            - (tipWidth + TRIANGLE_SHORT_SIDE + GAP_BETWEEN_TRIANGLE_AND_CIRCLE + circleWidth / 2);
          tipYCoord = statPageY - tipHeight / 2;

          triangleXCoord = tipWidth;
          triangleYCoord = tipHeight / 2 - TRIANGLE_LONG_SIDE / 2;
          triangleClassName += ' rotate-[-90deg] translate-x-[-20%]';
        } else {
          tipYCoord = statPageY - (tipHeight + TRIANGLE_SHORT_SIDE
            + GAP_BETWEEN_TRIANGLE_AND_CIRCLE + (circleHeight / 2));

          triangleYCoord = tipHeight;
          triangleClassName += ' translate-y-[-20%]';
        }
      } else if (isTipLeftOverflow) {
        tipXCoord = svgElLeft + TIP_X_PADDING;
        triangleXCoord = statPageX - tipXCoord - TRIANGLE_LONG_SIDE / 2;

        const isTriangleLeftOverflow = triangleXCoord < TRIANGLE_X_PADDING;

        if (isTriangleLeftOverflow) {
          tipXCoord = statPageX + TRIANGLE_SHORT_SIDE
            + GAP_BETWEEN_TRIANGLE_AND_CIRCLE + circleWidth / 2;
          tipYCoord = statPageY - tipHeight / 2;

          triangleXCoord = 0 - TRIANGLE_SHORT_SIDE;
          triangleYCoord = tipHeight / 2 - TRIANGLE_LONG_SIDE / 2;
          triangleClassName += ' rotate-[90deg]';
        } else {
          tipYCoord = statPageY - (tipHeight + TRIANGLE_SHORT_SIDE
            + GAP_BETWEEN_TRIANGLE_AND_CIRCLE + (circleHeight / 2));

          triangleYCoord = tipHeight;
          triangleClassName += ' translate-y-[-20%]';
        }
      } else {
        tipXCoord = statPageX - tipWidth / 2;

        tipYCoord = statPageY - (tipHeight + TRIANGLE_SHORT_SIDE
          + GAP_BETWEEN_TRIANGLE_AND_CIRCLE + (circleHeight / 2));

        triangleXCoord = statPageX - tipXCoord - TRIANGLE_LONG_SIDE / 2;
        triangleYCoord = tipHeight;
        triangleClassName += ' translate-y-[-20%]';
      }
    }

    return {
      tipXCoord,
      tipYCoord,
      triangleXCoord,
      triangleYCoord,
      triangleClassName,
      circleXCoord,
      circleYCoord,
      verticalLineX,
      verticalLineY,
      verticalLineHeight,
      verticalLinePath,
    };
  }, [calcTipMetrics, tipConfig]);

  const dateStr = `${tipConfig?.weekday}, ${tipConfig?.month} ${tipConfig?.day}, ${tipConfig?.year}`;
  const amount = `$${formatAmount(tipConfig?.amount || 0)}`;

  return (
    <>
      <svg
        className="absolute w-[2px] transition-[opacity] duration-150 ease-in-out"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          opacity: isActive ? '1' : '0',
          pointerEvents: isActive ? 'all' : 'none',
          left: `${styleParams.verticalLineX}px`,
          top: `${styleParams.verticalLineY}px`,
          height: `${styleParams.verticalLineHeight}px`,
        }}
      >
        <path
          d={styleParams.verticalLinePath}
          fill="none"
          strokeWidth="4"
          stroke="#CACACE"
          strokeDasharray="5,5"
        />
      </svg>
      <span
        ref={circleSpanRef}
        className="absolute w-[16px] h-[16px] flex justify-center items-center rounded-[50%]
          bg-white shadow-[0_4px_10px_0_rgba(77,100,255,0.5)] transition-[opacity] duration-150 ease-in-out"
        style={{
          opacity: isActive ? '1' : '0',
          pointerEvents: isActive ? 'all' : 'none',
          left: `${styleParams.circleXCoord}px`,
          top: `${styleParams.circleYCoord}px`,
        }}
      >
        <span className="w-[6px] h-[6px] rounded-[50%] bg-blue" />
      </span>
      <div
        id={tipConfig?.id}
        className="absolute w-auto  transition-[left_top_opacity] duration-150 ease-in-out"
        style={{
          left: `${styleParams.tipXCoord}px`,
          top: `${styleParams.tipYCoord}px`,
          opacity: isActive ? '1' : '0',
          pointerEvents: isActive ? 'all' : 'none',
        }}
      >
        <div
          ref={tipRef}
          className={`relative w-full min-w-[200px] flex flex-col justify-start items-start gap-[10px] 
        p-[16px_12px_12px_12px] rounded-[8px] bg-white shadow-[0_20px_40px_0_rgba(208,213,221,0.5)]`}
        >
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
            className={styleParams.triangleClassName}
            width={TRIANGLE_LONG_SIDE}
            height={TRIANGLE_SHORT_SIDE}
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              left: `${styleParams.triangleXCoord}px`,
              top: `${styleParams.triangleYCoord}px`,
            }}
          >
            <path d="M7.44115 7.50231C6.65435 8.31998 5.34565 8.31998 4.55885 7.50231L0.598648 3.38675C-0.623995 2.11615 0.27648 1.25385e-06 2.0398 1.11324e-06L9.96019 4.81637e-07C11.7235 3.41023e-07 12.624 2.11614 11.4014 3.38675L7.44115 7.50231Z" fill="white" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default CurrentStatsTip;
