import { PaymentStats } from '@/ui/PaymentHistory/PaymentHistory';

export default function generateRandomStats(): PaymentStats[] {
  function generateRandomNum(min: number, max: number) {
    return Math.random() * (max - min + 1) + min;
  }

  function createStatsObj(
    amount: string,
    year: number,
    month: number,
    day: number,
  ): PaymentStats {
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
