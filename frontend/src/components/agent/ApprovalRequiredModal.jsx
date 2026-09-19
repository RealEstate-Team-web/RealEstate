import { useEffect, useRef } from 'react';
import { X, Clock, AlertCircle, XCircle } from 'lucide-react';

const STATUS_CONTENT = {
  incomplete: {
    icon: AlertCircle,
    badge: 'Incomplete Profile',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Complete your profile first',
    message:
      'Your agent profile is incomplete. Complete your profile so an administrator can review it — you will be able to post properties once approved.',
  },
  pending: {
    icon: Clock,
    badge: 'Pending Approval',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Account under review',
    message:
      'You are not approved yet. Your status is under review by an administrator. You will be able to post properties once approved.',
  },
  rejected: {
    icon: XCircle,
    badge: 'Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    title: 'Profile rejected',
    message:
      'Your profile was rejected by an administrator. Update your details and contact support for next steps.',
  },
};

const ApprovalRequiredModal = ({ open, onClose, agentStatus = 'pending' }) => {
  const dialogRef = useRef(null);

  // Lock body scroll, move focus into the dialog, trap Tab navigation, and
  // restore focus to the triggering element on close.
  useEffect(() => {
    if (!open) return;

    const previouslyFocusedElement = document.activeElement;
    dialogRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];
        const isInsideModal = dialogRef.current.contains(document.activeElement);

        // Pull focus back into the dialog whenever it falls outside
        if (!isInsideModal) {
          e.preventDefault();
          (e.shiftKey ? lastElement : firstElement).focus();
        } else if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
        previouslyFocusedElement.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const content = STATUS_CONTENT[agentStatus] || STATUS_CONTENT.pending;
  const Icon = content.icon;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="approval-required-title"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${content.badgeClass}`}>
              <Icon size={13} />
              {content.badge}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <Icon size={26} className="text-amber-600" />
          </div>
          <h3
            id="approval-required-title"
            className="text-[17px] font-bold text-[#101820] tracking-tight"
          >
            {content.title}
          </h3>
          <p className="text-[13px] text-slate-500 mt-2 leading-relaxed max-w-sm">
            {content.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full h-11 rounded-lg bg-[#142238] text-white text-[14px] font-semibold hover:bg-[#1d3357] transition cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default ApprovalRequiredModal;