'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import useOnResize from '@/hooks/useOnResize';

import PaymentHistory from '../PaymentHistory/PaymentHistory';
import TransactionHistory from '../TransactionHistory/TransactionHistory';

export interface PaymentAndTransactionMetrics {
  width: number,
  height: number,
  colGap: number,
  rowGap: number,
}

interface ComponentProps {
  commonClassName: string,
}

const PaymentAndTransactionHistWrapper: React.FC<ComponentProps> = ({ commonClassName }) => {
  const paymentAndHistoryRef = useRef<HTMLDivElement | null>(null);

  const [isPaymentFullScreenOn, setIsPaymentFullScreenOn] = useState(false);
  const [wrapperMetrics, setWrapperMetrics] = useState<PaymentAndTransactionMetrics | null>(null);

  const inferWrapperMetrics = useCallback(() => {
    const paymentAndHistory = paymentAndHistoryRef.current;

    if (!paymentAndHistory) return;

    const width = paymentAndHistory.offsetWidth;
    const totalHeight = paymentAndHistory.offsetHeight;

    const colGap = +getComputedStyle(paymentAndHistory).columnGap.match(/\d+/)![0];
    const rowGap = +getComputedStyle(paymentAndHistory).rowGap.match(/\d+/)![0];

    let oneRowHeight: number;

    if (isPaymentFullScreenOn) {
      oneRowHeight = (totalHeight - rowGap) / 2;
    } else {
      oneRowHeight = totalHeight;
    }

    setWrapperMetrics({
      width,
      height: oneRowHeight,
      colGap,
      rowGap,
    });
  }, [isPaymentFullScreenOn]);

  useLayoutEffect(inferWrapperMetrics, [inferWrapperMetrics]);
  useOnResize(inferWrapperMetrics);

  let className = `relative col-[1_/_3] ${commonClassName}`;

  if (isPaymentFullScreenOn) className += ' grid-rows-[1fr_1fr]';

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
};

export default PaymentAndTransactionHistWrapper;
