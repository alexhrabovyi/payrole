import DashboardStats from '../DashboardStats/DashboardStats';
import PaymentAndTransactionWrapper from '../PaymentAndTransactionWrapper/PaymentAndTransactionWrapper';

export default function Dashboard() {
  const gridClassName = 'w-full grid grid-cols-[1fr_1fr] gap-x-[2.56%] 2xl:gap-x-[32px] gap-y-[34px]';

  return (
    <main className={gridClassName}>
      <DashboardStats type={'total' as const} />
      <DashboardStats type={'pending' as const} />
      <PaymentAndTransactionWrapper
        commonClassName={gridClassName}
      />
    </main>
  );
}
