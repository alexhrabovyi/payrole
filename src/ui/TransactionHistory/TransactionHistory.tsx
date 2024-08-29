import Link from 'next/link';
import Image from 'next/image';

import links from '@/libs/links';
import avatarSrc from './imgs/avatar.png';

export default function TransactionHistory() {
  return (
    <div className="w-full h-full p-[24px] flex flex-col justify-start
      items-stretch gap-[24px] border-grey"
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
}
