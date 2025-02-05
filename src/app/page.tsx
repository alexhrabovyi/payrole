import PageContainer from '@/ui/PageContainer/PageContainer';
import TopBar from '@/ui/TopBar/TopBar';
import Dashboard from '@/ui/Dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <PageContainer>
      {/* <TopBar
        title="Good morning, Chris"
        subtitle="Here&#39;s your dashboard overview."
      /> */}
      <Dashboard />
    </PageContainer>
  );
}
