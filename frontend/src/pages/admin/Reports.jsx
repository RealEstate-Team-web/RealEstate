import { BarChart3 } from 'lucide-react';
import Reports from '../../components/admin/analytics/Reports';
import { getAnalytics } from '../../services/admin.service';

const ReportsPage = () => (
  <Reports
    title="Reports"
    subtitle="Full breakdown of users, agents, properties, and visit activity"
    eyebrow="Management"
    icon={BarChart3}
    fetchAnalytics={getAnalytics}
    ranges={[
      { value: '7', label: '7d' },
      { value: '30', label: '30d' },
      { value: '90', label: '90d' },
    ]}
    defaultRange="30"
    scope="platform"
    kpis={[
      { key: 'users', label: 'Users', tone: 'info' },
      { key: 'agents', label: 'Agents', tone: 'success' },
      { key: 'properties', label: 'Properties', tone: 'warning' },
      { key: 'visits', label: 'Visits', tone: 'neutral' },
    ]}
    labels={{
      registrations: 'New registrations',
      checkins: 'Visit requests',
      items: 'Categories',
      emptyState: 'No reports available yet.',
    }}
  />
);

export default ReportsPage;
