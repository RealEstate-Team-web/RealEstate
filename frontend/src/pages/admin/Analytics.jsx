import {
  Users,
  ShieldCheck,
  Building2,
  CalendarCheck,
  CircleCheck,
  CircleDashed,
  CircleX,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Reports from '../../components/admin/analytics/Reports';
import { getAnalytics } from '../../services/admin.service';

const AnalyticsPage = () => {
  const { t } = useTranslation('admin');
  return (
    <Reports
      title={t('analytics_title')}
      subtitle={t('analytics_subtitle')}
      eyebrow={t('analytics_eyebrow')}
      icon={CalendarCheck}
      fetchAnalytics={getAnalytics}
      ranges={[
        { value: '7', label: t('reports_range_7d') },
        { value: '30', label: t('reports_range_30d') },
        { value: '90', label: t('reports_range_90d') },
      ]}
      defaultRange="7"
      kpis={[
        { key: 'users', label: t('kpi_users'), icon: Users, tone: 'info' },
        { key: 'agents', label: t('kpi_agents'), icon: ShieldCheck, tone: 'success' },
        {
          key: 'properties',
          label: t('kpi_properties'),
          icon: Building2,
          tone: 'warning',
        },
        { key: 'visits', label: t('kpi_visits'), icon: CalendarCheck, tone: 'neutral' },
        {
          key: 'completedVisits',
          label: t('kpi_completed_visits'),
          icon: CircleCheck,
          tone: 'success',
        },
        {
          key: 'pendingVisits',
          label: t('kpi_pending_visits'),
          icon: CircleDashed,
          tone: 'warning',
        },
        {
          key: 'cancelledVisits',
          label: t('kpi_cancelled_visits'),
          icon: CircleX,
          tone: 'danger',
        },
      ]}
      labels={{
        registrations: t('analytics_label_registrations'),
        checkins: t('reports_label_checkins'),
        items: t('reports_label_items'),
        emptyState: t('analytics_label_empty'),
      }}
      table={{
        title: t('analytics_table_title'),
        columns: [
          { key: 'name', label: t('analytics_col_category') },
          { key: 'count', label: t('analytics_col_listings'), accessor: (row) => Number(row.count) },
          { key: 'pct', label: t('analytics_col_share'), accessor: (row) => `${row.pct ?? 0}%` },
        ],
      }}
    />
  );
};

export default AnalyticsPage;