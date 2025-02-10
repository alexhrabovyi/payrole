import { Dispatch, SetStateAction, TransitionEventHandler, useMemo, useRef, useState } from 'react';
import formatAmount from '@/libs/formatAmount/formatAmount';

import Badge from '@/ui/Badge/Badge';
import DateRangeButton from './DateRangeButton/DateRangeButton';
import GraphAndDates from './GraphAndDates/GraphAndDates';
import { PaymentAndTransactionMetrics } from '../PaymentAndTransactionWrapper/PaymentAndTransactionWrapper';
import mockedPaymentStats from './paymentStats.mock.json';

import FullScreenOnIcon from './images/on_fullscreen_icon.svg';
import FullScreenOffIcon from './images/off_fullscreen_icon.svg';

import '@/server/utils';

export type ActiveDateRange = '1M' | '3M' | '6M' | '1Y';

type CompareText = 'vs last month' | 'vs last 3 months' | 'vs last 6 months' | 'vs last year';

export interface PaymentStats {
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

const paymentStats: PaymentStats[] = mockedPaymentStats;

export function divideDate(dateStr: string) {
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

export function calcAndFormatCurrentPeriodTotalAmount(
  formattedPaymentStats: FormattedPaymentStats[],
): FormattedTotalAmount {
  const totalAmount = +formattedPaymentStats.reduce((t, c) => t + c.amount, 0).toFixed(2);

  const formattedTotalAmount = formatAmount(totalAmount);
  const integer = `$${formattedTotalAmount.match(/-?(\d+,)*(\d+)/)?.[0]}` || '';
  const float = formattedTotalAmount.match(/\.\d\d/)?.[0] || '';

  return {
    totalAmount,
    integer,
    float,
  };
}

export function calcComparePercent(prevAmount: number, currentAmount: number) {
  return +((((currentAmount - prevAmount) / Math.abs(prevAmount)) * 100).toFixed(0));
}

interface PaymentHistoryProps {
  readonly isFullScreenOn: boolean,
  readonly setIsFullScreenOn: Dispatch<SetStateAction<boolean>>
  readonly wrapperMetrics: PaymentAndTransactionMetrics | null,
}

export default function PaymentHistory(
  { isFullScreenOn, setIsFullScreenOn, wrapperMetrics }: PaymentHistoryProps,
) {
  const BORDER_WIDTH_PX = 1;

  const paymentComponentRef = useRef<HTMLDivElement | null>(null);

  const [activeDateRangeBtn, setActiveDateRangeBtn] = useState<ActiveDateRange>('1M');

  const windowWidth = Number(wrapperMetrics?.windowWidth);

  const componentWidth = (() => {
    if (!wrapperMetrics) return;

    let width: number;

    if (wrapperMetrics.windowWidth < 1080 || isFullScreenOn) {
      width = wrapperMetrics.width;
    } else {
      width = (wrapperMetrics.width - wrapperMetrics.colGap) / 2;
    }

    return width;
  })();

  const graphAndDatesWidth = componentWidth ? componentWidth - BORDER_WIDTH_PX * 2 : null;

  let topIndentPx: number;

  if (windowWidth >= 1080) {
    topIndentPx = 60;
  } else if (windowWidth >= 600) {
    topIndentPx = 40;
  } else {
    topIndentPx = 20;
  }

  let amountOfMiddleDates: number;

  if (windowWidth >= 1080) {
    amountOfMiddleDates = isFullScreenOn ? 6 : 4;
  } else if (windowWidth >= 800) {
    amountOfMiddleDates = 6;
  } else if (windowWidth >= 600) {
    amountOfMiddleDates = 4;
  } else if (windowWidth >= 400) {
    amountOfMiddleDates = 2;
  } else {
    amountOfMiddleDates = 1;
  }

  const formattedAllPaymentStats = useMemo(() => {
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

    const currentPaymentStats = formattedAllPaymentStats.slice(startIndex);

    return currentPaymentStats;
  }, [activeDateRangeBtn, formattedAllPaymentStats]);

  const currentPeriodTotalAmount = useMemo(
    () => calcAndFormatCurrentPeriodTotalAmount(currentPeriodFormattedPaymentStats),
    [currentPeriodFormattedPaymentStats],
  );

  const comparePercent = useMemo(() => {
    const paymentStatsQuantity = paymentStats.length;

    let startIndex = 0;
    let endIndex = 0;

    switch (activeDateRangeBtn) {
      case '1M':
        startIndex = paymentStatsQuantity - 62;
        endIndex = paymentStatsQuantity - 31;
        break;
      case '3M':
        startIndex = paymentStatsQuantity - 186;
        endIndex = paymentStatsQuantity - 93;
        break;
      case '6M':
        startIndex = paymentStatsQuantity - 372;
        endIndex = paymentStatsQuantity - 186;
        break;
      case '1Y':
        startIndex = 0;
        endIndex = 366;
        break;
    }

    const previousPeriodStats = paymentStats.slice(startIndex, endIndex);
    const previousPeriodAmount = previousPeriodStats.reduce((t, s) => t += Number(s.amount), 0);
    const newComparePercent = calcComparePercent(
      previousPeriodAmount,
      currentPeriodTotalAmount.totalAmount,
    );

    return newComparePercent;
  }, [activeDateRangeBtn, currentPeriodTotalAmount]);

  const comparePercentStr = comparePercent >= 0 ? `+${comparePercent}%` : `${comparePercent}%`;

  const compareText = (() => {
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
  })();

  const currentPeriodAmountLabelText = `$${currentPeriodTotalAmount.totalAmount} is total amount for the chosen period of time. 
    It's ${comparePercent}% ${comparePercent >= 0 ? 'rise' : 'fall'} comparing to the previous period of time`;

  function fullScreenButtonOnClick() {
    setIsFullScreenOn(!isFullScreenOn);

    const paymentComponent = paymentComponentRef.current;

    if (paymentComponent) {
      paymentComponent.style.transitionDuration = '150ms';
      paymentComponent.style.transitionProperty = 'all';
      paymentComponent.style.transitionTimingFunction = 'ease-in-out';
    }
  }

  let mainDivClassName = `max-h-[450px] min-[1080px]:max-h-[auto] min-[1080px]:min-h-[500px] flex flex-col justify-start items-start gap-[10px]
    border-[${BORDER_WIDTH_PX}px] border-solid border-grey-200 rounded-[16px]`;
  if (isFullScreenOn) mainDivClassName += ' col-[1_/_3]';

  const paymentComponentOnTransitionEnd: TransitionEventHandler<HTMLDivElement> = (e) => {
    (e.target as HTMLElement).style.transitionDuration = '';
    (e.target as HTMLElement).style.transitionProperty = '';
    (e.target as HTMLElement).style.transitionTimingFunction = '';
  };

  return (
    <div
      ref={paymentComponentRef}
      className={mainDivClassName}
      style={{
        width: componentWidth ? `${componentWidth}px` : '100%',
      }}
      onTransitionEnd={paymentComponentOnTransitionEnd}
      data-testid="paymentHistory"
    >
      <div className="w-full flex flex-col justify-start items-start gap-[10px] p-[18px] min-[500px]:p-[24px]">
        <div className="w-full flex flex-col min-[500px]:flex-row min-[500px]:justify-between
          min-[500px]:items-center gap-[10px] min-[500px]:gap-0 mb-[10px] min-[500px]:mb-0"
        >
          <h2 className="font-tthoves font-medium text-[20px] text-darkBlue">
            Payment History
          </h2>
          <div className="flex justify-start items-center gap-[25px] 2xl:gap-[40px]">
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
            {windowWidth >= 1080 && (
              <button
                type="button"
                className="w-[25px] h-[25px] fill-grey-500 hover:fill-blue-hover active:fill-blue-active"
                onClick={fullScreenButtonOnClick}
                aria-label={isFullScreenOn ? 'Close fullscreen payment history chart' : 'Show payment history chart on fullscreen'}
                data-testid="fullScreenButton"
              >
                {isFullScreenOn ? (
                  <FullScreenOffIcon
                    className="hover:scale-[0.8] transition-standart"
                    data-testid="fullScreenBtnIcon"
                  />
                )
                  : (
                    <FullScreenOnIcon
                      className="hover:scale-[1.2] transition-standart"
                      data-testid="fullScreenBtnIcon"
                    />
                  )}
              </button>
            )}
          </div>
        </div>
        <div
          className="flex flex-row min-[500px]:flex-col justify-start items-center min-[500px]:items-start gap-[10px] flex-wrap"
          aria-live="polite"
          aria-atomic="true"
          aria-busy={!formattedAllPaymentStats}
          aria-label={currentPeriodAmountLabelText}
          data-testid="currentPeriodInfoBlock"
        >
          <p
            className="font-tthoves font-medium text-[38px] min-[500px]:text-[42px] text-darkBlue mr-[10px]  min-[500px]:mr-0"
            data-testid="totalAmountParagraph"
          >
            {currentPeriodTotalAmount.integer}
            <span className="text-[28px] min-[500px]:text-[32px] text-grey-400">
              {currentPeriodTotalAmount.float}
            </span>
          </p>
          <div className="flex justify-start items-center gap-[8px]">
            <Badge
              isPositive={comparePercent >= 0}
              testid="periodPercentBadge"
            >
              {comparePercentStr}
            </Badge>
            <p
              className="font-tthoves text-[14px] text-grey-400"
              data-testid="compareTextParagraph"
            >
              {compareText}
            </p>
          </div>
        </div>
      </div>
      <GraphAndDates
        paymentStats={currentPeriodFormattedPaymentStats}
        widthProp={graphAndDatesWidth}
        topIndentPx={topIndentPx}
        amountOfMiddleDates={amountOfMiddleDates}
      />
    </div>
  );
}
