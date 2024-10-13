import { Dispatch, SetStateAction, TransitionEventHandler, useCallback, useMemo, useRef, useState } from 'react';
import formatAmount from '@/libs/formatAmount/formatAmount';

import Badge from '@/ui/Badge/Badge';
import DateRangeButton from './DateRangeButton/DateRangeButton';
import GraphAndDates from './GraphAndDates/GraphAndDates';
import { PaymentAndTransactionMetrics } from '../PaymentAndTransactionHistories/PaymentAndTransactionHistories';

import FullScreenOnIcon from './images/on_fullscreen_icon.svg';
import FullScreenOffIcon from './images/off_fullscreen_icon.svg';

export type ActiveDateRange = '1M' | '3M' | '6M' | '1Y';

type CompareText = 'vs last month' | 'vs last 3 months' | 'vs last 6 months' | 'vs last year';

interface PaymentStats {
  date: string,
  amount: string,
}

export interface FormattedPaymentStats {
  amount: number,
  day: number,
  month: string,
  monthNum: number,
  year: number,
  weekday: string,
}

interface FormattedTotalAmount {
  totalAmount: number,
  integer: string,
  float: string,
}

function generateRandomStats(): PaymentStats[] {
  function generateRandomNum(min: number, max: number) {
    return Math.random() * (max - min + 1) + min;
  }

  function createStatsObj(amount: string, year: number, month: number, day: number): PaymentStats {
    return {
      amount,
      date: `${month + 1}-${day}-${year}`,
    };
  }

  const MIN_AMOUNT = -3500;
  const MAX_AMOUNT = 3500;

  let currentMinAmount = MIN_AMOUNT;
  let currentMaxAmount = MAX_AMOUNT;

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const arrOfPaymentStats: PaymentStats[] = [];

  let strick = 0;

  for (let i = 731; i >= 0; i -= 1) {
    const randomNum = generateRandomNum(currentMinAmount, currentMaxAmount);

    if (randomNum >= 0) {
      strick += 1;
    } else {
      strick -= 1;
    }

    if (strick > 8) {
      strick = 0;
      currentMinAmount = randomNum - 700;
      currentMaxAmount = randomNum - 200;
    } else if (strick < -8) {
      strick = 0;
      currentMinAmount = randomNum + 200;
      currentMaxAmount = randomNum + 700;
    } else {
      const isRising = Math.random() >= 0.5;

      if (isRising) {
        currentMinAmount = randomNum;
        currentMaxAmount = randomNum + 500;
      } else {
        currentMaxAmount = randomNum;
        currentMinAmount = randomNum - 500;
      }

      if (currentMinAmount < MIN_AMOUNT) {
        currentMinAmount = MIN_AMOUNT;
      }

      if (currentMaxAmount > MAX_AMOUNT) {
        currentMaxAmount = MAX_AMOUNT;
      }
    }

    const fixedNum = randomNum.toFixed(2);

    const prevDate = new Date(currentYear, currentMonth, currentDay - i);
    const prevDay = prevDate.getDate();
    const prevMonth = prevDate.getMonth();
    const prevYear = prevDate.getFullYear();

    const statsObj = createStatsObj(fixedNum, prevYear, prevMonth, prevDay);
    arrOfPaymentStats.push(statsObj);
  }

  return arrOfPaymentStats;
}

const paymentStats = generateRandomStats();

const MONTHS: Record<number, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const WEEKDAYS: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

interface PaymentHistoryProps {
  isFullScreenOn: boolean,
  setIsFullScreenOn: Dispatch<SetStateAction<boolean>>
  wrapperMetrics: PaymentAndTransactionMetrics | null,
}

