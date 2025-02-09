import mockedPaymentStats from '@/ui/PaymentHistory/paymentStats.mock.json';

export interface PaymentStats {
  date: string,
  amount: string,
}

export type CurrencyType = 'USD' | 'EUR';
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'failed';

export interface Transaction {
  id: string,
  type: TransactionType,
  status: TransactionStatus,
  amount: number,
  currency: CurrencyType,
  timeStamp: string,
  accountId: string,
  recipientId?: string,
  senderId?: string,
  description?: string,
}

const paymentStats: PaymentStats[] = mockedPaymentStats;
