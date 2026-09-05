import { Link } from 'react-router-dom';
import { Check, AlertTriangle } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const SaveNotice = ({ toastMessage, toastTone, saveFailed }) => (
  <>
    {toastMessage && (
      <div
        role={toastTone === 'error' ? 'alert' : 'status'}
        aria-live={toastTone === 'error' ? undefined : 'polite'}
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
  </>
);

export default SaveNotice;