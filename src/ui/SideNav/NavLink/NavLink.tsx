'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

import HomeLogo from './imgs/home.svg';
import ContractsLogo from './imgs/contracts.svg';
import DocumentsLogo from './imgs/documents.svg';
import InvoicesLogo from './imgs/invoices.svg';
import TransactionsLogo from './imgs/transactions.svg';
import InsuranceLogo from './imgs/insurance.svg';
import CardsLogo from './imgs/cards.svg';
import SettingsLogo from './imgs/settings.svg';

interface NavLinkProps {
  text: string,
  href: string,
}

const NavLink = memo<NavLinkProps>(({ text, href }) => {
  const path = usePathname();

  const logoClasses = clsx(
    'w-[24px] h-auto group-active:fill-blue-active transition-standart',
    path === href ? 'fill-blue group-hover:fill-blue-hover' : 'fill-grey-400 group-hover:fill-blue',
  );

  let Logo;

  switch (text) {
    case 'Home':
      Logo = HomeLogo;
      break;
    case 'Contracts':
      Logo = ContractsLogo;
      break;
    case 'Documents':
      Logo = DocumentsLogo;
      break;
    case 'Invoices':
      Logo = InvoicesLogo;
      break;
    case 'Transactions':
      Logo = TransactionsLogo;
      break;
    case 'Insurance':
      Logo = InsuranceLogo;
      break;
    case 'Cards':
      Logo = CardsLogo;
      break;
    case 'Settings':
      Logo = SettingsLogo;
      break;
    default:
      Logo = HomeLogo;
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
      <Logo
        className={logoClasses}
      />
      {text}
    </Link>
  );
});

export default NavLink;
