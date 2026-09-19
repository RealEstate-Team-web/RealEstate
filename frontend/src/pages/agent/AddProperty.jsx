import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, XCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useAgentListingPermission } from '../../hooks/useAgentListingPermission';
import PropertyForm from '../../components/forms/PropertyForm';
import SaveNotice from '../../components/agent/SaveNotice';
import { ROUTES } from '../../utils/constants';

const STATUS_CONTENT = {
  incomplete: {
    icon: AlertCircle,
    title: 'Complete your profile first',
    message:
      'Your agent profile is incomplete. Complete your profile so an administrator can review it.',
  },
  pending: {
    icon: Clock,
    title: 'Account under review',
    message:
      'You are not approved yet. Your status is under review by an administrator. You will be able to post properties once approved.',
  },
  rejected: {
    icon: XCircle,
    title: 'Profile rejected',
    message:
      'Your profile was rejected by an administrator. Update your details and contact support for next steps.',
  },
};

const AddProperty = () => {
  const navigate = useNavigate();
  const { toastMessage, toastTone, showToast } = useToast();
  const { canListProperties, agentStatus } = useAgentListingPermission();
  const [saved, setSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const redirectRef = useRef(null);

  useEffect(
    () => () => {
      if (redirectRef.current) {
        clearTimeout(redirectRef.current);
      }
    },
    [],
  );

  if (!canListProperties) {
    const content = STATUS_CONTENT[agentStatus] || STATUS_CONTENT.pending;
    const Icon = content.icon;
    return (
      <div className="space-y-5 font-sans pb-10">
        <div className="flex items-center gap-3">
          <h2 className="text-[19px] font-bold text-[#101820] tracking-tight">Add Property</h2>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 py-16 px-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <Icon size={26} className="text-amber-600" />
          </div>
          <h3 className="text-[15px] font-bold text-[#101820]">{content.title}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">{content.message}</p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.agentProperties)}
            className="mt-5 inline-flex items-center h-10 px-4 rounded-lg bg-[#142238] text-white text-[13px] font-semibold hover:bg-[#1d3357] transition cursor-pointer"
          >
            Back to My Properties
          </button>
        </div>
      </div>
    );
  }

  const handleSaved = (status, notice) => {
    const base = status === 'draft' ? 'Draft saved successfully.' : 'Your property is now live!';
    if (notice) {
      setSaveFailed(true);
      showToast(`${base} ${notice}`, { tone: 'error', duration: 12000 });
      return;
    }
    setSaved(true);
    setSaveFailed(false);
    showToast(base);
    redirectRef.current = setTimeout(() => navigate(ROUTES.agentProperties), 1100);
  };

  return (
    <div className="space-y-5 font-sans pb-10">
      <SaveNotice toastMessage={toastMessage} toastTone={toastTone} saveFailed={saveFailed} />

      {saved && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3">
          Redirecting to your properties...
        </div>
      )}

      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-[19px] font-bold text-[#101820] tracking-tight">Add Property</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Fill in the details below. You can save as a draft and publish later.
          </p>
        </div>
      </div>

      <PropertyForm
        initial={null}
        onSaved={handleSaved}
        onCancel={() => navigate(ROUTES.agentProperties)}
      />
    </div>
  );
};

export default AddProperty;