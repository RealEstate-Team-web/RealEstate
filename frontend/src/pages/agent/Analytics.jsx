import { useEffect, useMemo, useRef, useState } from "react";
import {
  RefreshCw,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Filter,
  Inbox,
  Star,
  TrendingUp,
} from "lucide-react";
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
  Legend,
} from "recharts";
import { getAgentAnalytics } from "../../services/agent.service";

const BLUE = "#4A9FF5";
const GREEN = "#4FAF83";
const YELLOW = "#E7B85A";
const RED = "#D96B67";
const SLATE = "#9CA3AF";
const DONUT_PALETTE = [BLUE, GREEN, YELLOW, RED, "#8B5CF6", "#14B8A6"];

const numberFormat = (n) => {
  const value = Number(n);
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat().format(value);
};

const STATUS_BADGES = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  sold: "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
  rented: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
  draft: "bg-slate-100 text-slate-600 border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

const STATUS_ORDER = ["available", "sold", "rented", "draft"];

const CARD_TITLE_CLASS = "text-[15px] font-semibold text-[#111827] dark:text-white";
const CARD_SUBTITLE_CLASS = "text-[12px] text-[#6B7280] mt-0.5 dark:text-slate-400";
const chartCardClass =
  "bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.06)] p-5 dark:bg-[#111827] dark:border-slate-800";

const SummaryPill = ({ value, trendLabel = "" }) => (
  <div className="flex flex-col items-end gap-1">
    <p className="text-[26px] font-bold text-[#111827] leading-none dark:text-white">
      {numberFormat(value)}
    </p>
    {trendLabel && (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#4FAF83]">
        <TrendingUp size={13} /> {trendLabel}
      </span>
    )}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3 dark:bg-slate-800 dark:text-slate-500">
      <Inbox size={22} />
    </div>
    <p className="text-[13px] text-slate-500 dark:text-slate-400">{message}</p>
  </div>
);

const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#111827] text-white text-[12px] rounded-lg px-3 py-2 shadow-lg pointer-events-none">
      {label && <p className="mb-1 opacity-80">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color || entry.fill }}
          />
          {entry.name}:{" "}
          <span className="font-semibold">
            {formatter ? formatter(entry.value) : numberFormat(entry.value)}
          </span>
        </p>
      ))}
    </div>
  );
};

const ProgressRing = ({ value, total }) => {
  const size = 150;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  const filled = (pct / 100) * circ;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EEF2F6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={GREEN}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ - filled}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[30px] font-bold text-[#111827] leading-none dark:text-white">
          {numberFormat(value)}
        </span>
        <span className="text-[11px] text-[#6B7280] mt-1 dark:text-slate-400">
          {pct}% of {numberFormat(total)}
        </span>
      </div>
    </div>
  );
};

