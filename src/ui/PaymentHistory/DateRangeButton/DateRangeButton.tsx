import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { ActiveDateRange } from '../PaymentHistory';

interface ButtonProps {
  readonly dateBtnType: ActiveDateRange,
  readonly activeButton: ActiveDateRange,
  readonly setActiveButton: Dispatch<SetStateAction<ActiveDateRange>>,
  readonly children: React.ReactNode,
}

export default function DateRangeButton({
  dateBtnType,
  activeButton,
  setActiveButton,
  children,
}: ButtonProps) {
  const btnStandartClassname = `w-[36px] h-[30px] flex justify-center items-center font-tthoves 
    text-[14px] border-[1px] border-solid rounded-[8px] transition-standart`;
  const btnInactiveClassName = 'text-grey-500 hover:text-blue active:text-blue-active border-transparent';
  const btnActiveClassName = 'bg-grey-100 border-grey-200 font-medium text-darkBlue';

  const ariaLabelText: Record<ActiveDateRange, string> = {
    '1M': 'Show payment history chart for the last month',
    '3M': 'Show payment history chart for the last three months',
    '6M': 'Show payment history chart for the last half a year',
    '1Y': 'Show payment history chart for the last year',
  };

  const dataTestId: Record<ActiveDateRange, string> = {
    '1M': 'rangeBtn-1m',
    '3M': 'rangeBtn-3m',
    '6M': 'rangeBtn-6m',
    '1Y': 'rangeBtn-1y',
  };

  function onClick() {
    if (activeButton !== dateBtnType) setActiveButton(dateBtnType);
  }

  return (
    <button
      type="button"
      className={clsx(
        btnStandartClassname,
        activeButton === dateBtnType ? btnActiveClassName : btnInactiveClassName,
      )}
      onClick={onClick}
      role="radio"
      aria-checked={dateBtnType === activeButton}
      aria-label={ariaLabelText[dateBtnType]}
      data-testid={dataTestId[dateBtnType]}
    >
      {children}
    </button>
  );
}
