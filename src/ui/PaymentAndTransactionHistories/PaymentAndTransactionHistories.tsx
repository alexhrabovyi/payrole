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

const PaymentAndTransactionHistories: React.FC<ComponentProps> = ({ commonClassName }) => {
  const paymentAndHistoryRef = useRef<HTMLDivElement | null>(null);

  const [isPaymentFullScreenOn, setIsPaymentFullScreenOn] = useState(false);
  const [metrics, setMetrics] = useState<PaymentAndTransactionMetrics | null>(null);

  const updateMetrics = useCallback(() => {
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

    setMetrics({
      width,
      height: oneRowHeight,
      colGap,
      rowGap,
    });
  }, [isPaymentFullScreenOn]);

  useLayoutEffect(updateMetrics, [updateMetrics]);
  useOnResize(updateMetrics);

  let className = `col-[1_/_3] relative ${commonClassName}`;

  if (isPaymentFullScreenOn) className += ' grid-rows-[1fr_1fr]';

  return (
    <div
      ref={paymentAndHistoryRef}
      className={className}
    >
      <PaymentHistory
        isFullScreenOn={isPaymentFullScreenOn}
        setIsFullScreenOn={setIsPaymentFullScreenOn}
        wrapperMetrics={metrics}
      />
      <TransactionHistory
        isPaymentFullScreenOn={isPaymentFullScreenOn}
        wrapperMetrics={metrics}
      />
    </div>
  );
};

export default PaymentAndTransactionHistories;
