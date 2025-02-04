import { screen, fireEvent } from '@testing-library/react';
import { ActiveDateRange } from '../PaymentHistory';

const DateRangeButtonPO = {
  classes: {
    inactive: 'text-grey-500 hover:text-blue active:text-blue-active border-transparent',
    active: 'bg-grey-100 border-grey-200 font-medium text-darkBlue',
  },

  ariaLabelText: {
    '1M': 'Show payment history chart for the last month',
    '3M': 'Show payment history chart for the last three months',
    '6M': 'Show payment history chart for the last half a year',
    '1Y': 'Show payment history chart for the last year',
  },

  getRangeBtns(): Record<ActiveDateRange, HTMLElement> {
    return {
      '1M': screen.getByTestId('rangeBtn-1m'),
      '3M': screen.getByTestId('rangeBtn-3m'),
      '6M': screen.getByTestId('rangeBtn-6m'),
      '1Y': screen.getByTestId('rangeBtn-1y'),
    };
  },

  clickOnRangeBtn(type: ActiveDateRange) {
    const rangeBtns = this.getRangeBtns();

    fireEvent.click(rangeBtns[type]);
  },
};

export default DateRangeButtonPO;
