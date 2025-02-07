import { TransitionEventHandler, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import links from '@/libs/links';
import { PaymentAndTransactionMetrics } from '../PaymentAndTransactionWrapper/PaymentAndTransactionWrapper';

import avatarSrc from './imgs/avatar.png';

interface TransactionHistoryProps {
  readonly isPaymentFullScreenOn: boolean,
  readonly wrapperMetrics: PaymentAndTransactionMetrics | null;
}

export default function TransactionHistory(
  { isPaymentFullScreenOn, wrapperMetrics }: TransactionHistoryProps,
) {
  const transactionComponentRef = useRef<HTMLDivElement | null>(null);

  const [prevIsFullScreenOn, setPrevIsFullScreenOn] = useState(isPaymentFullScreenOn);

  let position: 'absolute' | 'relative';
  let width: string;
  let topPos: string;
  let leftPos: string;

  if (wrapperMetrics && wrapperMetrics.windowWidth >= 1080) {
    const componentWidth = (wrapperMetrics.width - wrapperMetrics.colGap) / 2;
    const componentHeight = wrapperMetrics.height;

    position = 'absolute';
    width = `${componentWidth}px`;

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
    topPos = '0px';
    leftPos = '0px';
  }

  const transactionComponentOnTransitionEnd: TransitionEventHandler<HTMLDivElement> = (e) => {
    (e.target as HTMLElement).style.transitionDuration = '';
    (e.target as HTMLElement).style.transitionProperty = '';
    (e.target as HTMLElement).style.transitionTimingFunction = '';
  };

  const transactionComponent = transactionComponentRef.current;

  if (transactionComponent && (isPaymentFullScreenOn !== prevIsFullScreenOn)) {
    transactionComponent.style.transitionDuration = '150ms';
    transactionComponent.style.transitionProperty = 'all';
    transactionComponent.style.transitionTimingFunction = 'ease-in-out';

    setPrevIsFullScreenOn(!prevIsFullScreenOn);
  }

  return (
    <div
      ref={transactionComponentRef}
      className="flex justify-center items-start"
      style={{
        position,
        width,
        top: topPos,
        left: leftPos,
      }}
      onTransitionEnd={transactionComponentOnTransitionEnd}
    >
      <div className={`max-w-[500px] min-[1080px]:max-w-[100%] w-full h-full p-[18px] min-[500px]:p-[24px] 
        flex flex-col justify-start items-stretch gap-[24px] border-grey bg-white`}
      >
        <div className="flex justify-between items-center">
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
        <div className="flex flex-col justify-start items-stretch gap-[20px]">
          <div className="flex justify-start items-center gap-[15px] min-[500px]:gap-[20px]">
            <div className="w-[40px] min-[500px]:w-[48px] h-[40px] min-[500px]:h-[48px] rounded-[50%]
              flex justify-center items-center overflow-hidden bg-lightBlue-96 shrink-0"
            >
              <Image
                className="w-[36px] min-[500px]:w-[40px] h-[36px] min-[500px]:h-[40px]"
                src={avatarSrc}
                alt="User Avatar"
              />
            </div>
            <div className="w-full flex justify-between items-center gap-[20px]">
              <div className="flex flex-col justify-start items-start gap-[4px] flex-grow-0">
                <p className="font-tthoves text-[16px] font-medium text-darkBlue [word-break:break-word]">
                  Cody Fisher
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  Louis Vuitton
                </p>
              </div>
              <div className="flex flex-col justify-start items-start gap-[4px] shrink-0">
                <p className="font-tthoves font-medium text-[16px] text-darkBlue [word-break:break-word]">
                  $1,546
                  <span className="font-tthoves font-medium text-[14px] text-grey-400 [word-break:break-word]">
                    .12
                  </span>
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  1 Jun 2022
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-start items-center gap-[15px] min-[500px]:gap-[20px]">
            <div className="w-[40px] min-[500px]:w-[48px] h-[40px] min-[500px]:h-[48px] rounded-[50%]
              flex justify-center items-center overflow-hidden bg-lightBlue-96 shrink-0"
            >
              <Image
                className="w-[36px] min-[500px]:w-[40px] h-[36px] min-[500px]:h-[40px]"
                src={avatarSrc}
                alt="User Avatar"
              />
            </div>
            <div className="w-full flex justify-between items-center gap-[20px]">
              <div className="flex flex-col justify-start items-start gap-[4px] flex-grow-0">
                <p className="font-tthoves text-[16px] font-medium text-darkBlue [word-break:break-word]">
                  Cody Fisher
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  Louis Vuitton
                </p>
              </div>
              <div className="flex flex-col justify-start items-start gap-[4px] shrink-0">
                <p className="font-tthoves font-medium text-[16px] text-darkBlue [word-break:break-word]">
                  $1,546
                  <span className="font-tthoves font-medium text-[14px] text-grey-400 [word-break:break-word]">
                    .12
                  </span>
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  1 Jun 2022
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-start items-center gap-[15px] min-[500px]:gap-[20px]">
            <div className="w-[40px] min-[500px]:w-[48px] h-[40px] min-[500px]:h-[48px] rounded-[50%]
              flex justify-center items-center overflow-hidden bg-lightBlue-96 shrink-0"
            >
              <Image
                className="w-[36px] min-[500px]:w-[40px] h-[36px] min-[500px]:h-[40px]"
                src={avatarSrc}
                alt="User Avatar"
              />
            </div>
            <div className="w-full flex justify-between items-center gap-[20px]">
              <div className="flex flex-col justify-start items-start gap-[4px] flex-grow-0">
                <p className="font-tthoves text-[16px] font-medium text-darkBlue [word-break:break-word]">
                  Cody Fisher
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  Louis Vuitton
                </p>
              </div>
              <div className="flex flex-col justify-start items-start gap-[4px] shrink-0">
                <p className="font-tthoves font-medium text-[16px] text-darkBlue [word-break:break-word]">
                  $1,546
                  <span className="font-tthoves font-medium text-[14px] text-grey-400 [word-break:break-word]">
                    .12
                  </span>
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  1 Jun 2022
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-start items-center gap-[15px] min-[500px]:gap-[20px]">
            <div className="w-[40px] min-[500px]:w-[48px] h-[40px] min-[500px]:h-[48px] rounded-[50%]
              flex justify-center items-center overflow-hidden bg-lightBlue-96 shrink-0"
            >
              <Image
                className="w-[36px] min-[500px]:w-[40px] h-[36px] min-[500px]:h-[40px]"
                src={avatarSrc}
                alt="User Avatar"
              />
            </div>
            <div className="w-full flex justify-between items-center gap-[20px]">
              <div className="flex flex-col justify-start items-start gap-[4px] flex-grow-0">
                <p className="font-tthoves text-[16px] font-medium text-darkBlue [word-break:break-word]">
                  Cody Fisher
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  Louis Vuitton
                </p>
              </div>
              <div className="flex flex-col justify-start items-start gap-[4px] shrink-0">
                <p className="font-tthoves font-medium text-[16px] text-darkBlue [word-break:break-word]">
                  $1,546
                  <span className="font-tthoves font-medium text-[14px] text-grey-400 [word-break:break-word]">
                    .12
                  </span>
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  1 Jun 2022
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-start items-center gap-[15px] min-[500px]:gap-[20px]">
            <div className="w-[40px] min-[500px]:w-[48px] h-[40px] min-[500px]:h-[48px] rounded-[50%]
              flex justify-center items-center overflow-hidden bg-lightBlue-96 shrink-0"
            >
              <Image
                className="w-[36px] min-[500px]:w-[40px] h-[36px] min-[500px]:h-[40px]"
                src={avatarSrc}
                alt="User Avatar"
              />
            </div>
            <div className="w-full flex justify-between items-center gap-[20px]">
              <div className="flex flex-col justify-start items-start gap-[4px] flex-grow-0">
                <p className="font-tthoves text-[16px] font-medium text-darkBlue [word-break:break-word]">
                  Cody Fisher
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  Louis Vuitton
                </p>
              </div>
              <div className="flex flex-col justify-start items-start gap-[4px] shrink-0">
                <p className="font-tthoves font-medium text-[16px] text-darkBlue [word-break:break-word]">
                  $1,546
                  <span className="font-tthoves font-medium text-[14px] text-grey-400 [word-break:break-word]">
                    .12
                  </span>
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  1 Jun 2022
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-start items-center gap-[15px] min-[500px]:gap-[20px]">
            <div className="w-[40px] min-[500px]:w-[48px] h-[40px] min-[500px]:h-[48px] rounded-[50%]
              flex justify-center items-center overflow-hidden bg-lightBlue-96 shrink-0"
            >
              <Image
                className="w-[36px] min-[500px]:w-[40px] h-[36px] min-[500px]:h-[40px]"
                src={avatarSrc}
                alt="User Avatar"
              />
            </div>
            <div className="w-full flex justify-between items-center gap-[20px]">
              <div className="flex flex-col justify-start items-start gap-[4px] flex-grow-0">
                <p className="font-tthoves text-[16px] font-medium text-darkBlue [word-break:break-word]">
                  Cody Fisher
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  Louis Vuitton
                </p>
              </div>
              <div className="flex flex-col justify-start items-start gap-[4px] shrink-0">
                <p className="font-tthoves font-medium text-[16px] text-darkBlue [word-break:break-word]">
                  $1,546
                  <span className="font-tthoves font-medium text-[14px] text-grey-400 [word-break:break-word]">
                    .12
                  </span>
                </p>
                <p className="font-tthoves text-[14px] text-grey-500 [word-break:break-word]">
                  1 Jun 2022
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
