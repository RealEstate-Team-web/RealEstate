import { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  RefreshCw,
  Edit2,
  Trash2,
} from 'lucide-react';
import { getVisits, cancelVisit } from '../../services/visit.service';
import BookVisitModal from '../../components/buyer/BookVisitModal';
import useToast from '../../hooks/useToast';

export const ScheduledVisits = () => {
  const [visits, setVisits] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
  });
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
  const itemsPerPage = 6;

  const loadVisits = useCallback(
    async (isMountedRef = { current: true }) => {
      try {
        setLoading(true);
        setError('');
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          status: statusFilter,
          search: searchQuery.trim(),
          sort: sortBy,
        };
        const response = await getVisits(params);
        if (!isMountedRef.current) return;

        setVisits(Array.isArray(response?.data) ? response.data : []);
        if (response?.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error('Failed to load scheduled visits:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load visits');
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [currentPage, statusFilter, searchQuery, sortBy, itemsPerPage]
  );

  useEffect(() => {
    const mountedRef = { current: true };
    loadVisits(mountedRef);
    return () => {
      mountedRef.current = false;
    };
  }, [loadVisits]);

  useEffect(() => {
    if (!cancelConfirmTarget) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !cancelling) {
        setCancelConfirmTarget(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancelConfirmTarget, cancelling]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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

  const totalPages = pagination.totalPages || 1;

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
          <p className="text-xs text-slate-500 mt-1">
            Track and manage your upcoming and past property viewings
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadVisits()}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Controls & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleStatusFilterChange(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by property, city, or agent name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 shrink-0">
              <ArrowUpDown size={14} />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition cursor-pointer"
            >
              <option value="soonest">Date: Soonest First</option>
              <option value="latest">Date: Furthest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 bg-slate-200 rounded w-20" />
                <div className="h-8 bg-slate-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900">Failed to Load Visits</h3>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => loadVisits()}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer shadow-xs"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && visits.length === 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Calendar size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No scheduled visits found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'No visits matched your selected filters or search query.'
                : "You haven't scheduled any property tours yet. Browse available listings and schedule your first visit!"}
            </p>
          </div>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Visits Cards Grid */}
      {!loading && !error && visits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visits.map((v) => {
            const badge = getStatusBadge(v.status);
            const isCancelled = (v.status || '').toLowerCase() === 'cancelled';
            const isCompleted = (v.status || '').toLowerCase() === 'completed';
            const isPendingOrApproved = !isCancelled && !isCompleted;

            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Card Header with Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      ID: #{v.id}
                    </span>
                  </div>

                  {/* Property Info Row */}
                  <div className="flex items-center space-x-3.5">
                    {v.propertyImage ? (
                      <img
                        src={v.propertyImage}
                        alt={v.propertyTitle}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                        <MapPin size={20} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {v.propertyTitle}
                      </h3>
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">
                          {v.propertyAddress ? `${v.propertyAddress}, ` : ''}
                          {v.propertyCity}
                        </span>
                      </p>
                      {v.propertyPrice && (
                        <p className="text-xs font-bold text-blue-600 mt-1">
                          ${Number(v.propertyPrice).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date & Time Slot Box */}
                  <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Calendar size={15} className="text-blue-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">Date</p>
                        <p className="font-semibold text-slate-800">{v.visitDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Clock size={15} className="text-blue-600 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">Time</p>
                        <p className="font-semibold text-slate-800">{v.visitTime?.slice(0, 5)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Agent Details */}
                  {(v.agentFirstName || v.agentLastName) && (
                    <div className="flex items-center space-x-2.5 pt-1 text-xs">
                      {v.agentAvatar ? (
                        <img
                          src={v.agentAvatar}
                          alt={`${v.agentFirstName} ${v.agentLastName}`}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {v.agentFirstName?.[0] || 'A'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {v.agentFirstName} {v.agentLastName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {v.agencyName || 'Listing Agent'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notes Preview if available */}
                  {v.notes && (
                    <div className="bg-amber-50/60 border border-amber-100 rounded-lg p-2.5 text-[11px] text-amber-900 leading-snug">
                      <span className="font-semibold text-amber-800">Note: </span>
                      {v.notes}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                  {isPendingOrApproved && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCancelConfirmTarget(v)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer flex items-center space-x-1"
                      >
                        <Trash2 size={13} />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRescheduleVisitTarget(v)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer flex items-center space-x-1"
                      >
                        <Edit2 size={13} />
                        <span>Reschedule</span>
                      </button>
                    </>
                  )}

                  {isCancelled && (
                    <span className="text-xs font-medium text-slate-400 px-2">
                      Visit Cancelled
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
                currentPage === page
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
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-visit-title"
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50">
                <XCircle size={22} />
              </div>
              <h3 id="cancel-visit-title" className="text-base font-bold text-slate-900">
                Cancel Property Visit
              </h3>
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
