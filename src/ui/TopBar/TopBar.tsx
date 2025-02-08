import Image from 'next/image';

import Button from '../Button/Button';
import PlusIcon from './imgs/plus-icon.svg';
import avatarSrc from './imgs/avatar.png';

interface TopBarProps {
  title: string,
  subtitle?: string,
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <div className="w-full py-[20px] min-[500px]:py-[24px] min-[700px]:py-[28px] min-[900px]:py-[32px] flex flex-col-reverse min-[900px]:flex-row justify-start min-[900px]:justify-between
      items-start min-[900px]:items-center gap-[20px] min-[900px]:gap-[5%]"
    >
      <div className="w-full max-w-[580px] min-[900px]:w-auto min-[900px]:max-w-[auto] flex flex-col justify-start items-start gap-[4px]">
        <h1 className="font-tthoves text-[28px] min-[600px]:text-[32px] font-semibold text-darkBlue">
          {title}
        </h1>
        <p className="font-tthoves text-[16px] text-grey-600">
          {subtitle}
        </p>
      </div>
      <div className="w-full min-[900px]:w-auto flex flex-col-reverse min-[450px]:flex-row
        justify-start min-[450px]:justify-between min-[900px]:justify-start items-start min-[450px]:items-center gap-[20px] shrink-0"
      >
        <Button
          classNames="group p-[8px_10px] min-[450px]:p-[12px_14px] min-[600px]:p-[12px_20px]"
        >
          Create A Contract
          <PlusIcon
            className="w-[24px] h-auto fill-white stroke-blue group-hover:stroke-blue-hover
            group-active:stroke-blue-active group-hover:fill-white-hover group-active:fill-white-active"
          />
        </Button>
        <div className="flex justify-start items-center gap-[12px]">
          <Image
            src={avatarSrc}
            alt="User's profile picture"
            className="w-[40px] h-[40px] rounded-[100px]"
          />
          <div className="flex flex-col justify-start items-start gap-[1px]">
            <p className="font-tthoves text-[14px] font-medium text-darkBlue">Chris Miguel</p>
            <p className="font-tthoves text-[12px] text-grey-500">Freelancer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
