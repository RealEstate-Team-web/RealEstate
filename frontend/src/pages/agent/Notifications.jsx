import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  MessageSquare,
  CalendarCheck,
  CheckCheck,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { getAgentInquiries, markInquiryRead } from '../../services/inquiry.service';
import { getAgentVisitRequests } from '../../services/visit.service';
import { ROUTES } from '../../utils/constants';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'inquiry', label: 'Inquiries' },
  { key: 'visit', label: 'Visit Requests' },
];

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' · ' +
    date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const Notifications = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const requestIdRef = useRef(0);

  const loadNotifications = useCallback(async (mountedRef) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const [inquiryRes, visitRes] = await Promise.all([
        getAgentInquiries({ status: 'pending', page: 1, limit: 50 }),
        getAgentVisitRequests({ status: 'pending' }),
      ]);
      if (!mountedRef.current || requestIdRef.current !== requestId) return;

      const inquiryItems = (inquiryRes?.data || []).map((inquiry) => ({
        id: `inquiry-${inquiry.id}`,
        kind: 'inquiry',
        inquiryId: inquiry.id,
        unread: true,
        title: 'New Inquiry',
        description: `${[inquiry.buyerFirstName, inquiry.buyerLastName].filter(Boolean).join(' ') || 'A buyer'} asked about ${inquiry.propertyTitle || 'your property'}`,
        detail: inquiry.latestMessage || inquiry.message || '',
        createdAt: inquiry.createdAt,
      }));

      const visitItems = (visitRes?.data || []).map((visit) => ({
        id: `visit-${visit.id}`,
        kind: 'visit',
        visitId: visit.id,
        unread: true,
        title: 'New Visit Request',
        description: `${[visit.buyerFirstName, visit.buyerLastName].filter(Boolean).join(' ') || 'A buyer'} requested a visit for ${visit.propertyTitle || 'your property'}`,
        detail: visit.visitDate ? `${visit.visitDate}${visit.visitTime ? ` at ${visit.visitTime.slice(0, 5)}` : ''}` : '',
        createdAt: visit.createdAt || visit.created_at,
      }));

      const combined = [...inquiryItems, ...visitItems].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setItems(combined);
    } catch (err) {
      if (requestIdRef.current === requestId) {
        setError(err?.message || 'Failed to load notifications');
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const mountedRef = { current: true };
    (async () => {
      await loadNotifications(mountedRef);
    })();
    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, [loadNotifications]);

  const counts = useMemo(() => {
    const inquiry = items.filter((i) => i.kind === 'inquiry').length;
    const visit = items.filter((i) => i.kind === 'visit').length;
    return { all: items.length, inquiry, visit };
  }, [items]);

  const visibleItems = useMemo(() => {
    if (tab === 'all') return items;
    return items.filter((i) => i.kind === tab);
  }, [items, tab]);

  const handleMarkAllRead = async () => {
    const inquiryItems = items.filter((i) => i.kind === 'inquiry');
    if (inquiryItems.length === 0) return;
    setMarkingAll(true);
    try {
      await Promise.allSettled(inquiryItems.map((item) => markInquiryRead(item.inquiryId)));
      setItems((prev) => prev.filter((i) => i.kind === 'visit'));
    } finally {
      setMarkingAll(false);
    }
  };

  const handleOpenItem = (item) => {
    if (item.kind === 'inquiry') {
      navigate(ROUTES.agentMessages);
      markInquiryRead(item.inquiryId).catch(() => {});
    } else {
      navigate(ROUTES.agentVisits);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
          Notifications
        </p>
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0"
          >
            <Bell size={20} />
          </span>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Notifications</h1>
        </div>
        <p className="text-[13px] text-[#6B7280] mt-1">
          New inquiries and visit requests for your listings
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1">
          {TABS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setTab(option.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                tab === option.key
                  ? 'bg-white text-[#111827] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {option.label}
              {counts[option.key] > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#4A9FF5] text-white text-[10px] font-bold">
                  {counts[option.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {counts.inquiry > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center space-x-2 text-[#4A9FF5] hover:bg-blue-50 border border-[#4A9FF5] px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            <CheckCheck size={15} />
            <span>{markingAll ? 'Marking…' : 'Mark all read'}</span>
          </button>
        )}
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] px-4 py-2.5 rounded-xl">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 flex items-center justify-center">
          <p className="text-[13px] text-[#9CA3AF]">Loading notifications…</p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 flex flex-col items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Inbox size={24} />
          </span>
          <p className="text-[13px] text-[#9CA3AF]">
            {tab === 'all' ? 'You are all caught up' : `No ${TABS.find((t) => t.key === tab)?.label.toLowerCase()} notifications`}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visibleItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleOpenItem(item)}
                className="w-full text-left bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-start gap-3 hover:border-[#4A9FF5] hover:shadow-[0_2px_10px_rgba(74,159,245,0.12)] transition cursor-pointer"
              >
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.kind === 'inquiry'
                      ? 'bg-[#E7F0FB] text-[#4A9FF5]'
                      : 'bg-[#E6F4EC] text-[#2F7A55]'
                  }`}
                >
                  {item.kind === 'inquiry' ? (
                    <MessageSquare size={18} />
                  ) : (
                    <CalendarCheck size={18} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-center space-x-2 min-w-0">
                      <span className="text-[13px] font-bold text-slate-900 truncate">
                        {item.title}
                      </span>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#4A9FF5] shrink-0" aria-label="Unread" />
                      )}
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {formatTime(item.createdAt)}
                    </span>
                  </span>
                  <span className="block text-xs text-slate-600 mt-0.5">{item.description}</span>
                  {item.detail && (
                    <span className="block text-[11px] text-slate-400 mt-1 truncate">
                      {item.detail}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;