import Link from 'next/link';

import links from '@/libs/links';

import LogoIcon from './imgs/logo.svg';

export default function Logo() {
  return (
    <Link
      className="group px-[7px]"
      href={links.dashboard}
      aria-label="Payrole Dashboard"
    >
      <LogoIcon className="w-[113px] h-auto fill-darkBlue group-hover:fill-blue group-active:fill-blue-active transition-standart" />
    </Link>
  );
}
