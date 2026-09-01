/**
 * Reports — a reusable, prop-driven analytics/reports component.
 *
 * Renders KPI cards (with count-up), time-trend charts, a per-item bar chart,
 * a category donut, and a data table — driven entirely by props and a single
 * data-fetching function. recharts is internal to this component; consumers
 * never need to import it.
 *
 * Minimal usage:
 *
 * ```jsx
 * <Reports
 *   title="Platform insights"
 *   subtitle="Everything happening across the platform"
 *   eyebrow="Analytics"
 *   fetchAnalytics={getAnalytics}
 *   ranges={[{ value: '7', label: '7d' }, { value: '30', label: '30d' }]}
 *   defaultRange="30"
 *   kpis={[
 *     { key: 'properties', label: 'Properties', icon: Building2, tone: 'info', format: 'integer' },
 *     { key: 'visits', label: 'Visits', icon: CalendarCheck, tone: 'success', format: 'integer' },
 *   ]}
 *   labels={{ registrations: 'New users', checkins: 'Visit requests', items: 'Categories' }}
 * />
 * ```
 *
 * See reports.types.js for the full Props and payload contract.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { RefreshCw } from 'lucide-react';

/* -------------------------------------------------------------------------- *
 * Default palettes / tokens
 * -------------------------------------------------------------------------- */

const DEFAULT_KPI_TONES = {
  info: { bg: 'bg-[#E7F0FB] text-[#4A9FF5]', bar: '#4A9FF5' },
  success: { bg: 'bg-[#E7F4EE] text-[#4FAF83]', bar: '#4FAF83' },
  warning: { bg: 'bg-[#FBF3DD] text-[#E7B85A]', bar: '#E7B85A' },
  danger: { bg: 'bg-[#FBEAE9] text-[#D96B67]', bar: '#D96B67' },
  neutral: { bg: 'bg-slate-100 text-slate-500', bar: '#9CA3AF' },
};

const DONUT_PALETTE = ['#4A9FF5', '#4FAF83', '#E7B85A', '#D96B67', '#9CA3AF', '#8B5CF6', '#EC4899', '#14B8A6'];

const DEFAULT_RANGES = [
  { value: '7', label: '7d' },
  { value: '30', label: '30d' },
  { value: '90', label: '90d' },
];

/* -------------------------------------------------------------------------- *
 * Formatting helpers
 * -------------------------------------------------------------------------- */

function formatNumber(value, format = 'integer') {
  const n = Number(value);
  if (Number.isNaN(n)) return '—';
  if (format === 'currency') {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);
  }
  if (format === 'percent') {
    return `${Math.round(n)}%`;
  }
  return new Intl.NumberFormat(undefined).format(Math.round(n));
}

/* -------------------------------------------------------------------------- *
 * Count-up hook (respects prefers-reduced-motion)
 * -------------------------------------------------------------------------- */

function useCountUp(target, enabled) {
  const [value, setValue] = useState(() => (enabled ? 0 : target));
  const frame = useRef();

  useEffect(() => {
    const reduced = !enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    const duration = 800;
    const start = performance.now();
    const from = value;
    cancelAnimationFrame(frame.current);
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, enabled]);

  return value;
}

/* -------------------------------------------------------------------------- *
 * Presentational helpers (internal, not exported)
 * -------------------------------------------------------------------------- */

