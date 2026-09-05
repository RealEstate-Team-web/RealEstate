import { Link } from 'react-router-dom';
import {
  UserCircle,
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const Profile = () => {
  const { user } = useAuth();
  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    'Agent';

  const statusMeta = {
    incomplete: {
      label: 'Incomplete',
      className: 'bg-[#F7EFDD] text-[#8A6A2F]',
      icon: AlertCircle,
      helper: 'Complete your agent profile to activate your account and list properties.',
    },
    pending: {
      label: 'Pending Approval',
      className: 'bg-[#FBF3DD] text-[#8A6A2F]',
      icon: Clock,
      helper: 'Your profile is under review by an administrator.',
    },
    approved: {
      label: 'Approved',
      className: 'bg-[#E6F4EC] text-[#2F7A55]',
      icon: CheckCircle,
      helper: 'Your agent account is active and you can list properties.',
    },
  };

  const status = statusMeta[user?.agentProfileStatus] || statusMeta.approved;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
          Account
        </p>
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0"
          >
            <UserCircle size={20} />
          </span>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">My Profile</h1>
        </div>
        <p className="text-[13px] text-[#6B7280] mt-1">
          Your agent profile and account verification status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column — Identity card */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.06)] text-center flex flex-col items-center">
            <Avatar
              src={user?.profileImageUrl}
              alt={displayName}
              size={112}
              className="border-4 border-slate-100 shadow-md"
            />
            <h2 className="text-lg font-bold text-slate-900 mt-4">{displayName}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 capitalize">
              {user?.role || 'Agent'}
            </p>

            <span
              className={`mt-3 px-3 py-1 text-xs font-bold rounded-full border inline-flex items-center gap-1 ${status.className}`}
            >
              <StatusIcon size={14} />
              {status.label}
            </span>

            <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-slate-400" />
                  Email
                </span>
                <span className="font-semibold text-slate-900 truncate max-w-[220px]">
                  {user?.email || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Account Role</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {user?.role || 'Agent'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — Status card */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <h3 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-slate-100">
              Verification Status
            </h3>
            <p className="text-[13px] text-[#6B7280] mt-4">{status.helper}</p>

            {user?.agentProfileStatus === 'incomplete' && (
              <Link
                to={ROUTES.completeAgentProfile}
                className="mt-4 inline-flex items-center gap-2 bg-[#4A9FF5] hover:bg-[#3A8FE5] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-[0_4px_12px_rgba(74,159,245,0.25)]"
              >
                <ShieldCheck size={16} />
                Complete Agent Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
