import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  UserCheck,
  Clock,
  Building2,
  Building,
  CalendarCheck,
  LayoutDashboard,
} from 'lucide-react';
import KpiCard from '../../components/admin/KpiCard';
import StatusDonutChart from '../../components/admin/StatusDonutChart';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import DashboardSearch from '../../components/common/DashboardSearch';
import { getDashboardStats } from '../../services/admin.service';

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/ /g, '-');
};

const Card = ({ title, children, className = '' }) => (
  <div
    className={`bg-white border border-[#E5E7EB] rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.06)] p-4 ${className}`}
  >
    {title && <h2 className="text-[16px] font-semibold text-[#111827] mb-3">{title}</h2>}
    {children}
  </div>
);

const NoData = ({ label = 'No data yet' }) => (
  <div className="flex-1 flex items-center justify-center py-10">
    <p className="text-[13px] text-[#9CA3AF]">{label}</p>
  </div>
);

const Dashboard = () => {
  const { t } = useTranslation('admin');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getDashboardStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((err) => {
        if (active) setError(err.message || t('dashboard_error_load'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  if (loading) {
    return <div className="py-20 text-center text-[#6B7280]">{t('dashboard_loading')}</div>;
  }
  if (error) {
    return <div className="py-20 text-center text-[#D96B67]">{error}</div>;
  }

  const kpis = [
    {
      title: t('kpi_total_users'),
      value: stats.totalUsers,
      indicator: <span className="text-[#4FAF83]">{t('kpi_live')}</span>,
      icon: Users,
      iconBg: 'bg-[#E7F0FB] text-[#4A9FF5]',
    },
    {
      title: t('kpi_total_agents'),
      value: stats.totalAgents,
      indicator: <span className="text-[#4FAF83]">{t('kpi_live')}</span>,
      icon: UserCheck,
      iconBg: 'bg-[#E7F0FB] text-[#4A9FF5]',
    },
    {
      title: t('kpi_pending_agents'),
      value: stats.pendingAgents,
      indicator: (
        <span className="text-[#D96B67] font-semibold">
          {t('dashboard_count_pending', { count: stats.pendingAgents })}
        </span>
      ),
      icon: Clock,
      iconBg: 'bg-[#FBF3DD] text-[#E7B85A]',
    },
    {
      title: t('kpi_total_properties'),
      value: stats.totalProperties ?? '—',
      indicator: <span className="text-[#4FAF83]">{t('kpi_live')}</span>,
      icon: Building2,
      iconBg: 'bg-[#FBF3DD] text-[#E7B85A]',
    },
    {
      title: t('kpi_draft_properties'),
      value: stats.propertiesByStatus?.draft ?? '—',
      indicator: (
        <span className="text-[#9CA3AF]">
          {t('dashboard_draft', { count: stats.propertiesByStatus?.draft ?? 0 })}
        </span>
      ),
      icon: Building,
      iconBg: 'bg-[#FBEAE9] text-[#D96B67]',
    },
    {
      title: t('kpi_scheduled_visits'),
      value: stats.scheduledVisits ?? '—',
      indicator: (
        <span className="text-[#9CA3AF]">
          {t('dashboard_count_scheduled', { count: stats.scheduledVisits ?? 0 })}
        </span>
      ),
      icon: CalendarCheck,
      iconBg: 'bg-slate-100 text-slate-500',
    },
  ];

  const recent = stats.recentAgents || [];
  const totalStatus = stats.statusBreakdown.reduce((sum, d) => sum + d.value, 0);
  const donutData = stats.statusBreakdown.map((d) => ({
    ...d,
    value: totalStatus ? Math.round((d.value / totalStatus) * 100) : 0,
  }));

  return (
    <div className="space-y-5 font-sans">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
            {t('dashboard_overview')}
          </p>
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0">
              <LayoutDashboard size={20} />
            </span>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
              {t('dashboard_title')}
            </h1>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-1">
            {t('dashboard_subtitle')}
          </p>
        </div>
        <div className="shrink-0 self-start">
          <DashboardSearch role="admin" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <KpiCard
            key={k.title}
            title={k.title}
            value={k.value}
            indicator={k.indicator}
            icon={k.icon}
            iconBg={k.iconBg}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <Card title={t('dashboard_card_registrations')} className="xl:col-span-4">
          {recent.length === 0 ? (
            <NoData label={t('dashboard_no_registrations')} />
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center space-x-3 min-w-0">
                    <Avatar
                      size={34}
                      src={r.profile_image_url || undefined}
                      alt={`${r.first_name} ${r.last_name}`}
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#111827] truncate">
                        {r.first_name} {r.last_name}
                      </p>
                      <p className="text-[11px] text-[#6B7280] truncate">
                        {r.agency || t('dashboard_agency_fallback')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#6B7280] shrink-0">
                    {formatDate(r.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title={t('dashboard_card_trend')} className="xl:col-span-5">
          <NoData label={t('dashboard_no_activity')} />
        </Card>

        <Card title={t('dashboard_card_status')} className="xl:col-span-3 flex flex-col">
          {totalStatus === 0 ? (
            <NoData label={t('dashboard_no_status')} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <StatusDonutChart data={donutData} />
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card>
          <div className="mb-1">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              {t('dashboard_recent_applications')}
            </h2>
            <p className="text-[12px] text-[#6B7280]">{t('dashboard_latest_signups')}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] text-[#111827] mt-2">
              <thead className="text-[#9CA3AF] font-semibold uppercase text-[10px] tracking-wider">
                <tr className="border-b border-slate-100">
                  <th className="py-2 px-2">{t('dashboard_col_applicant')}</th>
                  <th className="py-2 px-2">{t('dashboard_col_agent')}</th>
                  <th className="py-2 px-2">{t('dashboard_col_application')}</th>
                  <th className="py-2 px-2 text-right">{t('col_status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#6B7280]">
                      {t('dashboard_no_applications')}
                    </td>
                  </tr>
                ) : (
                  recent.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-2">
                        <div className="flex items-center space-x-2.5">
                          <Avatar
                            size={30}
                            src={a.profile_image_url || undefined}
                            alt={`${a.first_name} ${a.last_name}`}
                          />
                          <span className="font-semibold truncate">
                            {a.first_name} {a.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-[#6B7280]">{a.agency || t('dashboard_agency_fallback')}</td>
                      <td className="py-2.5 px-2 text-[#6B7280]">
                        {formatDate(a.created_at)}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <StatusBadge status={a.status}>{t(`status_${a.status}`, a.status)}</StatusBadge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="mb-1">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              {t('dashboard_recent_submissions')}
            </h2>
            <p className="text-[12px] text-[#6B7280]">{t('dashboard_newest_submissions')}</p>
          </div>
          <NoData label={t('dashboard_no_submissions')} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
