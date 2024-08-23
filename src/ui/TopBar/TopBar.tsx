import Image from 'next/image';

import Button from '../Button/Button';
import PlusIcon from './imgs/plus-icon.svg';
import avatarSrc from './imgs/avatar.png';

interface TopBarProps {
  title: string,
  subtitle?: string,
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  return (
    <div className="w-full py-[32px] flex justify-between items-center">
      <div className="flex flex-col justify-start items-start gap-[4px]">
        <h1 className="font-tthoves text-[32px] font-semibold text-darkBlue">
          {title}
        </h1>
        <p className="font-tthoves text-[16px] text-grey-600">
          {subtitle}
        </p>
      </div>
      <div className='flex justify-start items-center gap-[20px]'>
        <Button
          classNames="group"
        >
          Create A Contract
          <PlusIcon
            className="w-[24px] h-auto fill-white stroke-blue group-hover:stroke-blue-hover 
            group-active:stroke-blue-active group-hover:fill-white-hover group-active:fill-white-active"
          />
        </Button>
        <div className='flex justify-start items-center gap-[12px]'>
          <Image
            src={avatarSrc}
            alt="User's profile picture"
            className='w-[40px] h-[40px] rounded-[100px]'
          />
          <div className='flex flex-col justify-start items-start gap-[1px]'>
            <p className='font-tthoves text-[14px] font-medium text-darkBlue'>Chris Miguel</p>
            <p className='font-tthoves text-[12px] text-grey-500'>Freelancer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