function KpiCard({ config, value, countUp }) {
  const tone = DEFAULT_KPI_TONES[config.tone] || DEFAULT_KPI_TONES.info;
  const displayed = useCountUp(value, countUp);
  const Icon = config.icon;
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] flex flex-col justify-between min-h-[118px] hover:shadow-[0_4px_14px_rgba(15,23,42,0.08)] transition-shadow">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-[#6B7280]">{config.label}</p>
        {Icon && (
          <span
            aria-hidden="true"
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tone.bg}`}
          >
            <Icon size={17} />
          </span>
        )}
      </div>
      <p className="text-[28px] font-bold text-[#111827] leading-none mt-2">
        {formatNumber(displayed, config.format)}
      </p>
    </div>
  );
}

function RangePicker({ ranges, value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Time range"
      className="inline-flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5"
    >
      {ranges.map((r) => {
        const active = r.value === value;
        return (
          <button
            key={r.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(r.value)}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors ${
              active
                ? 'bg-white text-[#111827] shadow-[0_1px_3px_rgba(15,23,42,0.12)]'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.06)] p-4 flex flex-col ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-semibold text-[#111827]">{title}</h3>
          {subtitle && <p className="text-[12px] text-[#6B7280] mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#111827] text-white text-[12px] rounded-lg px-3 py-2 shadow-lg pointer-events-none">
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color || entry.payload?.fill }}
          />
          {entry.name}: <strong>{formatter ? formatter(entry.value) : entry.value}</strong>
        </p>
      ))}
    </div>
  );
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}

function EmptyState({ message }) {
  return (
    <div className="py-12 text-center">
      <p className="text-[13px] text-[#9CA3AF]">{message || 'No data available yet.'}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="py-12 text-center">
      <p className="text-[13px] text-[#D96B67] mb-3">{message || 'Failed to load data.'}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold text-white bg-[#4A9FF5] rounded-lg hover:bg-[#3b8de0] transition-colors"
      >
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- *
 * Default chart/table config when props are omitted
 * -------------------------------------------------------------------------- */

function defaultKpis() {
  return [
    { key: 'users', label: 'Users', tone: 'info', format: 'integer' },
    { key: 'agents', label: 'Agents', tone: 'success', format: 'integer' },
    { key: 'properties', label: 'Properties', tone: 'warning', format: 'integer' },
    { key: 'visits', label: 'Visits', tone: 'neutral', format: 'integer' },
  ];
}

/* -------------------------------------------------------------------------- *
 * Main component
 * -------------------------------------------------------------------------- */

/**
 * @typedef {import('./reports.types').ReportsProps} ReportsProps
 */

const Reports = ({
  title = 'Reports',
  subtitle,
  eyebrow,
  icon: Icon,
  fetchAnalytics,
  ranges = DEFAULT_RANGES,
  defaultRange = '30',
  scope = 'platform',
  kpis = defaultKpis(),
  charts = { registrations: true, checkins: true, perItem: true, categories: true },
  table,
  summary,
  labels = {},
  className = '',
}) => {
  const [range, setRange] = useState(defaultRange);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const rangeAsNumber = Number(range) || 30;

  useEffect(() => {
    const loader =
      typeof fetchAnalytics === 'function'
        ? fetchAnalytics
        : () => Promise.reject(new Error('fetchAnalytics is required.'));
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    loader({ range: rangeAsNumber })
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load analytics');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, reloadKey]);

  const chartLabels = {
    registrations: labels.registrations || 'Registrations',
    checkins: labels.checkins || 'Check-ins',
    items: labels.items || 'Items',
    categories: labels.categories || 'Categories',
  };

  const trendData = useMemo(() => {
    if (!data) return [];
    const maxLen = Math.max(data.registrationsTrend?.length || 0, data.checkinsTrend?.length || 0);
    const merged = [];
    for (let i = 0; i < maxLen; i += 1) {
      merged.push({
        date: data.registrationsTrend?.[i]?.date || data.checkinsTrend?.[i]?.date,
        [chartLabels.registrations]: data.registrationsTrend?.[i]?.count || 0,
        [chartLabels.checkins]: data.checkinsTrend?.[i]?.count || 0,
      });
    }
    return merged;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getKpiValue = (key) => {
    if (!data) return 0;
    return Number(data.kpis?.[key] ?? 0);
  };

  const tableConfig = table
    ? {
        enabled: table.enabled !== false,
        title: table.title || 'Breakdown',
        columns: table.columns || [
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
          { key: 'count', label: 'Count', accessor: (row) => Number(row.count) },
        ],
      }
    : null;

  /* ------- Loading state ------- */
  if (loading) {
    return (
      <div className={`space-y-5 font-sans ${className}`}>
        <div className="space-y-1">
          {eyebrow && <Skeleton className="h-3 w-24" />}
          <Skeleton className="h-6 w-56" />
          {subtitle && <Skeleton className="h-3 w-80" />}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[118px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  /* ------- Error state ------- */
  if (error) {
    return (
      <div className={`space-y-5 font-sans ${className}`}>
        <Header eyebrow={eyebrow} icon={Icon} title={title} subtitle={subtitle} />
        <div className="bg-white border border-[#E5E7EB] rounded-lg">
          <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        </div>
      </div>
    );
  }

  /* ------- Empty state ------- */
  if (!data) {
    return (
      <div className={`space-y-5 font-sans ${className}`}>
        <Header eyebrow={eyebrow} icon={Icon} title={title} subtitle={subtitle} />
        <div className="bg-white border border-[#E5E7EB] rounded-lg">
          <EmptyState message={labels.emptyState} />
        </div>
      </div>
    );
  }

  const showTrend = charts.registrations || charts.checkins;
  const items = Array.isArray(data.items) ? data.items : [];
  const showPerItem = charts.perItem && items.length > 0;
  const showCategories = charts.categories && data.categories && data.categories.length > 0;

  return (
    <div className={`space-y-5 font-sans ${className}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
              {eyebrow}
            </p>
          )}
          <div className="flex items-center gap-2.5">
            {Icon && (
              <span aria-hidden="true" className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0">
                <Icon size={20} />
              </span>
            )}
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">{title}</h1>
          </div>
          {subtitle && <p className="text-[13px] text-[#6B7280] mt-1">{subtitle}</p>}
          {summary && (
            <p className="text-[12px] text-[#9CA3AF] mt-1">
              {scope === 'self' ? 'Showing your activity. ' : 'Showing platform activity. '}
              {summary}
            </p>
          )}
        </div>
        <RangePicker ranges={ranges} value={range} onChange={setRange} />
      </div>

      {/* KPI cards */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.key}
              config={kpi}
              value={getKpiValue(kpi.key)}
              countUp={kpi.countUp !== false}
            />
          ))}
        </div>
      )}

      {/* Time-trend charts */}
      {showTrend && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {charts.registrations && (
            <ChartCard
              title={chartLabels.registrations}
              subtitle={`Last ${rangeAsNumber} days`}
              action={<RangePicker ranges={ranges} value={range} onChange={setRange} />}
            >
              {trendData.length === 0 ? (
                <EmptyState message={`No ${chartLabels.registrations.toLowerCase()} data yet`} />
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradRegistrations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4A9FF5" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#4A9FF5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} minTickGap={24} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} allowDecimals={false} width={34} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={chartLabels.registrations}
                      stroke="#4A9FF5"
                      strokeWidth={2}
                      fill="url(#gradRegistrations)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          )}

          {charts.checkins && (
            <ChartCard
              title={chartLabels.checkins}
              subtitle={`Last ${rangeAsNumber} days`}
              action={<RangePicker ranges={ranges} value={range} onChange={setRange} />}
            >
              {trendData.length === 0 ? (
                <EmptyState message={`No ${chartLabels.checkins.toLowerCase()} data yet`} />
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradCheckins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4FAF83" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#4FAF83" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} minTickGap={24} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} allowDecimals={false} width={34} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={chartLabels.checkins}
                      stroke="#4FAF83"
                      strokeWidth={2}
                      fill="url(#gradCheckins)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          )}
        </div>
      )}

      {/* Per-item bar chart + category donut */}
      {(showPerItem || showCategories) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {showCategories && (
            <ChartCard title={chartLabels.categories} subtitle="Distribution across categories">
              {data.categories.every((c) => c.count === 0) ? (
                <EmptyState message="No category data yet" />
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={data.categories}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={78}
                      paddingAngle={2}
                    >
                      {data.categories.map((entry, i) => (
                        <Cell key={entry.name || i} fill={DONUT_PALETTE[i % DONUT_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip formatter={(v) => formatNumber(v)} />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          )}

          {showPerItem && (
            <ChartCard title={chartLabels.items} subtitle="Count by item">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={items} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} allowDecimals={false} width={34} />
                  <Tooltip content={<ChartTooltip formatter={(v) => formatNumber(v)} />} cursor={{ fill: 'rgba(15,23,42,0.04)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {items.map((entry, i) => (
                      <Cell key={entry.id ?? i} fill={DONUT_PALETTE[i % DONUT_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}

      {/* Data table */}
      {tableConfig && tableConfig.enabled && (
        <ChartCard title={tableConfig.title}>
          {items.length === 0 ? (
            <EmptyState message="Nothing to show yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] text-[#111827]">
                <thead className="text-[#9CA3AF] font-semibold uppercase text-[10px] tracking-wider">
                  <tr className="border-b border-slate-100">
                    {tableConfig.columns.map((col) => (
                      <th key={col.key} className="py-2 px-2">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition">
                      {tableConfig.columns.map((col) => (
                        <td key={col.key} className="py-2.5 px-2 text-[#6B7280]">
                          {col.accessor ? col.accessor(row) : row[col.key] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>
      )}
    </div>
  );
};

function Header({ eyebrow, icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
            {eyebrow}
          </p>
        )}
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span aria-hidden="true" className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0">
              <Icon size={20} />
            </span>
          )}
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">{title}</h1>
        </div>
        {subtitle && <p className="text-[13px] text-[#6B7280] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default Reports;
