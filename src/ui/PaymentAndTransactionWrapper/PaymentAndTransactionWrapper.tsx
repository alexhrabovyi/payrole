'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import useOnResize from '@/hooks/useOnResize';

import PaymentHistory from '../PaymentHistory/PaymentHistory';
import TransactionHistory from '../TransactionHistory/TransactionHistory';

export interface PaymentAndTransactionMetrics {
  windowWidth: number,
  width: number,
  height: number,
  colGap: number,
  rowGap: number,
}

export default function PaymentAndTransactionWrapper() {
  const paymentAndHistoryRef = useRef<HTMLDivElement | null>(null);

  const [windowWidth, setWindowWidth] = useState(0);
  const [isPaymentFullScreenOn, setIsPaymentFullScreenOn] = useState(false);
  const [wrapperMetrics, setWrapperMetrics] = useState<PaymentAndTransactionMetrics | null>(null);

  const inferWindowWidth = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useLayoutEffect(inferWindowWidth, [inferWindowWidth]);
  useOnResize(inferWindowWidth);

  const inferWrapperMetrics = useCallback(() => {
    const paymentAndHistory = paymentAndHistoryRef.current;

    if (!paymentAndHistory) return;

    const width = paymentAndHistory.offsetWidth;
    const totalHeight = paymentAndHistory.offsetHeight;

    let colGap: number;
    const colGapStyle = getComputedStyle(paymentAndHistory).columnGap;

    if (colGapStyle.match(/%/)) {
      colGap = width * (+colGapStyle.match(/\d+(\.\d+)?/)![0] / 100);
    } else {
      colGap = +colGapStyle.match(/\d+/)![0];
    }

    const rowGap = +getComputedStyle(paymentAndHistory).rowGap.match(/\d+/)![0];

    let oneRowHeight: number;

    if (isPaymentFullScreenOn) {
      oneRowHeight = (totalHeight - rowGap) / 2;
    } else {
      oneRowHeight = totalHeight;
    }

    setWrapperMetrics({
      windowWidth,
      width,
      height: oneRowHeight,
      colGap,
      rowGap,
    });
  }, [isPaymentFullScreenOn, windowWidth]);

  useLayoutEffect(inferWrapperMetrics, [inferWrapperMetrics]);

  function resetFullscreenOnMediaCrossing() {
    if (isPaymentFullScreenOn && windowWidth < 1080) setIsPaymentFullScreenOn(false);
  }

  resetFullscreenOnMediaCrossing();

  let className = `w-full relative col-[1_/_3] grid grid-cols-[1fr] min-[1080px]:grid-cols-[1fr_1fr]
    gap-x-[2.56%] 2xl:gap-x-[32px] gap-y-[28px] min-[500px]:gap-y-[34px]`;

  if (isPaymentFullScreenOn) {
    className += ' grid-rows-[1fr_1fr]';
  } else if (Number(wrapperMetrics?.windowWidth) < 1080) {
    className += ' grid-rows-[auto_auto]';
  }

  return (
    <div
      ref={paymentAndHistoryRef}
      className={className}
    >
      <PaymentHistory
        isFullScreenOn={isPaymentFullScreenOn}
        setIsFullScreenOn={setIsPaymentFullScreenOn}
        wrapperMetrics={wrapperMetrics}
      />
      <TransactionHistory
        isPaymentFullScreenOn={isPaymentFullScreenOn}
        wrapperMetrics={wrapperMetrics}
      />
    </div>
  );
}
