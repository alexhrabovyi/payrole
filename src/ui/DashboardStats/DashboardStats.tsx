import { FC, SVGProps } from 'react';
import CollectedIcon from './imgs/collected.svg';
import PaidIcon from './imgs/paid.svg';
import PendingIcon from './imgs/pending.svg';
import PendingSumIcon from './imgs/pending_sum.svg';

interface StatsProps {
  readonly type: 'total' | 'pending',
  readonly isTop: boolean,
}

export default function DashboardStats({ type, isTop }: StatsProps) {
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
            $58,764
            <span className="text-[22px] 2xl:text-[24px] text-grey-400">
              .25
            </span>
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
            $58,764
            <span className="text-[22px] 2xl:text-[24px] text-grey-400">
              .25
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
