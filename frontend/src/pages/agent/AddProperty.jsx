import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import PropertyForm from '../../components/forms/PropertyForm';
import SaveNotice from '../../components/agent/SaveNotice';
import { ROUTES } from '../../utils/constants';

const AddProperty = () => {
  const navigate = useNavigate();
  const { toastMessage, toastTone, showToast } = useToast();
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

  const handleSaved = (status, notice) => {
    const base = status === 'draft' ? 'Draft saved successfully.' : 'Your property is now live!';
    if (notice) {
      setSaveFailed(true);
      showToast(`${base} ${notice}`, { tone: 'error', duration: 12000 });
      return;
    }
    setSaved(true);
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