import Link from 'next/link';
import clsx from 'clsx';

import links from '@/libs/links';

import LogoIcon from './imgs/logo.svg';

interface LogoProps {
  widthCls?: string,
  addCls?: string,
}

const Logo: React.FC<LogoProps> = ({ widthCls, addCls }) => (
  <Link
    className={clsx(
      'group px-[7px]',
      widthCls || 'w-[113px]',
      addCls,
    )}
    href={links.dashboard}
    aria-label="Payrole Dashboard"
  >
    <LogoIcon className="w-full h-auto fill-darkBlue group-hover:fill-blue group-active:fill-blue-active transition-standart" />
  </Link>
);

export default Logo;
