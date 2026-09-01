import {
  Users,
  ShieldCheck,
  Building2,
  CalendarCheck,
  CircleCheck,
  CircleDashed,
  CircleX,
} from 'lucide-react';
import Reports from '../../components/admin/analytics/Reports';
import { getAnalytics } from '../../services/admin.service';

const AnalyticsPage = () => (
  <Reports
    title="Analytics"
    subtitle="Live performance and activity metrics across the platform"
    eyebrow="Insights"
    icon={CalendarCheck}
    fetchAnalytics={getAnalytics}
    ranges={[
      { value: '7', label: '7d' },
      { value: '30', label: '30d' },
      { value: '90', label: '90d' },
    ]}
    defaultRange="7"
    kpis={[
      { key: 'users', label: 'Users', icon: Users, tone: 'info' },
      { key: 'agents', label: 'Agents', icon: ShieldCheck, tone: 'success' },
      {
        key: 'properties',
        label: 'Properties',
        icon: Building2,
        tone: 'warning',
      },
      { key: 'visits', label: 'Visits', icon: CalendarCheck, tone: 'neutral' },
      {
        key: 'completedVisits',
        label: 'Completed visits',
        icon: CircleCheck,
        tone: 'success',
      },
      {
        key: 'pendingVisits',
        label: 'Pending visits',
        icon: CircleDashed,
        tone: 'warning',
      },
      {
        key: 'cancelledVisits',
        label: 'Cancelled visits',
        icon: CircleX,
        tone: 'danger',
      },
    ]}
    labels={{
      registrations: 'User signups',
      checkins: 'Visit requests',
      items: 'Categories',
      emptyState: 'No analytics available yet.',
    }}
    table={{
      title: 'Categories breakdown',
      columns: [
        { key: 'name', label: 'Category' },
        { key: 'count', label: 'Listings', accessor: (row) => Number(row.count) },
        { key: 'pct', label: 'Share', accessor: (row) => `${row.pct ?? 0}%` },
      ],
    }}
  />
);

export default AnalyticsPage;