const PaymentHistory: React.FC<PaymentHistoryProps> = (
  { isFullScreenOn, setIsFullScreenOn, wrapperMetrics },
) => {
  const paymentComponentRef = useRef<HTMLDivElement | null>(null);

  const [activeDateRangeBtn, setActiveDateRangeBtn] = useState<ActiveDateRange>('1M');

  const componentWidth = useMemo(() => {
    let width = '100%';

    if (!wrapperMetrics) return width;

    if (isFullScreenOn) {
      width = `${wrapperMetrics.width}px`;
    } else {
      width = `${(wrapperMetrics.width - wrapperMetrics.colGap) / 2}px`;
    }

    return width;
  }, [isFullScreenOn, wrapperMetrics]);

  const formattedAllPaymentStats = useMemo(() => {
    function divideDate(dateStr: string) {
      const splittedDate = dateStr.split('-');

      const day = Number(splittedDate[1]);
      const monthNum = Number(splittedDate[0]);
      const month = MONTHS[monthNum];
      const year = Number(splittedDate[2]);

      const dateObj = new Date(year, monthNum - 1, day);
      const weekday = WEEKDAYS[dateObj.getDay()];

      return {
        day,
        month,
        monthNum,
        year,
        weekday,
      };
    }

    const last366DaysStatObjs = paymentStats.slice(366);

    const formattedPaymentStats: FormattedPaymentStats[] = [];

    last366DaysStatObjs.forEach((s) => {
      const dateInfo = divideDate(s.date);

      formattedPaymentStats.push({
        ...dateInfo,
        amount: Number(s.amount),
      });
    });

    return formattedPaymentStats;
  }, []);

  const currentPeriodFormattedPaymentStats = useMemo(() => {
    let startIndex = 0;
    const endIndex = formattedAllPaymentStats.length;

    if (activeDateRangeBtn === '1M') {
      startIndex = endIndex - 31;
    } else if (activeDateRangeBtn === '3M') {
      startIndex = endIndex - 93;
    } else if (activeDateRangeBtn === '6M') {
      startIndex = endIndex - 186;
    } else if (activeDateRangeBtn === '1Y') {
      startIndex = 0;
    }

    const currentPaymentStats = formattedAllPaymentStats.slice(startIndex, endIndex);

    return currentPaymentStats;
  }, [activeDateRangeBtn, formattedAllPaymentStats]);

  const currentPeriodTotalAmount = useMemo<FormattedTotalAmount>(() => {
    const totalAmount = currentPeriodFormattedPaymentStats.reduce((t, c) => t += c.amount, 0);

    const formattedTotalAmount = formatAmount(totalAmount);
    const integer = `$${formattedTotalAmount.match(/-?(\d+,)*(\d+)/)![0]}` || '';
    const float = formattedTotalAmount.match(/\.\d\d/)?.[0] || '';

    return {
      totalAmount,
      integer,
      float,
    };
  }, [currentPeriodFormattedPaymentStats]);

  const comparePercent = useMemo(() => {
    const formattedStatsQuantity = paymentStats.length;

    let startIndex = 0;
    let endIndex = 0;

    switch (activeDateRangeBtn) {
      case '1M':
        startIndex = formattedStatsQuantity - 62;
        endIndex = formattedStatsQuantity - 31;
        break;
      case '3M':
        startIndex = formattedStatsQuantity - 186;
        endIndex = formattedStatsQuantity - 93;
        break;
      case '6M':
        startIndex = formattedStatsQuantity - 372;
        endIndex = formattedStatsQuantity - 186;
        break;
      case '1Y':
        startIndex = 0;
        endIndex = 366;
        break;
    }

    const previousPeriodStats = paymentStats.slice(startIndex, endIndex);
    const previousPeriodAmount = previousPeriodStats.reduce((t, s) => t += Number(s.amount), 0);

    const newComparePercent = Number((((currentPeriodTotalAmount.totalAmount - previousPeriodAmount)
      / Math.abs(previousPeriodAmount)) * 100).toFixed(0));

    return newComparePercent;
  }, [activeDateRangeBtn, currentPeriodTotalAmount]);

  const comparePercentStr = comparePercent >= 0 ? `+${comparePercent}%` : `${comparePercent}%`;

  // useMemo isn't necessary there
  const compareText = useMemo(() => {
    let newCompareText: CompareText;

    switch (activeDateRangeBtn) {
      case '1M':
        newCompareText = 'vs last month';
        break;
      case '3M':
        newCompareText = 'vs last 3 months';
        break;
      case '6M':
        newCompareText = 'vs last 6 months';
        break;
      case '1Y':
        newCompareText = 'vs last year';
        break;
    }

    return newCompareText;
  }, [activeDateRangeBtn]);

  const currentPeriodAmountLabelText = `$${currentPeriodTotalAmount.totalAmount.toFixed(2)} is total amount for the chosen period of time. 
    It's ${comparePercent}% ${comparePercent >= 0 ? 'rise' : 'fall'} comparing to the previous period of time`;

  // memoization is not necessary there
  const fullScreenButtonOnClick = useCallback(() => {
    const paymentComponent = paymentComponentRef.current;

    if (!paymentComponent) return;

    paymentComponent.style.transitionDuration = '150ms';
    paymentComponent.style.transitionProperty = 'all';
    paymentComponent.style.transitionTimingFunction = 'ease-in-out';

    setIsFullScreenOn((currentState) => !currentState);
  }, [paymentComponentRef, setIsFullScreenOn]);

  let mainDivClassName = 'min-h-[500px] flex flex-col justify-start items-start gap-[10px] border-grey';
  if (isFullScreenOn) mainDivClassName += ' col-[1_/_3]';

  // memoization is not necessary there
  const paymentComponentOnTransitionEnd = useCallback<TransitionEventHandler<
    HTMLDivElement>>((e) => {
      (e.target as HTMLElement).style.transitionDuration = '';
      (e.target as HTMLElement).style.transitionProperty = '';
      (e.target as HTMLElement).style.transitionTimingFunction = '';
    }, []);

  return (
    <div
      ref={paymentComponentRef}
      className={mainDivClassName}
      style={{
        width: componentWidth,
      }}
      onTransitionEnd={paymentComponentOnTransitionEnd}
    >
      <div className="w-full flex flex-col justify-start items-start gap-[10px] px-[24px] pt-[24px]">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-tthoves font-medium text-[20px] text-darkBlue">
            Payment History
          </h2>
          <div className="flex justify-start items-center gap-[40px]">
            <div
              className="flex justify-start items-center gap-[8px]"
              role="radiogroup"
              aria-label="Choose period which payment history chart will be shown for"
            >
              <DateRangeButton
                dateBtnType="1M"
                activeButton={activeDateRangeBtn}
                setActiveButton={setActiveDateRangeBtn}
              >
                1M
              </DateRangeButton>
              <DateRangeButton
                dateBtnType="3M"
                activeButton={activeDateRangeBtn}
                setActiveButton={setActiveDateRangeBtn}
              >
                3M
              </DateRangeButton>
              <DateRangeButton
                dateBtnType="6M"
                activeButton={activeDateRangeBtn}
                setActiveButton={setActiveDateRangeBtn}
              >
                6M
              </DateRangeButton>
              <DateRangeButton
                dateBtnType="1Y"
                activeButton={activeDateRangeBtn}
                setActiveButton={setActiveDateRangeBtn}
              >
                1Y
              </DateRangeButton>
            </div>
            <button
              type="button"
              className="w-[25px] h-[25px] fill-grey-500 hover:fill-blue-hover active:fill-blue-active"
              onClick={fullScreenButtonOnClick}
              aria-label={isFullScreenOn ? 'Close fullscreen payment history chart' : 'Show payment history chart on fullscreen'}
            >
              {isFullScreenOn ? <FullScreenOffIcon className="hover:scale-[0.8] transition-standart" />
                : <FullScreenOnIcon className="hover:scale-[1.2] transition-standart" />}
            </button>
          </div>
        </div>
        <div
          className="flex flex-col justify-start items-start gap-[10px]"
          aria-live="polite"
          aria-atomic="true"
          aria-busy={!formattedAllPaymentStats}
          aria-label={currentPeriodAmountLabelText}
        >
          <p className="font-tthoves font-medium text-[42px] text-darkBlue">
            {currentPeriodTotalAmount.integer}
            <span className="text-[32px] text-grey-400">
              {currentPeriodTotalAmount.float}
            </span>
          </p>
          <div className="flex justify-start items-center gap-[8px]">
            <Badge
              isPositive={comparePercent >= 0}
            >
              {comparePercentStr}
            </Badge>
            <p className="font-tthoves text-[14px] text-grey-400">
              {compareText}
            </p>
          </div>
        </div>
      </div>
      <GraphAndDates
        paymentStats={currentPeriodFormattedPaymentStats}
        isFullScreenOn={isFullScreenOn}
        wrapperMetrics={wrapperMetrics}
      />
    </div>
  );
};

export default PaymentHistory;
