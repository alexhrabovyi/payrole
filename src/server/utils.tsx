import transactionClastersMock from './transactionClasters.mock.json';

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

export interface CollectedPaidAndPending {
  collected: number,
  paid: number,
  amount: number,
  sum: number,
}

export const ACCOUNT_ID = 'mX7orvBJQQNZA80q4CFLI';

// async function fakeNetwork() {
//   return new Promise((res) => {
//     setTimeout(res, Math.random() * 800);
//   });
// }

async function fakeNetwork() {
  return new Promise((res) => {
    setTimeout(res, 1000);
  });
}

const transactionClasters = transactionClastersMock as Transaction[][];

function addDate(clasters: Transaction[][]) {
  const currentDateObj = new Date();
  const currentYear = currentDateObj.getFullYear();
  const currentMonth = currentDateObj.getMonth();
  const currentDay = currentDateObj.getDate();

  const transactionsWithDates: Transaction[] = [];

  for (let i = 0; i < clasters.length; i += 1) {
    const currentClaster = clasters[i];

    const transactionDate = new Date(
      currentYear,
      currentMonth,
      currentDay - (clasters.length - i),
    );

    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth();
    const transactionDay = transactionDate.getDate();

    const dateStr = `${transactionYear}-${transactionMonth + 1}-${transactionDay}`;

    for (let k = 0; k < currentClaster.length; k += 1) {
      const currentTransactionWithoutDate = currentClaster[k];

      const timeStampStr = `${dateStr}${currentTransactionWithoutDate.timestamp}`;

      const transaction: Transaction = {
        ...currentTransactionWithoutDate,
        timestamp: timeStampStr,
      };

      transactionsWithDates.push(transaction);
    }
  }

  return transactionsWithDates;
}

const transactionsWithTimestamp = addDate(transactionClasters);

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

function calcPending(transactions: Transaction[]) {
  const pendingTransactions = transactions.filter((t) => {
    if (t.status === 'pending' && (t.type === 'payment' || (t.type === 'transfer' && t.amount < 0))) {
      return true;
    }

    return false;
  });

  const sum = pendingTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const amount = pendingTransactions.length;

  return {
    amount,
    sum,
  };
}

export async function getCollectedPaidAndPending() {
  await fakeNetwork();

  const collectedAndPaid = calcCollectedAndPaidForLastMonth();
  const pending = calcPending(transactionsWithTimestamp);

  return new Response(JSON.stringify({
    ...collectedAndPaid,
    ...pending,
  }), {
    status: 200,
    statusText: 'OK',
  });
}
