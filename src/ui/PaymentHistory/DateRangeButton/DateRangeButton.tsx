import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { ActiveDateRange } from '../PaymentHistory';

interface ButtonProps {
  dateBtnType: ActiveDateRange,
  activeButton: ActiveDateRange,
  setActiveButton: Dispatch<SetStateAction<ActiveDateRange>>,
  children: React.ReactNode,
}

const DateRangeButton: React.FC<ButtonProps> = ({
  dateBtnType,
  activeButton,
  setActiveButton,
  children,
}) => {
  const btnStandartClassname = `w-[36px] h-[30px] flex justify-center items-center font-tthoves 
    text-[14px] border-[1px] border-solid rounded-[8px] transition-standart`;
  const btnInactiveClassName = 'text-grey-500 hover:text-blue active:text-blue-active border-transparent';
  const btnActiveClassName = 'bg-grey-100 border-grey-200 font-medium text-darkBlue';

  const ariaLabelText: Record<string, string> = {
    '1M': 'Show payment history chart for the last month',
    '3M': 'Show payment history chart for the last three months',
    '6M': 'Show payment history chart for the last half a year',
    '1Y': 'Show payment history chart for the last year',
  };

  return (
    <button
      type="button"
      className={clsx(
        btnStandartClassname,
        activeButton === dateBtnType ? btnActiveClassName : btnInactiveClassName,
      )}
      disabled={activeButton === dateBtnType}
      aria-label={ariaLabelText[dateBtnType]}
      onClick={() => setActiveButton(dateBtnType)}
    >
      {children}
    </button>
  );
};

export default DateRangeButton;
