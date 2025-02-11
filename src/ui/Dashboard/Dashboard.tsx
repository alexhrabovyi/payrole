import { CollectedPaidAndPending } from '@/server/utils';
import DashboardStats from '../DashboardStats/DashboardStats';
import PaymentAndTransactionWrapper from '../PaymentAndTransactionWrapper/PaymentAndTransactionWrapper';

async function getCollectedPaidAndPending() {
  const res = await fetch('http://localhost:3000/fakeAPI/getCollectedPaidAndPending');

  const data = await res.json() as CollectedPaidAndPending;

  return data;
}

export default async function Dashboard() {
  const collectedPaidAndPending = await getCollectedPaidAndPending();

  return (
    <main className="w-full grid grid-cols-[1fr_1fr] gap-x-[2.56%] 2xl:gap-x-[32px] gap-y-[28px] min-[500px]:gap-y-[34px]">
      <div className="col-[1/3] w-full grid grid-cols-[1fr] min-[1080px]:grid-cols-[1fr_1fr]
        gap-x-[2.56%] 2xl:gap-x-[32px] gap-y-[28px] min-[550px]:gap-y-[0px] min-[1080px]:gap-y-[34px] justify-items-center"
      >
        <DashboardStats
          type={'total' as const}
          isTop
          initialCollectedPaidAndPending={collectedPaidAndPending}
        />
        <div className="w-full min-[700px]:w-[80%] hidden min-[550px]:grid min-[1080px]:hidden grid-cols-[1fr_1fr]
          justify-items-center [border-width:0_1px_0px_0] border-solid border-grey-200"
        >
          <span className="w-[40%] h-[1px] bg-grey-100" />
          <span className="w-[40%] h-[1px] bg-grey-100" />
        </div>
        <DashboardStats
          type={'pending' as const}
          isTop={false}
          initialCollectedPaidAndPending={collectedPaidAndPending}
        />
      </div>
      <PaymentAndTransactionWrapper />
    </main>
  );
}
