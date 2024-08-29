import DashboardStats from '../DashboardStats/DashboardStats';
import PaymentHistory from '../PaymentHistory/PaymentHistory';
import TransactionHistory from '../TransactionHistory/TransactionHistory';

export default function Dashboard() {
  return (
    <main className="w-full grid grid-cols-[1fr_1fr] gap-x-[32px] gap-y-[34px]">
      <DashboardStats type={'total' as const} />
      <DashboardStats type={'pending' as const} />
      <PaymentHistory />
      <TransactionHistory />
    </main>
  );
}
