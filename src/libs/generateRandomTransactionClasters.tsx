import { nanoid } from 'nanoid';
import { ACCOUNT_ID, PaymentStats, Transaction, TransactionStatus, TransactionType } from '@/server/utils';
import mockedPaymentStats from '@/ui/PaymentHistory/paymentStats.mock.json';

const positiveContacts = [
  {
    id: 'JK6d6qOkdsl-IdlMiq8jg',
    name: 'Gregory Hull',
    type: 'transfer',
  },
  {
    id: 'QTqfCmTvpL3RizhAu9Hw9',
    name: 'Dawson Hendrix',
    type: 'transfer',
  },
  {
    id: 'jDrYJXw-dkmBP40qmnkJG',
    name: 'Elsie Scott',
    type: 'transfer',
  },
  {
    id: 'JyD4Ww7hH8Y4HJ-rWlehO',
    name: 'Evelyn Alvarez',
    type: 'transfer',
  },
  {
    id: '_uhXGj-0cMPFTnBoZwGkB',
    name: 'Cooper Carlson',
    type: 'transfer',
  },
  {
    id: '-wgaQkPcRd7gF_54FehE9',
    name: 'Catherine Barr',
    type: 'transfer',
  },
  {
    id: 'puMmOFwAb7f8Dao2_mDDO',
    name: 'Emiliano Kane',
    type: 'transfer',
  },
  {
    id: '7SeV50EVMdSaNunI_iGen',
    name: 'Dexter McCarty',
    type: 'transfer',
  },
  {
    id: '4cULSkn2Ywr9-kF3W7hRT',
    name: 'Kinley Gordon',
    type: 'transfer',
  },
  {
    id: '_LEizjMYZK_2GOoSKL8_A',
    name: 'Binance',
    defaultDescription: 'Cryptocurrency exchange',
    type: 'deposit',
  },
  {
    id: '2Bw9ZKBPpWmpSpOgvDMtn',
    name: 'Salary',
    type: 'deposit',
  },
  {
    id: 'xoJ2sT4qRxI3fLcIihrH3',
    name: 'Zillow',
    defaultDescription: 'Real-estate',
    type: 'deposit',
  },
  {
    id: 'e4k8SD1kKn_Q3W8_1nwFm',
    name: 'Robinhood',
    defaultDescription: 'Trading',
    type: 'deposit',
  },
  {
    id: 'q5kfV6WtX7GEF9JmSHxRt',
    name: 'Cash deposit',
    type: 'deposit',
  },
  {
    id: 'qlSnBougDkvKsU-vEJ-Z1',
    name: 'Walmart',
    defaultDescription: 'Products',
    type: 'refund',
  },
  {
    id: '8OaIhb6CggQR5SzQEn7Fb',
    name: 'Apple Inc.',
    defaultDescription: 'Electronics',
    type: 'refund',
  },
  {
    id: 'ffSeFx_U3L9TWieDFOZaF',
    name: 'Levi\'s',
    defaultDescription: 'Clothes',
    type: 'refund',
  },
];

