import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import links from '@/libs/links';
import { PaymentAndTransactionMetrics } from '../PaymentAndTransactionHistories/PaymentAndTransactionHistories';

import avatarSrc from './imgs/avatar.png';

interface TransactionHistoryProps {
  readonly isPaymentFullScreenOn: boolean,
  readonly wrapperMetrics: PaymentAndTransactionMetrics | null;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = (
  { isPaymentFullScreenOn, wrapperMetrics },
) => {
  const transactionComponentRef = useRef<HTMLDivElement | null>(null);

  const [prevIsFullScreenOn, setPrevIsFullScreenOn] = useState(isPaymentFullScreenOn);

  let position: 'absolute' | 'relative';
  let width: string;
  let height: string;
  let topPos: string;
  let leftPos: string;

  if (wrapperMetrics) {
    const componentWidth = (wrapperMetrics.width - wrapperMetrics.colGap) / 2;
    const componentHeight = wrapperMetrics.height;

    position = 'absolute';
    width = `${componentWidth}px`;
    height = `${componentHeight}px`;

    if (isPaymentFullScreenOn) {
      topPos = `${componentHeight + wrapperMetrics.rowGap}px`;
      leftPos = `${wrapperMetrics.width / 2 - componentWidth / 2}px`;
    } else {
      topPos = '0px';
      leftPos = `${componentWidth + wrapperMetrics.colGap}px`;
    }
  } else {
    position = 'relative';
    width = '100%';
    height = '100%';
    topPos = '0px';
    leftPos = '0px';
  }

  const transactionComponent = transactionComponentRef.current;

  if (transactionComponent && (isPaymentFullScreenOn !== prevIsFullScreenOn)) {
    transactionComponent.style.transitionDuration = '150ms';
    transactionComponent.style.transitionProperty = 'all';
    transactionComponent.style.transitionTimingFunction = 'ease-in-out';

    transactionComponent.addEventListener('transitionend', () => {
      transactionComponent.style.transitionDuration = '';
      transactionComponent.style.transitionProperty = '';
      transactionComponent.style.transitionTimingFunction = '';
      setPrevIsFullScreenOn(!prevIsFullScreenOn);
    }, { once: true });
  }

  return (
    <div
      ref={transactionComponentRef}
      className="p-[24px] flex flex-col justify-start items-stretch gap-[24px] border-grey bg-white"
      style={{
        position,
        width,
        height,
        top: topPos,
        left: leftPos,
      }}
    >
      <div className="w-full flex justify-between items-center">
        <h3 className="font-tthoves font-medium text-[20px] text-darkBlue">
          Transaction History
        </h3>
        <Link
          className="font-tthoves text-[14px] font-semibold text-blue hover:text-blue-hover
          active:text-blue-active hover:underline transition-standart"
          href={links.transactions}
          aria-label="See all transactions"
        >
          See All
        </Link>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-[20px]">
        <div className="w-full flex justify-start items-center gap-[20px]">
          <div className="w-[48px] h-[48px] rounded-[50%] flex justify-center items-center
          overflow-hidden bg-lightBlue-96"
          >
            <Image
              className="w-[40px] h-[40px]"
              src={avatarSrc}
              alt="User Avatar"
            />
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves text-[16px] font-medium text-darkBlue">
                Cody Fisher
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                Louis Vuitton
              </p>
            </div>
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves font-medium text-[16px] text-darkBlue">
                $1,546
                <span className="font-tthoves font-medium text-[14px] text-grey-400">
                  .12
                </span>
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                1 Jun 2022
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start items-center gap-[20px]">
          <div className="w-[48px] h-[48px] rounded-[50%] flex justify-center items-center
          overflow-hidden bg-lightBlue-96"
          >
            <Image
              className="w-[40px] h-[40px]"
              src={avatarSrc}
              alt="User Avatar"
            />
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves text-[16px] font-medium text-darkBlue">
                Cody Fisher
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                Louis Vuitton
              </p>
            </div>
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves font-medium text-[16px] text-darkBlue">
                $1,546
                <span className="font-tthoves font-medium text-[14px] text-grey-400">
                  .12
                </span>
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                1 Jun 2022
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start items-center gap-[20px]">
          <div className="w-[48px] h-[48px] rounded-[50%] flex justify-center items-center
          overflow-hidden bg-lightBlue-96"
          >
            <Image
              className="w-[40px] h-[40px]"
              src={avatarSrc}
              alt="User Avatar"
            />
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves text-[16px] font-medium text-darkBlue">
                Cody Fisher
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                Louis Vuitton
              </p>
            </div>
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves font-medium text-[16px] text-darkBlue">
                $1,546
                <span className="font-tthoves font-medium text-[14px] text-grey-400">
                  .12
                </span>
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                1 Jun 2022
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start items-center gap-[20px]">
          <div className="w-[48px] h-[48px] rounded-[50%] flex justify-center items-center
          overflow-hidden bg-lightBlue-96"
          >
            <Image
              className="w-[40px] h-[40px]"
              src={avatarSrc}
              alt="User Avatar"
            />
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves text-[16px] font-medium text-darkBlue">
                Cody Fisher
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                Louis Vuitton
              </p>
            </div>
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves font-medium text-[16px] text-darkBlue">
                $1,546
                <span className="font-tthoves font-medium text-[14px] text-grey-400">
                  .12
                </span>
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                1 Jun 2022
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start items-center gap-[20px]">
          <div className="w-[48px] h-[48px] rounded-[50%] flex justify-center items-center
          overflow-hidden bg-lightBlue-96"
          >
            <Image
              className="w-[40px] h-[40px]"
              src={avatarSrc}
              alt="User Avatar"
            />
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves text-[16px] font-medium text-darkBlue">
                Cody Fisher
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                Louis Vuitton
              </p>
            </div>
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves font-medium text-[16px] text-darkBlue">
                $1,546
                <span className="font-tthoves font-medium text-[14px] text-grey-400">
                  .12
                </span>
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                1 Jun 2022
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start items-center gap-[20px]">
          <div className="w-[48px] h-[48px] rounded-[50%] flex justify-center items-center
          overflow-hidden bg-lightBlue-96"
          >
            <Image
              className="w-[40px] h-[40px]"
              src={avatarSrc}
              alt="User Avatar"
            />
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves text-[16px] font-medium text-darkBlue">
                Cody Fisher
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                Louis Vuitton
              </p>
            </div>
            <div className="flex flex-col justify-start items-start gap-[4px]">
              <p className="font-tthoves font-medium text-[16px] text-darkBlue">
                $1,546
                <span className="font-tthoves font-medium text-[14px] text-grey-400">
                  .12
                </span>
              </p>
              <p className="font-tthoves text-[14px] text-grey-500">
                1 Jun 2022
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
