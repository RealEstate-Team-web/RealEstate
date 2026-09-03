import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, UserCheck, Ban, CheckCircle, XCircle, Loader2, Search, ShieldCheck } from 'lucide-react';
import KpiCard from '../../components/admin/KpiCard';
import Avatar from '../../components/common/Avatar';
import StatusBadge from '../../components/common/StatusBadge';
import {
  getDashboardStats,
  getAgents,
  approveAgent,
  rejectAgent,
} from '../../services/admin.service';

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/ /g, '-');
};

const AgentApproval = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const searchTerm = searchParams.get('q') || '';
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const term = searchTerm.trim();
        const [s, a] = await Promise.all([
          getDashboardStats(),
          getAgents({ status: term ? undefined : 'pending', q: term || undefined }),
        ]);
        if (!active) return;
        setStats(s);
        setAgents(a);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load agents');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [searchTerm]);

  const reload = async () => {
    const term = searchTerm.trim();
    const [s, a] = await Promise.all([
      getDashboardStats(),
      getAgents({ status: term ? undefined : 'pending', q: term || undefined }),
    ]);
    setStats(s);
    setAgents(a);
  };

  const act = async (fn, id, label, successMsg) => {
    setActionId(id);
    setError(null);
    setSuccess(null);
    try {
      await fn(id);
      setSuccess(`${label} ${successMsg}`);
      await reload();
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const kpis = stats
    ? [
        {
          title: 'Total Pending Agents',
          value: stats.pendingAgents,
          icon: Clock,
          iconBg: 'bg-[#FBF3DD] text-[#E7B85A]',
        },
        {
          title: 'Total Approved Agents',
          value: stats.approvedAgents,
          icon: UserCheck,
          iconBg: 'bg-[#E7F4EE] text-[#4FAF83]',
        },
        {
          title: 'Total Rejected Agents',
          value: stats.rejectedAgents,
          icon: XCircle,
          iconBg: 'bg-[#FBEAE9] text-[#D96B67]',
        },
        {
          title: 'Total Suspended Users',
          value: stats.suspendedUsers,
          icon: Ban,
          iconBg: 'bg-[#FBEAE9] text-[#D96B67]',
        },
      ]
    : [];

  if (loading) {
    return <div className="py-20 text-center text-[#6B7280]">Loading agent approvals…</div>;
  }

  return (
    <div className="space-y-5 font-sans">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
            Approvals
          </p>
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </span>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
              Agent Approval Dashboard
            </h1>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Review, approve, or reject agent verification requests
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-[#FBE9E8] text-[#B23B36] text-[13px] px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-[#E6F4EC] text-[#2F7A55] text-[13px] px-4 py-3">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KpiCard
            key={k.title}
            title={k.title}
            value={k.value}
            icon={k.icon}
            iconBg={k.iconBg}
          />
        ))}
      </div>

      {/* Agent list */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <h2 className="text-[17px] font-semibold text-[#111827]">
            {searchTerm.trim() ? 'Agent Search Results' : 'Pending Verification Requests'}
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
              placeholder="Search agents..."
              aria-label="Search agents"
              className="w-full bg-[#F5F5FA] border border-[#E5E7EB] rounded-lg py-2 pl-9 pr-3 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#4A9FF5] focus:bg-white transition"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-[#111827] min-w-[920px]">
            <thead>
              <tr className="bg-[#F3F4F8] text-[#374151] font-medium text-[13px] h-[42px]">
                <th className="py-0 px-4 rounded-l-lg w-[18%]">Applicant Name</th>
                <th className="py-0 px-4 w-[18%]">Agency Name</th>
                <th className="py-0 px-4 w-[15%]">Registration Date</th>
                <th className="py-0 px-4 w-[18%]">License</th>
                <th className="py-0 px-4 w-[10%]">Status</th>
                <th className="py-0 px-4 w-[21%] rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[13px] text-[#6B7280]">
                    {searchTerm.trim() ? 'No agents match your search.' : 'No pending verification requests.'}
                  </td>
                </tr>
              ) : (
                 agents.map((a) => {
                   const isHighlighted = highlightId && String(a.userId) === String(highlightId);
                   return (
                    <tr key={a.id} className={`h-[50px] hover:bg-[#F9FAFB] transition-colors ${isHighlighted ? 'bg-[#E7F0FB]/60' : ''}`}>
                      <td className="py-0 px-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar
                            size={32}
                            src={a.profile_image_url || undefined}
                            alt={`${a.first_name} ${a.last_name}`}
                          />
                          <span className="font-medium truncate text-[#111827]">
                            {a.first_name} {a.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-0 px-4 text-[#374151] truncate">{a.agency || '—'}</td>
                      <td className="py-0 px-4 text-[#374151] whitespace-nowrap">
                        {formatDate(a.created_at)}
                      </td>
                      <td className="py-0 px-4">
                        {a.licenseNumber ? (
                          <span className="text-[#374151] text-[13px] font-medium whitespace-nowrap">
                            {a.licenseNumber}
                          </span>
                        ) : (
                          <span className="text-[#9CA3AF]">—</span>
                        )}
                      </td>
                      <td className="py-0 px-4">
                        <StatusBadge status={a.status}>{a.status}</StatusBadge>
                      </td>
                       <td className="py-0 px-4">
                         {a.status === 'pending' && actionId === a.id ? (
                           <div className="flex items-center gap-2 whitespace-nowrap">
                             <Loader2 size={17} className="animate-spin text-[#4FAF83]" />
                             <span className="text-[12px] text-[#6B7280]">Updating…</span>
                           </div>
                         ) : confirmAction?.id === a.id ? (
                           <div className="flex items-center gap-2 whitespace-nowrap">
                             <span className="text-[12px] font-medium text-[#374151]">
                               {confirmAction.action === 'approve' ? 'Approve?' : 'Reject?'}
                             </span>
                             <button
                               type="button"
                               disabled={actionId === a.id}
                               onClick={() => {
                                 const action = confirmAction.action;
                                 setConfirmAction(null);
                                 if (action === 'approve') act(approveAgent, a.id, a.first_name, 'approved');
                                 else act(rejectAgent, a.id, a.first_name, 'rejected');
                               }}
                               className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-md bg-[#2F7A55] text-[12px] font-medium text-white hover:bg-[#256b49] transition-colors disabled:opacity-50"
                             >
                               Yes
                             </button>
                             <button
                               type="button"
                               disabled={actionId === a.id}
                               onClick={() => setConfirmAction(null)}
                               className="h-[30px] px-3 rounded-md bg-[#edf2fa] border border-[#d6deeb] text-[12px] font-medium text-[#374151] hover:bg-[#F3F4F8] transition-colors disabled:opacity-50"
                             >
                               No
                             </button>
                           </div>
                         ) : a.status === 'pending' ? (
                         <div className="flex items-center gap-2 whitespace-nowrap">
                           <button
                             type="button"
                             disabled={actionId === a.id}
onClick={() => setConfirmAction({ id: a.id, action: 'approve' })}
                               className="inline-flex items-center gap-1.5 h-[34px] px-[10px] rounded-md bg-[#E7F4EE] text-[13px] font-medium text-[#2F7A55] hover:bg-[#d3efe1] transition-colors disabled:opacity-50"
                             >
                             <CheckCircle size={19} className="text-[#2F7A55]" />
                             Approve Account
                          </button>
                          <button
                            type="button"
                            disabled={actionId === a.id}
                            onClick={() => setConfirmAction({ id: a.id, action: 'reject' })}
                            className="inline-flex items-center gap-1.5 h-[34px] px-[10px] rounded-md bg-[#FBEAE9] text-[13px] font-medium text-[#B23B36] hover:bg-[#f5d8d6] transition-colors disabled:opacity-50"
                          >
                            <XCircle size={19} className="text-[#B23B36]" />
                            Reject Account
                          </button>
                        </div>
                         ) : (
                           <span className="text-[#9CA3AF]">—</span>
                         )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.06)] p-4 flex flex-col">
          <h2 className="text-[17px] font-semibold text-[#111827] mb-2">Recent Activity Log</h2>
          <div className="flex-1 max-h-[260px] overflow-y-auto scrollbar-thin">
            {!stats || stats.recentAgents.length === 0 ? (
              <p className="text-[13px] text-[#6B7280] py-6 text-center">
                No recent activity.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.recentAgents.map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Avatar
                        size={30}
                        src={r.profile_image_url || undefined}
                        alt={`${r.first_name} ${r.last_name}`}
                      />
                      <span className="text-[13px] font-semibold text-[#111827] truncate">
                        {r.first_name} {r.last_name}
                      </span>
                    </div>
                    <StatusBadge status={r.status}>{r.status}</StatusBadge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentApproval;