const negativeContacts = [
  {
    id: 'JK6d6qOkdsl-IdlMiq8jg',
    name: 'Gregory Hull',
    type: 'transfer',
  },
  {
    id: 'QTqfCmTvpL3RizhAu9Hw9',
    name: 'Dawson Hendrix',
    type: 'transfer',
  },
  {
    id: 'jDrYJXw-dkmBP40qmnkJG',
    name: 'Elsie Scott',
    type: 'transfer',
  },
  {
    id: 'JyD4Ww7hH8Y4HJ-rWlehO',
    name: 'Evelyn Alvarez',
    type: 'transfer',
  },
  {
    id: '_uhXGj-0cMPFTnBoZwGkB',
    name: 'Cooper Carlson',
    type: 'transfer',
  },
  {
    id: '-wgaQkPcRd7gF_54FehE9',
    name: 'Catherine Barr',
    type: 'transfer',
  },
  {
    id: 'puMmOFwAb7f8Dao2_mDDO',
    name: 'Emiliano Kane',
    type: 'transfer',
  },
  {
    id: '7SeV50EVMdSaNunI_iGen',
    name: 'Dexter McCarty',
    type: 'transfer',
  },
  {
    id: '4cULSkn2Ywr9-kF3W7hRT',
    name: 'Kinley Gordon',
    type: 'transfer',
  },
  {
    id: '_LEizjMYZK_2GOoSKL8_A',
    name: 'Binance',
    defaultDescription: 'Cryptocurrency exchange',
    type: 'payment',
  },
  {
    id: 'xoJ2sT4qRxI3fLcIihrH3',
    name: 'Zillow',
    defaultDescription: 'Real-estate',
    type: 'payment',
  },
  {
    id: 'e4k8SD1kKn_Q3W8_1nwFm',
    name: 'Robinhood',
    defaultDescription: 'Trading',
    type: 'payment',
  },
  {
    id: 'aBY4GD_CtVMEHo2n8i-_P',
    name: '7-Eleven',
    defaultDescription: 'Products',
    type: 'payment',
  },
  {
    id: 'ffSeFx_U3L9TWieDFOZaF',
    name: 'Levi\'s',
    defaultDescription: 'Clothes',
    type: 'payment',
  },
  {
    id: 'GHM6w9voQkHvkjEIyt6Lr',
    name: 'FedEx',
    defaultDescription: 'Post services',
    type: 'payment',
  },
  {
    id: '19g_bOCj-Q2YMIDoTaEDr',
    name: 'Netflix',
    defaultDescription: 'Video streaming service',
    type: 'payment',
  },
  {
    id: 'VLWvQHigfh_ZxgO3GhCYY',
    name: 'Wendy\'s',
    defaultDescription: 'Restaurant',
    type: 'payment',
  },
  {
    id: 'TP7krcFILsrWbsUUV3uoy',
    name: 'Nike',
    defaultDescription: 'Clothes',
    type: 'payment',
  },
  {
    id: 'OnR-4FyL14BlgFx27Ntrp',
    name: 'Pizza Hut',
    defaultDescription: 'Restaurant',
    type: 'payment',
  },
  {
    id: 'obDKKcSKHsB4-FJEJ0B97',
    name: 'Steam',
    defaultDescription: 'Gaming',
    type: 'payment',
  },
  {
    id: 'Lm4v9xuwaGtved8nDU4Ga',
    name: 'KFC',
    defaultDescription: 'Restaurant',
    type: 'payment',
  },
  {
    id: '8OaIhb6CggQR5SzQEn7Fb',
    name: 'Apple Inc.',
    defaultDescription: 'Electronics',
    type: 'payment',
  },
  {
    id: 'qlSnBougDkvKsU-vEJ-Z1',
    name: 'Walmart',
    defaultDescription: 'Products',
    type: 'payment',
  },
  {
    id: '38-tZVuCtLqIi8ANVoIB6',
    name: 'Cash withdrawal',
    type: 'payment',
  },
];

export default function createMock() {
  function generateRandomSum(isPositive: boolean) {
    let num = +((500 + (Math.random() * (3000 - 500))) * 100).toFixed(0);

    if (isPositive) return num;

    num = Number(`-${num}`);

    return num;
  }

  function generateTransactionWithoutDate(
    isPositiveBalance: boolean,
    amount: number,
    status: TransactionStatus,
  ) {
    let contact;

    if (isPositiveBalance) {
      contact = positiveContacts[+((positiveContacts.length - 1) * Math.random()).toFixed(0)];
    } else {
      contact = negativeContacts[+((negativeContacts.length - 1) * Math.random()).toFixed(0)];
    }

    const transactionWithoutDate: Omit<Transaction, 'timestamp'> = {
      id: nanoid(),
      type: contact.type as TransactionType,
      status,
      amount,
      currency: 'USD',
      accountId: ACCOUNT_ID,
    };

    if (isPositiveBalance) {
      transactionWithoutDate.senderId = contact.id;
    } else {
      transactionWithoutDate.recipientId = contact.id;
    }

    return transactionWithoutDate;
  }

  const paymentStats: PaymentStats[] = mockedPaymentStats;
  const transactionsWithoutDatesClaster: Omit<Transaction, 'timestamp'>[][] = [];

  for (let i = paymentStats.length - 1; i >= 0; i -= 1) {
    const amount = Number(paymentStats[i].amount);
    const amountInCents = amount * 100;

    const isPositiveBalance = amount >= 0;

    const firstPartOfTheSum = +((amountInCents * 0.5).toFixed(0));
    const secondPartOfTheSum = +((amountInCents * 0.34).toFixed(0));
    const thirdPartOfTheSum = +((amountInCents * 0.16).toFixed(0));

    const oneDayTransactionClaster = [
      generateTransactionWithoutDate(isPositiveBalance, firstPartOfTheSum, 'completed'),
      generateTransactionWithoutDate(isPositiveBalance, secondPartOfTheSum, 'completed'),
      generateTransactionWithoutDate(isPositiveBalance, thirdPartOfTheSum, 'completed'),
    ];

    const shouldAddFailed = Math.random() > 0.8;
    const shouldAddCancelled = Math.random() < 0.2;

    if (shouldAddFailed) {
      oneDayTransactionClaster.unshift(
        generateTransactionWithoutDate(
          !isPositiveBalance,
          generateRandomSum(!isPositiveBalance),
          'failed',
        ),
      );
    }

    if (shouldAddCancelled) {
      oneDayTransactionClaster.push(
        generateTransactionWithoutDate(
          !isPositiveBalance,
          generateRandomSum(!isPositiveBalance),
          'cancelled',
        ),
      );
    }

    transactionsWithoutDatesClaster.push(oneDayTransactionClaster);
  }

  return transactionsWithoutDatesClaster;
}
