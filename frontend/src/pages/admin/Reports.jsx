import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Reports from '../../components/admin/analytics/Reports';
import { getAnalytics } from '../../services/admin.service';

const ReportsPage = () => {
  const { t } = useTranslation('admin');
  return (
    <Reports
      title={t('reports_title')}
      subtitle={t('reports_subtitle')}
      eyebrow={t('eyebrow_management')}
      icon={BarChart3}
      fetchAnalytics={getAnalytics}
      ranges={[
        { value: '7', label: t('reports_range_7d') },
        { value: '30', label: t('reports_range_30d') },
        { value: '90', label: t('reports_range_90d') },
      ]}
      defaultRange="30"
      scope="platform"
      kpis={[
        { key: 'users', label: t('kpi_users'), tone: 'info' },
        { key: 'agents', label: t('kpi_agents'), tone: 'success' },
        { key: 'properties', label: t('kpi_properties'), tone: 'warning' },
        { key: 'visits', label: t('kpi_visits'), tone: 'neutral' },
      ]}
      labels={{
        registrations: t('reports_label_registrations'),
        checkins: t('reports_label_checkins'),
        items: t('reports_label_items'),
        emptyState: t('reports_label_empty'),
      }}
    />
  );
};

export default ReportsPage;