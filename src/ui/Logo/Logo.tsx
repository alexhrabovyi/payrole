import Link from 'next/link';
import clsx from 'clsx';

import links from '@/libs/links';

import LogoIcon from './imgs/logo.svg';

interface LogoProps {
  readonly widthCls?: string,
  readonly addCls?: string,
  readonly testId?: string,
}

export default function Logo({ widthCls, addCls, testId }: LogoProps) {
  return (
    <Link
      className={clsx(
        'group px-[7px]',
        widthCls || 'w-[113px]',
        addCls,
      )}
      href={links.dashboard}
      aria-label="Payrole Dashboard"
      data-testid={testId}
    >
      <LogoIcon className="w-full h-auto fill-darkBlue group-hover:fill-blue group-active:fill-blue-active transition-standart" />
    </Link>
  );
}
