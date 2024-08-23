import Link from 'next/link';

import links from '@/libs/links';
import NavLink from '../NavLink/NavLink';
import Logo from './imgs/logo.svg';

export default function SideNav() {
  return (
    <nav className="fixed top-0 left-0 w-[280px] h-full border-solid border-r-[1px] border-grey-200 px-[25px] py-[32px]
      flex flex-col justify-between items-stretch"
    >
      <div className="flex flex-col justify-between items-start gap-[56px]">
        <Link
          className="group px-[7px]"
          href={links.dashboard}
          aria-label="Payrole Dashboard"
        >
          <Logo className="w-[113px] h-[32px] fill-darkBlue group-hover:fill-blue group-active:fill-blue-active transition-standart" />
        </Link>
        <div className="w-full flex flex-col justify-start items-stretch gap-[16px]">
          <NavLink text="Home" href={links.dashboard} />
          <NavLink text="Contracts" href={links.contracts} />
          <NavLink text="Documents" href={links.documents} />
          <NavLink text="Invoices" href={links.invoices} />
          <NavLink text="Transactions" href={links.transactions} />
          <NavLink text="Insurance" href={links.insurance} />
          <NavLink text="Cards" href={links.cards} />
        </div>
      </div>
      <NavLink text="Settings" href={links.settings} />
    </nav>
  );
}
