import transactionClastersMock from './transactionClasters.mock.json';

export const ACCOUNT_ID = 'mX7orvBJQQNZA80q4CFLI';

export interface PaymentStats {
  date: string,
  amount: string,
}

export type CurrencyType = 'USD';
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'failed';

export interface Transaction {
  id: string,
  type: TransactionType,
  status: TransactionStatus,
  amount: number,
  currency: CurrencyType,
  timestamp: string,
  accountId: string,
  recipientId?: string,
  senderId?: string,
  description?: string,
}

export interface Contact {
  id: string,
  name: string,
  defaultDescription?: string,
}

const transactionClasters = transactionClastersMock as Omit<Transaction, 'timestamp'>[][];

function addTimeStamps(clasters: Omit<Transaction, 'timestamp'>[][]) {
  const currentDateObj = new Date();
  const currentYear = currentDateObj.getFullYear();
  const currentMonth = currentDateObj.getMonth();
  const currentDay = currentDateObj.getDate();

  const transactionsWithDates: Transaction[] = [];

  for (let i = 0; i < clasters.length; i += 1) {
    const millisecondsInDay = 24 * 3600 * 1000;
    const currentClaster = clasters[i];
    const clasterLength = currentClaster.length;
    const millisecondsGap = millisecondsInDay / clasterLength;

    const transactionDate = new Date(
      currentYear,
      currentMonth,
      currentDay - (clasters.length - i),
    );

    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth();
    const transactionDay = transactionDate.getDate();

    const dateStr = `${transactionYear}-${transactionMonth + 1}-${transactionDay}`;

    for (let k = 0; k < clasterLength; k += 1) {
      const currentTransactionWithoutDate = currentClaster[k];
      const additionalMilliseconds = +(k * millisecondsGap
        + Math.random() * ((k + 1) * millisecondsGap - k * millisecondsGap)).toFixed(0);

      const currentTransactionDateObj = new Date(
        transactionDate.getTime() + additionalMilliseconds,
      );

      const currentHours = currentTransactionDateObj.getHours();
      const currentMinutes = currentTransactionDateObj.getMinutes();
      const currentSeconds = currentTransactionDateObj.getSeconds();

      const currentHoursStr = currentHours < 10 ? `0${currentHours}` : String(currentHours);
      const currentMinutesStr = currentMinutes < 10 ? `0${currentMinutes}` : String(currentMinutes);
      const currentSecondsStr = currentSeconds < 10 ? `0${currentSeconds}` : String(currentSeconds);

      const timeStampStr = `${dateStr}T${currentHoursStr}:${currentMinutesStr}:${currentSecondsStr}`;

      const transaction: Transaction = {
        ...currentTransactionWithoutDate,
        timestamp: timeStampStr,
      };

      transactionsWithDates.push(transaction);
    }
  }

  return transactionsWithDates;
}

function calcCollectedAndPaidForLastMonth() {
  const lastMonthClasters = transactionClasters.slice(transactionClasters.length - 31);

  let collected = 0;
  let paid = 0;

  lastMonthClasters.forEach((claster) => {
    claster.forEach((transaction) => {
      if (transaction.status === 'completed') {
        if (transaction.type === 'deposit' || transaction.type === 'refund') {
          collected += transaction.amount;
        } else if (transaction.type === 'withdrawal' || transaction.type === 'payment') {
          paid += Math.abs(transaction.amount);
        } else if (transaction.type === 'transfer') {
          if (transaction.amount > 0) {
            collected += transaction.amount;
          } else {
            paid += Math.abs(transaction.amount);
          }
        }
      }
    });
  });

  return {
    collected,
    paid,
  };
}

const transactionsWithTimestamp = addTimeStamps(transactionClasters);

console.log(transactionsWithTimestamp);
console.log(calcCollectedAndPaidForLastMonth());
