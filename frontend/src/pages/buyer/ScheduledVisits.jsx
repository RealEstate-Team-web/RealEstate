import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  XCircle,
  Clock,
  Building,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { getVisits, cancelVisit } from '../../services/visit.service';
import { BookVisitModal } from '../../components/buyer/BookVisitModal';
import { useToast } from '../../hooks/useToast';

export const ScheduledVisits = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('soonest');
  const [currentPage, setCurrentPage] = useState(1);
  const [rescheduleVisitTarget, setRescheduleVisitTarget] = useState(null);
  const [cancelConfirmTarget, setCancelConfirmTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const { toastMessage, showToast } = useToast();
  const itemsPerPage = 5;

  const loadVisits = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getVisits();
      setVisits(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load scheduled visits:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load visits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getVisits()
      .then((res) => {
        if (isMounted) {
          setVisits(Array.isArray(res?.data) ? res.data : []);
          setError('');
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load scheduled visits:', err);
          setError(err.response?.data?.message || err.message || 'Failed to load visits');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelConfirmTarget) return;
    const targetId = cancelConfirmTarget.id;
    setCancelling(true);

    // Optimistic UI update
    setVisits((prev) =>
      prev.map((v) => (v.id === targetId ? { ...v, status: 'cancelled' } : v))
    );

    try {
      await cancelVisit(targetId);
      showToast(`Visit for "${cancelConfirmTarget.propertyTitle}" cancelled`);
      setCancelConfirmTarget(null);
    } catch (err) {
      console.error('Failed to cancel visit:', err);
      showToast(err.response?.data?.message || 'Failed to cancel visit');
      loadVisits(); // revert on failure
    } finally {
      setCancelling(false);
    }
  };

  const handleRescheduleSuccess = (updatedVisit, message) => {
    showToast(message || 'Visit rescheduled successfully');
    setRescheduleVisitTarget(null);
    setVisits((prev) =>
      prev.map((v) => (v.id === updatedVisit.id ? { ...v, ...updatedVisit } : v))
    );
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          label: 'Approved',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      case 'pending':
      default:
        return {
          label: 'Pending Approval',
          className: 'bg-amber-100 text-amber-800 border-amber-200',
        };
    }
  };

  // Filter and sort visits
  const filteredVisits = useMemo(() => {
    let result = [...visits];

    if (statusFilter !== 'all') {
      result = result.filter((v) => (v.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.propertyTitle?.toLowerCase().includes(q) ||
          v.propertyCity?.toLowerCase().includes(q) ||
          v.propertyAddress?.toLowerCase().includes(q) ||
          v.agentFirstName?.toLowerCase().includes(q) ||
          v.agentLastName?.toLowerCase().includes(q) ||
          v.agencyName?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(`${a.visitDate}T${a.visitTime || '00:00'}:00`).getTime();
      const dateB = new Date(`${b.visitDate}T${b.visitTime || '00:00'}:00`).getTime();
      return sortBy === 'soonest' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [visits, statusFilter, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedVisits = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage;
    return filteredVisits.slice(start, start + itemsPerPage);
  }, [filteredVisits, validCurrentPage]);

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Scheduled Visits
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your scheduled in-person and virtual property tours
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/buyer/properties')}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Building size={15} />
          <span>Browse Properties</span>
        </button>
      </div>

      {/* Error Alert with Retry */}
      {error && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center space-x-2.5">
            <AlertCircle size={17} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadVisits}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition cursor-pointer text-xs"
          >
            <RefreshCw size={13} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Control & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by property, city, or agent..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-slate-800 focus:outline-none transition"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'approved', label: 'Approved' },
            { id: 'cancelled', label: 'Cancelled' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-slate-400 font-medium">Sort</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 transition"
          >
            <option value="soonest">Date: Soonest First</option>
            <option value="latest">Date: Latest First</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-slate-200 rounded-full" />
                  <div className="w-40 h-4 bg-slate-200 rounded" />
                  <div className="w-28 h-3 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="w-36 h-9 bg-slate-100 rounded-xl" />
              <div className="w-32 h-10 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredVisits.length === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No scheduled visits found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            {statusFilter !== 'all' || searchQuery
              ? 'No visits matched your selected filters. Try changing or resetting your search.'
              : "You haven't scheduled any property tours yet. Browse available listings and request a visit with the agent."}
          </p>
          <button
            type="button"
            onClick={() => navigate('/buyer/properties')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <span>Explore Properties</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Visits List */}
      {!loading && !error && filteredVisits.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
          {paginatedVisits.map((visit) => {
            const badge = getStatusBadge(visit.status);
            const isCancelled = visit.status?.toLowerCase() === 'cancelled';
            const isCompleted = visit.status?.toLowerCase() === 'completed';

            return (
              <div
                key={visit.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
              >
                {/* Property Info */}
                <div className="flex items-center space-x-4 min-w-0 md:max-w-[35%]">
                  <img
                    src={
                      visit.propertyImage ||
                      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400'
                    }
                    alt={visit.propertyTitle}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs border border-slate-100"
                  />
                  <div className="min-w-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 border ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {visit.propertyTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {visit.propertyCity ? `${visit.propertyCity}, ` : ''}
                      {visit.propertyAddress || 'Addis Ababa'}
                    </p>
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/70 shrink-0">
                  <Clock size={15} className="text-blue-600 shrink-0" />
                  <span>
                    {visit.visitDate} • {visit.visitTime || '10:00'}
                  </span>
                </div>

                {/* Agent Info */}
                <div className="flex items-center space-x-3 shrink-0">
                  <img
                    src={
                      visit.agentAvatar ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
                    }
                    alt={visit.agentFirstName || 'Agent'}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {visit.agentFirstName ? `${visit.agentFirstName} ${visit.agentLastName || ''}` : 'Property Agent'}
                    </p>
                    <span className="inline-block text-[11px] text-slate-400 font-medium">
                      {visit.agencyName || 'Listing Agent'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                  {!isCancelled && !isCompleted && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCancelConfirmTarget(visit)}
                        className="flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer"
                      >
                        <XCircle size={15} />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRescheduleVisitTarget(visit)}
                        className="flex items-center space-x-1 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition cursor-pointer"
                      >
                        <Calendar size={15} />
                        <span>Reschedule</span>
                      </button>
                    </>
                  )}
                  {isCancelled && (
                    <span className="text-xs font-medium text-slate-400 italic px-2">
                      Cancelled
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-xs font-medium text-emerald-600 px-2 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                validCurrentPage === page
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50">
                <XCircle size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Cancel Property Visit</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel your scheduled visit for{' '}
              <strong className="text-slate-800 font-semibold">
                "{cancelConfirmTarget.propertyTitle}"
              </strong>{' '}
              on {cancelConfirmTarget.visitDate} at {cancelConfirmTarget.visitTime}?
            </p>
            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCancelConfirmTarget(null)}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Keep Visit
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Visit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Visit Modal */}
      {rescheduleVisitTarget && (
        <BookVisitModal
          isOpen={Boolean(rescheduleVisitTarget)}
          onClose={() => setRescheduleVisitTarget(null)}
          visit={rescheduleVisitTarget}
          isReschedule={true}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </div>
  );
};

export default ScheduledVisits;
