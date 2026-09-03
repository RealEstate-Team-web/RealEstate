import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  ShieldCheck,
  Users as UsersIcon,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import KpiCard from '../../components/admin/KpiCard';
import {
  getAdminUsers,
  suspendUser,
  activateUser,
} from '../../services/user.service';

const PAGE_SIZE = 10;

const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const searchTerm = searchParams.get('q') || '';
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [refreshError, setRefreshError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const requestIdRef = useRef(0);

  const fetchUsers = async (pageNum) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminUsers({ page: pageNum, limit: PAGE_SIZE, q: searchTerm || undefined });
      if (requestId !== requestIdRef.current) return;
      setUsers(result.users || []);
      setPagination(result.pagination || null);
      setStats(result.stats || null);
      setPage(pageNum);
    } catch {
      if (requestId === requestIdRef.current) setError('Failed to load users');
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    (async () => {
      setLoading(true);
      try {
        const result = await getAdminUsers({ page: 1, limit: PAGE_SIZE, q: searchTerm || undefined });
        if (requestId !== requestIdRef.current) return;
        setUsers(result.users || []);
        setPagination(result.pagination || null);
        setStats(result.stats || null);
        setPage(1);
        setError(null);
      } catch {
        if (requestId === requestIdRef.current) setError('Failed to load users');
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    })();
  }, [searchTerm]);

  const reload = async () => {
    const requestId = ++requestIdRef.current;
    const termAtStart = searchTerm;
    const pageAtStart = page;
    const result = await getAdminUsers({ page: pageAtStart, limit: PAGE_SIZE, q: termAtStart || undefined });
    if (requestId !== requestIdRef.current) return;
    if (searchTerm !== termAtStart || page !== pageAtStart) return;
    setUsers(result.users || []);
    setPagination(result.pagination || null);
    setStats(result.stats || null);
  };

  const act = async (fn, id, name, msg) => {
    setActionId(id);
    setError(null);
    setSuccess(null);
    setRefreshError(null);
    try {
      await fn(id);
      setSuccess(`${name} ${msg}`);
      setConfirmId(null);
      try {
        await reload();
      } catch (err) {
        setRefreshError('Failed to refresh the user list');
      }
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const totalUsers = pagination ? pagination.total : users.length;
  const activeUsers = stats ? stats.active : 0;
  const suspendedUsers = stats ? stats.suspended : 0;
  const adminAccounts = stats ? stats.admins : 0;

  if (loading) {
    return <div className="py-20 text-center text-[#6B7280]">Loading users…</div>;
  }

  return (
    <div className="space-y-5 font-sans">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
            Management
          </p>
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0">
              <UsersIcon size={20} />
            </span>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
              User Management
            </h1>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-1">
            View, suspend, and activate platform accounts
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md bg-[#FBE9E8] text-[#B23B36] text-[13px] px-4 py-3"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md bg-[#E6F4EC] text-[#2F7A55] text-[13px] px-4 py-3"
        >
          {success}
        </div>
      )}
      {refreshError && (
        <div
          role="alert"
          className="rounded-md bg-[#FBF3DD] text-[#8a6d1f] text-[13px] px-4 py-3 flex items-center justify-between gap-3"
        >
          <span>{refreshError}</span>
            <button
              type="button"
              onClick={async () => {
                setRefreshing(true);
                try {
                  await reload();
                  setRefreshError(null);
                } catch (err) {
                  setRefreshError('Failed to refresh the user list');
                } finally {
                  setRefreshing(false);
                }
              }}
              disabled={actionId || refreshing}
              className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-md bg-white border border-[#e5d9a8] text-[12px] font-medium text-[#8a6d1f] hover:bg-[#fdf8ea] transition-colors disabled:opacity-50 whitespace-nowrap"
            >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Total Users" value={totalUsers} icon={UsersIcon} indicator="All accounts" />
        <KpiCard
          title="Active Users"
          value={activeUsers}
          icon={CheckCircle}
          iconBg="bg-[#E6F4EC] text-[#4FAF83]"
          indicator="Can log in"
        />
        <KpiCard
          title="Suspended Users"
          value={suspendedUsers}
          icon={Ban}
          iconBg="bg-[#FBE9E8] text-[#D96B67]"
          indicator="Access blocked"
        />
        <KpiCard
          title="Admin Accounts"
          value={adminAccounts}
          icon={ShieldCheck}
          iconBg="bg-[#E6F4EC] text-[#1D6FD3]"
          indicator="Privileged"
        />
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <h2 className="text-[17px] font-semibold text-[#111827]">
            All Users
          </h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  const val = e.target.value;
                  if (val) next.set('q', val);
                  else next.delete('q');
                  return next;
                }, { replace: true })
              }
              placeholder="Search users..."
              aria-label="Search users"
              className="w-full bg-[#F5F5FA] border border-[#E5E7EB] rounded-lg py-2 pl-9 pr-3 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#4A9FF5] focus:bg-white transition"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-[#111827] min-w-[820px]">
            <thead>
              <tr className="bg-[#F3F4F8] text-[#374151] font-medium text-[13px] h-[42px]">
                <th className="py-0 px-4 rounded-l-lg w-[5%]">No.</th>
                <th className="py-0 px-4 w-[22%]">Name</th>
                <th className="py-0 px-4 w-[26%]">Email</th>
                <th className="py-0 px-4 w-[16%]">Phone</th>
                <th className="py-0 px-4 w-[12%]">Role</th>
                <th className="py-0 px-4 w-[12%]">Status</th>
                <th className="py-0 px-4 w-[12%] rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[13px] text-[#6B7280]">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isActive = u.status === 'active';
                  const isHighlighted = highlightId && String(u.id) === String(highlightId);
                  const name = `${u.firstName} ${u.lastName}`.trim() || u.email;
                  const number = pagination
                    ? (pagination.page - 1) * pagination.limit + users.indexOf(u) + 1
                    : users.indexOf(u) + 1;
                  return (
                    <tr
                      key={u.id}
                      className={`h-[50px] hover:bg-[#F9FAFB] transition-colors ${isHighlighted ? 'bg-[#E7F0FB]/60' : ''}`}
                    >
                      <td className="py-0 px-4 text-[#374151] whitespace-nowrap">{number}</td>
                      <td className="py-0 px-4 font-medium truncate">{name}</td>
                      <td className="py-0 px-4 text-[#374151] truncate">{u.email}</td>
                      <td className="py-0 px-4 text-[#374151] whitespace-nowrap">
                        {u.phone || '—'}
                      </td>
                      <td className="py-0 px-4 capitalize text-[#374151]">{u.role}</td>
                      <td className="py-0 px-4">
                        <StatusBadge status={u.status}>{u.status}</StatusBadge>
                      </td>
                      <td className="py-0 px-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          {confirmId === u.id ? (
                            <>
                              <span className="text-[12px] text-[#B23B36]">
                                {isActive ? 'Suspend?' : 'Activate?'}
                              </span>
                              <button
                                type="button"
                                disabled={actionId === u.id || refreshing}
                                onClick={() =>
                                  act(
                                    isActive ? suspendUser : activateUser,
                                    u.id,
                                    name,
                                    isActive ? 'suspended' : 'activated'
                                  )
                                }
                                className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md bg-[#FBE9E8] border border-[#f0cfce] text-[12px] font-medium text-[#B23B36] hover:bg-[#f6dcd9] transition-colors disabled:opacity-50"
                              >
                                {actionId === u.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : null}
                                Yes
                              </button>
                              <button
                                type="button"
                                disabled={actionId === u.id || refreshing}
                                onClick={() => setConfirmId(null)}
                                className="h-[30px] px-2.5 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[12px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
                              >
                                No
                              </button>
                            </>
                          ) : u.role === 'admin' && isActive ? null : (
                            <button
                              type="button"
                              disabled={actionId === u.id || refreshing}
                              onClick={() => setConfirmId(u.id)}
                              className="inline-flex items-center gap-1.5 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#B23B36] hover:bg-[#fbe9e8] transition-colors disabled:opacity-50"
                            >
                              {isActive ? (
                                <>
                                  <Ban size={15} />
                                  Suspend
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={15} />
                                  Activate
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination && (pagination.totalPages > 1 || pagination.hasNextPage || pagination.hasPrevPage) && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB] text-[13px] text-[#374151]">
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!pagination.hasPrevPage || actionId || refreshing}
                onClick={() => { setConfirmId(null); fetchUsers(pagination.page - 1); }}
                className="inline-flex items-center gap-1 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
              >
                <ChevronLeft size={15} />
                Previous
              </button>
              <button
                type="button"
                disabled={!pagination.hasNextPage || actionId || refreshing}
                onClick={() => { setConfirmId(null); fetchUsers(pagination.page + 1); }}
                className="inline-flex items-center gap-1 h-[32px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
