import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  BadgeCheck,
  CheckCircle2,
  CalendarCheck,
  MessageSquare,
  LayoutDashboard,
  AlertCircle,
} from 'lucide-react';
import KpiCard from '../../components/admin/KpiCard';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { getAgentDashboardStats } from '../../services/agent.service';

const NoData = ({ label = 'No data yet' }) => (
  <div className="flex-1 flex items-center justify-center py-10">
    <p className="text-[13px] text-[#9CA3AF]">{label}</p>
  </div>
);

const Card = ({ title, children, className = '' }) => (
  <div
    className={`bg-white border border-[#E5E7EB] rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.06)] p-4 ${className}`}
  >
    {title && <h2 className="text-[16px] font-semibold text-[#111827] mb-3">{title}</h2>}
    {children}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    'Agent';
  const agentIncomplete = user?.agentProfileStatus === 'incomplete';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getAgentDashboardStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((err) => {
        if (active) setError(err?.message || 'We couldn\'t load your dashboard. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const indicatorFor = (value) =>
    value > 0 ? null : <span className="text-[#9CA3AF]">No data yet</span>;

  const kpis = [
    {
      title: 'Total Properties',
      value: stats?.totalProperties ?? '—',
      indicator: loading ? <span className="text-[#9CA3AF]">Loading…</span> : indicatorFor(stats?.totalProperties ?? 0),
      icon: Building2,
      iconBg: 'bg-[#E7F0FB] text-[#4A9FF5]',
    },
    {
      title: 'Active Listings',
      value: stats?.activeListings ?? '—',
      indicator: loading ? <span className="text-[#9CA3AF]">Loading…</span> : indicatorFor(stats?.activeListings ?? 0),
      icon: BadgeCheck,
      iconBg: 'bg-[#E6F4EC] text-[#2F7A55]',
    },
    {
      title: 'Sold / Rented',
      value: stats?.soldRented ?? '—',
      indicator: loading ? <span className="text-[#9CA3AF]">Loading…</span> : indicatorFor(stats?.soldRented ?? 0),
      icon: CheckCircle2,
      iconBg: 'bg-[#FBF3DD] text-[#E7B85A]',
    },
    {
      title: 'Scheduled Visits',
      value: stats?.scheduledVisits ?? '—',
      indicator: loading ? <span className="text-[#9CA3AF]">Loading…</span> : indicatorFor(stats?.scheduledVisits ?? 0),
      icon: CalendarCheck,
      iconBg: 'bg-[#FBEAE9] text-[#D96B67]',
    },
    {
      title: 'Unread Messages',
      value: stats?.unreadMessages ?? '—',
      indicator: loading ? <span className="text-[#9CA3AF]">Loading…</span> : indicatorFor(stats?.unreadMessages ?? 0),
      icon: MessageSquare,
      iconBg: 'bg-slate-100 text-slate-500',
    },
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
          Overview
        </p>
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0"
          >
            <LayoutDashboard size={20} />
          </span>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            Welcome, {displayName}
          </h1>
        </div>
        <p className="text-[13px] text-[#6B7280] mt-1">
          Manage your listings and customer engagements from here
        </p>
      </div>

      {/* Incomplete profile banner */}
      {agentIncomplete && (
        <div className="flex items-start gap-3 bg-[#F7EFDD] border border-[#D8B878] rounded-xl px-4 py-3">
          <AlertCircle size={18} className="text-[#8A6A2F] shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#8A6A2F]">
            <span className="font-semibold">Your agent profile is incomplete.</span>{' '}
            Complete it to activate your account and list properties.{' '}
            <Link
              to={ROUTES.completeAgentProfile}
              className="font-semibold text-[#4A9FF5] hover:underline"
            >
              Complete Agent Profile
            </Link>
          </div>
        </div>
      )}

      {/* Load error banner */}
      {error && (
        <div role="alert" className="flex items-start gap-2 bg-[#FBEAE9] border border-[#E5B3B0] rounded-xl px-4 py-3 text-[13px] text-[#B34A44]">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
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

      {/* Placeholder panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card title="Property Views Trend">
          <NoData label="No activity data yet" />
        </Card>
        <Card title="Monthly Inquiries Volume">
          <NoData label="No inquiry data yet" />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
