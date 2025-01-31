'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

import HomeIcon from './imgs/home.svg';
import ContractsIcon from './imgs/contracts.svg';
import DocumentsIcon from './imgs/documents.svg';
import InvoicesIcon from './imgs/invoices.svg';
import TransactionsIcon from './imgs/transactions.svg';
import InsuranceIcon from './imgs/insurance.svg';
import CardsIcon from './imgs/cards.svg';
import SettingsIcon from './imgs/settings.svg';

interface NavLinkProps {
  readonly text: string,
  readonly href: string,
}

const NavLink = memo<NavLinkProps>(({ text, href }) => {
  const path = usePathname();

  const iconClasses = clsx(
    'w-[24px] h-auto group-active:fill-blue-active transition-standart',
    path === href ? 'fill-blue group-hover:fill-blue-hover' : 'fill-grey-400 group-hover:fill-blue',
  );

  let Icon;

  switch (text) {
    case 'Home':
      Icon = HomeIcon;
      break;
    case 'Contracts':
      Icon = ContractsIcon;
      break;
    case 'Documents':
      Icon = DocumentsIcon;
      break;
    case 'Invoices':
      Icon = InvoicesIcon;
      break;
    case 'Transactions':
      Icon = TransactionsIcon;
      break;
    case 'Insurance':
      Icon = InsuranceIcon;
      break;
    case 'Cards':
      Icon = CardsIcon;
      break;
    case 'Settings':
      Icon = SettingsIcon;
      break;
    default:
      Icon = HomeIcon;
  }

  return (
    <Link
      className={
        clsx(
          `group w-full p-[12px] flex justify-start items-center gap-[12px] font-tthoves 
          text-[16px] font-medium active:text-blue-active transition-standart
          border-solid rounded-[12px] border-[1px]`,
          path === href && text !== 'Settings' && 'text-blue hover:text-blue-hover bg-grey-50 border-grey-200',
          path === href && text === 'Settings' && 'text-blue hover:text-blue-hover border-transparent',
          path !== href && 'text-grey-400 hover:text-blue border-transparent',
        )
      }
      href={href}
      aria-label={text}
    >
      <Icon
        className={iconClasses}
      />
      {text}
    </Link>
  );
});

export default NavLink;