const CompletedVisitsGauge = ({ gauge }) => {
  const { completed = 0, scheduled = 0, rate = 0 } = gauge || {};
  const width = 220;
  const height = 128;
  const stroke = 18;
  const cx = width / 2;
  const cy = height;
  const radius = 88;
  const arcLength = Math.PI * radius;
  const filledLength = (Math.min(100, rate) / 100) * arcLength;

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#EEF2F6"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={BLUE}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filledLength} ${arcLength}`}
        />
      </svg>
      <div className="-mt-7 text-center">
        <p className="text-[32px] font-bold text-[#111827] leading-none dark:text-white">
          {rate}%
        </p>
        <p className="text-[11px] text-[#6B7280] mt-1 dark:text-slate-400">completion rate</p>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-5 text-center">
        <div>
          <p className="text-[18px] font-bold text-[#111827] leading-none dark:text-white">
            {numberFormat(completed)}
          </p>
          <p className="text-[11px] text-[#6B7280] mt-0.5 dark:text-slate-400">Completed</p>
        </div>
        <div>
          <p className="text-[18px] font-bold text-[#111827] leading-none dark:text-white">
            {numberFormat(scheduled)}
          </p>
          <p className="text-[11px] text-[#6B7280] mt-0.5 dark:text-slate-400">Scheduled</p>
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ score }) => {
  const rounded = Math.max(0, Math.min(5, Math.round(Number(score) || 0)));
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rounded} out of 5`}
      title={`${rounded} / 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < rounded
              ? "text-[#E7B85A] fill-[#E7B85A]"
              : "text-slate-200 fill-slate-200"
          }
        />
      ))}
    </span>
  );
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [sortKey, setSortKey] = useState("views");
  const [sortDir, setSortDir] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const payload = await getAgentAnalytics();
        if (active) setData(payload);
      } catch (err) {
        if (active) setError(err.message || "Failed to load analytics");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (!filterOpen) return undefined;
    const onClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [filterOpen]);

  const kpis = useMemo(() => data?.kpis || {}, [data]);
  const topProperties = useMemo(
    () => (Array.isArray(data?.topProperties) ? data.topProperties : []),
    [data]
  );
  const engagementTrend = useMemo(
    () => (Array.isArray(data?.engagementTrend) ? data.engagementTrend : []),
    [data]
  );
  const inquiryStatus = useMemo(() => data?.inquiryByStatus || {}, [data]);
  const visitsGauge = useMemo(() => data?.visitsGauge || {}, [data]);

  const statusSegments = useMemo(() => {
    const segments = [
      { name: "Pending", value: Number(inquiryStatus.pending) || 0 },
      { name: "Read", value: Number(inquiryStatus.read) || 0 },
      { name: "Responded", value: Number(inquiryStatus.responded) || 0 },
      { name: "Archived", value: Number(inquiryStatus.archived) || 0 },
    ];
    return segments.filter((s) => s.value > 0);
  }, [inquiryStatus]);

  const respondedInquiries = Number(inquiryStatus.responded) || 0;
  const totalInquiries = Number(kpis.totalInquiries) || 0;

  const favoritesTrendData = useMemo(() => {
    const ft = data?.favoritesTrend || {};
    const labels = ft.labels || [];
    const current = ft.current || [];
    const previous = ft.previous || [];
    return labels.map((label, i) => ({
      label,
      "This week": current[i] || 0,
      "Last week": previous[i] || 0,
    }));
  }, [data]);

  const hasFavorites = useMemo(
    () => favoritesTrendData.some((d) => d["This week"] > 0 || d["Last week"] > 0),
    [favoritesTrendData]
  );

  const hasEngagement = useMemo(
    () => engagementTrend.some((d) => d.favorites > 0 || d.inquiries > 0),
    [engagementTrend]
  );

  const sortedProperties = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? [...topProperties]
        : topProperties.filter((p) => p.status === statusFilter);

    const maxSource =
      filtered.length === 0
        ? 1
        : Math.max(
            1,
            ...filtered.map(
              (p) =>
                Number(p.views) +
                Number(p.favorites) * 3 +
                Number(p.inquiries) * 2
            )
          );

    const withScore = filtered.map((p) => {
      const source =
        Number(p.views) + Number(p.favorites) * 3 + Number(p.inquiries) * 2;
      return {
        ...p,
        score:
          maxSource > 0 ? Math.round(1 + 4 * (source / maxSource)) : 0,
      };
    });

    const keyMap = {
      title: (p) => String(p.title).toLowerCase(),
      views: (p) => Number(p.views),
      favorites: (p) => Number(p.favorites),
      inquiries: (p) => Number(p.inquiries),
      status: (p) => {
        const idx = STATUS_ORDER.indexOf(p.status);
        return idx === -1 ? 99 : idx;
      },
      score: (p) => Number(p.score),
    };
    const getter = keyMap[sortKey] || keyMap.title;

    withScore.sort((a, b) => {
      const av = getter(a);
      const bv = getter(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return withScore;
  }, [topProperties, statusFilter, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "title" || key === "status" ? "asc" : "desc");
    }
  };

  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey) return <ArrowUpDown size={12} className="text-slate-400 dark:text-slate-500" />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="text-[#4A9FF5]" />
    ) : (
      <ArrowDown size={12} className="text-[#4A9FF5]" />
    );
  };

  const renderSortableTh = (colKey, label, alignClass = "") => {
    const isActive = sortKey === colKey;
    const sortLabel = isActive
      ? `${label}, sorted ${sortDir === "asc" ? "ascending" : "descending"}`
      : `${label}, unsorted`;
    return (
      <th
        className={`px-4 py-3 font-semibold ${alignClass}`}
        aria-sort={isActive ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
      >
        <button
          type="button"
          onClick={() => toggleSort(colKey)}
          aria-label={sortLabel}
          className="inline-flex items-center gap-1 uppercase tracking-wider text-[11px] text-slate-500 hover:text-[#111827] transition cursor-pointer dark:text-slate-400 dark:hover:text-white"
        >
          {label} <SortIcon colKey={colKey} />
        </button>
      </th>
    );
  };

  const availableStatuses = useMemo(
    () => Array.from(new Set(topProperties.map((p) => p.status))),
    [topProperties]
  );

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
            Insights
          </p>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Favorites, inquiries, and visits across your listings
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-60 dark:bg-[#111827] dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/60"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] px-4 py-2.5 rounded-xl dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading && !data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className={`${chartCardClass} lg:col-span-2`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className={CARD_TITLE_CLASS}>Engagement Trend</h3>
                  <p className={CARD_SUBTITLE_CLASS}>
                    Favorites and inquiries per day · last 30 days
                  </p>
                </div>
                <SummaryPill
                  value={Number(kpis.favoritesCount) || 0}
                  trendLabel="favorites"
                />
              </div>
              {!hasEngagement ? (
                <EmptyState message="No engagement activity yet" />
              ) : (
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart
                      data={engagementTrend}
                      margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="gradFavorites" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BLUE} stopOpacity={0.32} />
                          <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradInquiries" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={GREEN} stopOpacity={0.28} />
                          <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F4" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: SLATE }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={36}
                        tickFormatter={(d) => d.slice(5)}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: SLATE }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        width={34}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="favorites"
                        name="Favorites"
                        stroke={BLUE}
                        strokeWidth={2.5}
                        fill="url(#gradFavorites)"
                        dot={{ r: 2.5, strokeWidth: 1.5, stroke: "#fff", fill: BLUE }}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="inquiries"
                        name="Inquiries"
                        stroke={GREEN}
                        strokeWidth={2.5}
                        fill="url(#gradInquiries)"
                        dot={{ r: 2.5, strokeWidth: 1.5, stroke: "#fff", fill: GREEN }}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-2">
                    {[
                      { label: "Favorites", color: BLUE },
                      { label: "Inquiries", color: GREEN },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-[11px] text-[#6B7280] dark:text-slate-400">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`${chartCardClass} lg:col-span-1`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className={CARD_TITLE_CLASS}>Favorites Count</h3>
                  <p className={CARD_SUBTITLE_CLASS}>This week vs last week</p>
                </div>
                <SummaryPill value={Number(kpis.favoritesCount) || 0} />
              </div>
              {!hasFavorites ? (
                <EmptyState message="No favorites yet" />
              ) : (
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={favoritesTrendData}
                      margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                      barGap={3}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F4" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: SLATE }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={8}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: SLATE }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        width={30}
                      />
                      <Tooltip
                        content={<ChartTooltip />}
                        cursor={{ fill: "rgba(15,23,42,0.04)" }}
                      />
                      <Bar dataKey="This week" fill={BLUE} radius={[6, 6, 0, 0]} maxBarSize={18} />
                      <Bar dataKey="Last week" fill={GREEN} radius={[6, 6, 0, 0]} maxBarSize={18} />
                      <Legend
                        wrapperStyle={{ fontSize: 11, color: "#6B7280" }}
                        iconType="circle"
                        iconSize={8}
                        align="center"
                        verticalAlign="bottom"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className={`${chartCardClass} flex flex-col`}>
              <h3 className={CARD_TITLE_CLASS}>Inquiry Status</h3>
              <p className={CARD_SUBTITLE_CLASS}>Distribution of your inquiries</p>
              {statusSegments.length === 0 ? (
                <div className="flex-1 flex items-center">
                  <EmptyState message="No inquiries yet" />
                </div>
              ) : (
                <div className="mt-4 flex-1">
                  <ResponsiveContainer width="100%" height={190}>
                    <PieChart>
                      <Pie
                        data={statusSegments}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={44}
                        outerRadius={70}
                        paddingAngle={2}
                      >
                        {statusSegments.map((entry, i) => (
                          <Cell key={entry.name} fill={DONUT_PALETTE[i % DONUT_PALETTE.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {statusSegments.map((entry, i) => (
                      <div key={entry.name} className="flex items-center justify-between text-[12px]">
                        <span className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: DONUT_PALETTE[i % DONUT_PALETTE.length] }}
                          />
                          <span className="text-[#6B7280] truncate dark:text-slate-400">{entry.name}</span>
                        </span>
                        <span className="font-semibold text-[#111827] dark:text-white">
                          {numberFormat(entry.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`${chartCardClass} flex flex-col items-center`}>
              <div className="self-start">
                <h3 className={CARD_TITLE_CLASS}>Inquiries</h3>
                <p className={CARD_SUBTITLE_CLASS}>Responded share</p>
              </div>
              <div className="mt-6 flex-1 flex flex-col justify-center">
                <div className="flex flex-col items-center gap-2">
                  <ProgressRing value={respondedInquiries} total={totalInquiries} />
                  <p className="text-[12px] font-medium text-[#6B7280] dark:text-slate-400">
                    responded of total inquiries
                  </p>
                </div>
              </div>
            </div>

            <div className={`${chartCardClass} flex flex-col items-center`}>
              <div className="self-start">
                <h3 className={CARD_TITLE_CLASS}>Completed Visits</h3>
                <p className={CARD_SUBTITLE_CLASS}>Visit completion performance</p>
              </div>
              <div className="mt-2 flex-1 flex flex-col justify-center">
                <CompletedVisitsGauge gauge={visitsGauge} />
              </div>
            </div>
          </div>

          <div className={`${chartCardClass} p-0 overflow-hidden`}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between dark:border-slate-800">
              <div>
                <h3 className={CARD_TITLE_CLASS}>Top Performing Properties</h3>
                <p className="text-[12px] text-[#6B7280] mt-0.5">
                  Listings ranked by performance
                </p>
              </div>
              <div className="relative" ref={filterRef}>
                <button
                  type="button"
                  onClick={() => setFilterOpen((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition cursor-pointer ${
                    statusFilter === "all"
                      ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-[#111827] dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
                      : "bg-[#E7F0FB] border-[#4A9FF5]/40 text-[#1D6FD3] dark:bg-blue-500/10 dark:text-blue-300"
                  }`}
                >
                  <Filter size={13} />
                  {statusFilter === "all" ? "Status" : statusFilter}
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10 dark:bg-[#111827] dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setStatusFilter("all");
                        setFilterOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[12px] text-slate-700 hover:bg-slate-50 cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800/60"
                    >
                      All statuses
                    </button>
                    {availableStatuses.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setStatusFilter(s);
                          setFilterOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[12px] text-slate-700 capitalize hover:bg-slate-50 cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {topProperties.length === 0 ? (
              <div className="py-14 text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto dark:bg-slate-800 dark:text-slate-500">
                  <Building2 size={26} />
                </div>
                <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-200">
                  No properties yet
                </p>
                <p className="text-[12px] text-slate-500 max-w-sm mx-auto dark:text-slate-400">
                  Once you list a property, you'll see its performance here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/50 dark:bg-[#1E293B] dark:text-slate-400">
                      {renderSortableTh("title", "Property")}
                      {renderSortableTh("views", "Total Views", "text-right")}
                      {renderSortableTh("favorites", "Favorites", "text-right")}
                      {renderSortableTh("inquiries", "Inquiries", "text-right")}
                      {renderSortableTh("status", "Status")}
                      {renderSortableTh("score", "Performance Score", "text-right")}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProperties.map((p) => {
                      const badge = STATUS_BADGES[p.status] || STATUS_BADGES.draft;
                      return (
                        <tr
                          key={p.id}
                          className="border-t border-slate-100 hover:bg-slate-50/50 transition dark:border-slate-800 dark:hover:bg-slate-800/60"
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 dark:bg-slate-800">
                                {p.coverImage ? (
                                  <img
                                    src={p.coverImage}
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                    <Building2 size={16} />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate max-w-[220px] dark:text-white">
                                  {p.title}
                                </p>
                                <p className="text-[11px] text-slate-500 capitalize dark:text-slate-400">
                                  {p.listingType}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">
                            {numberFormat(p.views)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">
                            {numberFormat(p.favorites)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-200">
                            {numberFormat(p.inquiries)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full border text-[11px] font-bold capitalize ${badge}`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <StarRating score={p.score} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
