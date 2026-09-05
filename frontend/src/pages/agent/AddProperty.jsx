import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, AlertTriangle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import PropertyForm from '../../components/forms/PropertyForm';
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
    setSaved(true);
    const base = status === 'draft' ? 'Draft saved successfully.' : 'Your property is now live!';
    if (notice) {
      setSaveFailed(true);
      showToast(`${base} ${notice}`, { tone: 'error', duration: 12000 });
      return;
    }
    showToast(base);
    redirectRef.current = setTimeout(() => navigate(ROUTES.agentProperties), 1100);
  };

  return (
    <div className="space-y-5 font-sans pb-10">
      {toastMessage && (
        <div
          role={toastTone === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium ${
            toastTone === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
          }`}
        >
          {toastTone === 'error' ? (
            <AlertTriangle size={16} className="shrink-0" />
          ) : (
            <Check size={16} className="text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {saveFailed && (
        <div role="alert" className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 flex items-center space-x-2">
          <AlertTriangle size={15} className="shrink-0" />
          <span>
            The property was saved, but some images failed to upload.{' '}
            <Link to={ROUTES.agentProperties} className="underline font-semibold hover:text-rose-900">
              Open My Properties
            </Link>{' '}
            to add images later.
          </span>
        </div>
      )}

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
        onCancel={() => navigate('/agent/properties')}
      />
    </div>
  );
};

export default AddProperty;