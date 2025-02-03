import { FC, SVGProps } from 'react';
import CollectedIcon from './imgs/collected.svg';
import PaidIcon from './imgs/paid.svg';
import PendingIcon from './imgs/pending.svg';
import PendingSumIcon from './imgs/pending_sum.svg';

interface StatsProps {
  readonly type: 'total' | 'pending',
}

export default function DashboardStats({ type }: StatsProps) {
  let FirstIcon: FC<SVGProps<SVGElement>>;
  let SecondIcon: FC<SVGProps<SVGElement>>;

  let firstTitle: string;
  let secondTitle: string;

  if (type === 'total') {
    FirstIcon = CollectedIcon;
    SecondIcon = PaidIcon;

    firstTitle = 'Collected';
    secondTitle = 'Paid';
  } else {
    FirstIcon = PendingIcon;
    SecondIcon = PendingSumIcon;

    firstTitle = 'Pending';
    secondTitle = 'Pending Sum';
  }

  return (
    <div className="w-full grid grid-cols-[1fr_1px_1fr] gap-[40px] p-[24px] border-grey">
      <div className="flex justify-start items-start gap-[16px]">
        <FirstIcon className="w-[24px] h-auto" />
        <div className="flex flex-col justify-start items-start gap-[14px]">
          <p className="font-tthoves text-grey-500 font-medium text-[16px]">
            {firstTitle}
          </p>
          <p className="font-tthoves text-darkBlue text-[32px] font-medium">
            $58,764
            <span className="text-[24px] text-grey-400">
              .25
            </span>
          </p>
        </div>
      </div>
      <span className="block w-full h-full bg-grey-100" />
      <div className="flex justify-start items-start gap-[16px]">
        <SecondIcon className="w-[24px] h-auto" />
        <div className="flex flex-col justify-start items-start gap-[14px]">
          <p className="font-tthoves text-grey-500 font-medium text-[16px]">
            {secondTitle}
          </p>
          <p className="font-tthoves text-darkBlue text-[32px] font-medium">
            $58,764
            <span className="text-[24px] text-grey-400">
              .25
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
