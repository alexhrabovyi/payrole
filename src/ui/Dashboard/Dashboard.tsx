import CollectedPaidStats from '../CollectedPaidStats/CollectedPaidStats';

export default function Dashboard() {
  return (
    <main className="w-full grid grid-cols-[1fr_1fr] gap-x-[32px] gap-y-[34px]">
      <CollectedPaidStats />
      <div>123</div>
    </main>
  );
}
