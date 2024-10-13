import DashboardStats from '../DashboardStats/DashboardStats';
import PaymentAndTransactionHistWrapper from '../PaymentAndTransactionHistories/PaymentAndTransactionHistories';

export default function Dashboard() {
  const gridClassName = 'w-full grid grid-cols-[1fr_1fr] gap-x-[32px] gap-y-[34px]';

  return (
    <main className={gridClassName}>
      <DashboardStats type={'total' as const} />
      <DashboardStats type={'pending' as const} />
      <PaymentAndTransactionHistWrapper
        commonClassName={gridClassName}
      />
    </main>
  );
}
