import CollectedIcon from './imgs/collected.svg';
import PaidIcon from './imgs/paid.svg';

export default function CollectedPaidStats() {
  return (
    <div className="w-full grid grid-cols-[1fr_1px_1fr] gap-[40px] p-[24px] border-[1px] border-solid border-grey-200 rounded-[16px]">
      <div className="flex justify-start items-start gap-[16px]">
        <CollectedIcon className="w-[24px] h-[24px]" />
        <div className="flex flex-col justify-start items-start gap-[14px]">
          <p className="font-tthoves text-grey-500 font-medium text-[16px]">
            Collected
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
        <PaidIcon className="w-[24px] h-[24px]" />
        <div className="flex flex-col justify-start items-start gap-[14px]">
          <p className="font-tthoves text-grey-500 font-medium text-[16px]">
            Paid
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
