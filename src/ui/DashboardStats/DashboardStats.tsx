'use client';

import { FC, SVGProps, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';
import { queryAPI, useGetCollectedPaidAndPendingQuery } from '@/store/queryAPI';
import { CollectedPaidAndPending } from '@/server/utils';
import formatAmount from '@/libs/formatAmount/formatAmount';

import CollectedIcon from './imgs/collected.svg';
import PaidIcon from './imgs/paid.svg';
import PendingIcon from './imgs/pending.svg';
import PendingSumIcon from './imgs/pending_sum.svg';

interface StatsProps {
  readonly type: 'total' | 'pending',
  readonly isTop: boolean,
  readonly initialCollectedPaidAndPending: CollectedPaidAndPending,
}

export default function DashboardStats({
  type,
  isTop,
  initialCollectedPaidAndPending,
}: StatsProps) {
  const dispatch = useDispatch();
  const { data } = useGetCollectedPaidAndPendingQuery(undefined, {
    skip: !!initialCollectedPaidAndPending,
  });

  useEffect(() => {
    if (initialCollectedPaidAndPending) {
      dispatch(
        queryAPI.util.upsertQueryData(
          'getCollectedPaidAndPending' as const,
          undefined,
          initialCollectedPaidAndPending,
        ) as any as UnknownAction,
      );
    }
  }, [initialCollectedPaidAndPending, dispatch]);

  const collectedPaidAndPending = data || initialCollectedPaidAndPending;

  let FirstIcon: FC<SVGProps<SVGElement>>;
  let SecondIcon: FC<SVGProps<SVGElement>>;

  let firstTitle: string;
  let secondTitle: string;

  if (type === 'total') {
    FirstIcon = CollectedIcon;
    SecondIcon = PaidIcon;

    firstTitle = 'Collected (last 31 days)';
    secondTitle = 'Paid (last 31 days)';
  } else {
    FirstIcon = PendingIcon;
    SecondIcon = PendingSumIcon;

    firstTitle = 'Pending Payments';
    secondTitle = 'Pending Sum';
  }

  let firstBlock: React.ReactNode | React.ReactNode[];
  let secondBlock: React.ReactNode | React.ReactNode[];

  if (collectedPaidAndPending) {
    if (type === 'total') {
      const collectedFormatted = `$${formatAmount(collectedPaidAndPending.collected / 100)}`;
      const collectedInt = collectedFormatted.replace(/\.\d{2}/, '');
      const collectedFloat = collectedFormatted.match(/\.\d{2}/)?.[0] || '';

      firstBlock = (
        <>
          {collectedInt}
          <span className="text-[22px] 2xl:text-[24px] text-grey-400">
            {collectedFloat}
          </span>
        </>
      );

      const paidFormatted = `$${formatAmount(collectedPaidAndPending.paid / 100)}`;
      const paidInt = paidFormatted.replace(/\.\d{2}/, '');
      const paidFloat = paidFormatted.match(/\.\d{2}/)?.[0] || '';

      secondBlock = (
        <>
          {paidInt}
          <span className="text-[22px] 2xl:text-[24px] text-grey-400">
            {paidFloat}
          </span>
        </>
      );
    } else {
      firstBlock = collectedPaidAndPending.amount;

      const pendingSumFormatted = `$${formatAmount(collectedPaidAndPending.sum / 100)}`;
      const pendingSumInt = pendingSumFormatted.replace(/\.\d{2}/, '');
      const pendingSumFloat = pendingSumFormatted.match(/\.\d{2}/)?.[0] || '';

      secondBlock = (
        <>
          {pendingSumInt}
          <span className="text-[22px] 2xl:text-[24px] text-grey-400">
            {pendingSumFloat}
          </span>
        </>
      );
    }
  }

  let className = `w-full min-[700px]:w-[80%] min-[1080px]:w-full grid grid-cols-[1fr] grid-rows-[1fr_1px_1fr] 
    min-[550px]:grid-rows-[auto] min-[550px]:grid-cols-[1fr_1px_1fr] gap-[15px] min-[550px]:gap-[3%] 2xl:gap-[40px] 
    p-[3.5%] 2xl:p-[24px] min-[1080px]:border-[1px] border-solid border-grey-200 min-[1080px]:rounded-[16px_16px_16px_16px]`;

  if (isTop) {
    className += ' border-grey min-[550px]:rounded-[16px_16px_0_0]  min-[550px]:[border-width:1px_1px_0px_1px]';
  } else {
    className += ' border-grey min-[550px]:rounded-[0_0_16px_16px]  min-[550px]:[border-width:0px_1px_1px_1px]';
  }

  return (
    <div className={className}>
      <div className="flex justify-start items-start gap-[12px] 2xl:gap-[16px]">
        <FirstIcon className="w-[24px] h-auto shrink-0" />
        <div className="flex flex-col justify-start items-start gap-[14px]">
          <p className="font-tthoves text-grey-500 font-medium text-[16px]">
            {firstTitle}
          </p>
          <p className="font-tthoves text-darkBlue text-[30px] 2xl:text-[32px] font-medium [word-break:break-word]">
            {firstBlock}
          </p>
        </div>
      </div>
      <span className="block w-[50%] min-[550px]:w-full h-full bg-grey-100 justify-self-center" />
      <div className="flex justify-start items-start gap-[12px] 2xl:gap-[16px]">
        <SecondIcon className="w-[24px] h-auto shrink-0" />
        <div className="flex flex-col justify-start items-start gap-[14px]">
          <p className="font-tthoves text-grey-500 font-medium text-[16px]">
            {secondTitle}
          </p>
          <p className="font-tthoves text-darkBlue text-[30px] 2xl:text-[32px] font-medium [word-break:break-word]">
            {secondBlock}
          </p>
        </div>
      </div>
    </div>
  );
}
