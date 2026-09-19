import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { submitInquiry } from '../../services/inquiry.service';
import useAuth from '../../hooks/useAuth';

const ContactAgentModalContent = ({ agent, onClose }) => {
  const { t } = useTranslation('agents');
  const { user } = useAuth();
  const nameInputRef = useRef(null);
  const modalRef = useRef(null);
  const doneButtonRef = useRef(null);
  const loadingRef = useRef(false);

  const defaultName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
  const defaultEmail = user?.email || '';
  const defaultPhone = user?.phone || '';

  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState(
    t('default_message', { name: agent?.name || '' })
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  // Keep the loading state accessible to the Escape handler without stale closures
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // Refocus onto the Done button when the form swaps to the success view, so
  // keyboard focus does not leak out of the modal.
  useEffect(() => {
    if (sent) {
      doneButtonRef.current?.focus();
    }
  }, [sent]);

  // Auto focus first interactive control, lock body scroll, trap focus, and handle Escape key
  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;
    nameInputRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loadingRef.current) {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];
        const isInsideModal = modalRef.current.contains(document.activeElement);

        // Pull focus back into the modal if it has leaked outside
        // (e.g. after the form is replaced by the success view)
        if (!isInsideModal) {
          e.preventDefault();
          (e.shiftKey ? lastElement : firstElement).focus();
        } else if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
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
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t('error_name'));
      return;
    }

    if (!email.trim()) {
      setError(t('error_email'));
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setError(t('error_message_short'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitInquiry({
        agentId: agent?.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        message: message.trim(),
      });
      setSent(true);
    } catch (err) {
      console.error('Failed to send contact message:', err);
      const msg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.message) ||
        t('error_generic');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
        >
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <h2 id="contact-success-title" className="text-base font-bold text-slate-900">
              {t('success_title')}
            </h2>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              {t('success_body', { name: agent?.name })}
            </p>
            <button
              type="button"
              ref={doneButtonRef}
              onClick={onClose}
              className="mt-6 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              {t('done')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 id="contact-modal-title" className="text-base font-bold text-slate-900">
                {t('modal_title', { name: agent?.name })}
              </h2>
              <p className="text-xs text-slate-500">
                {t('modal_subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('modal_close')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Agent Summary Preview */}
          {agent && (
            <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              {agent.photo ? (
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg shrink-0 bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {agent.name?.charAt(0) || 'A'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{agent.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {agent.role || t('agent_role')}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {t('propertyCount', { count: agent.propertyCount ?? 0 })}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2"
            >
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Name & Email Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="contactName" className="block text-xs font-bold text-slate-700">
                {t('your_name')} <span className="text-rose-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="contactName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('name_placeholder')}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contactEmail" className="block text-xs font-bold text-slate-700">
                {t('email_address')} <span className="text-rose-500">*</span>
              </label>
              <input
                id="contactEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('email_placeholder')}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-1">
            <label htmlFor="contactPhone" className="block text-xs font-bold text-slate-700">
              {t('phone_number')}{' '}
              <span className="text-[11px] font-normal text-slate-400">
                {t('phone_optional')}
              </span>
            </label>
            <input
              id="contactPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phone_placeholder')}
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          {/* Message Area */}
          <div className="space-y-1">
            <label htmlFor="contactMessage" className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>{t('your_message')} <span className="text-rose-500">*</span></span>
              <span className="text-[11px] font-normal text-slate-400">{t('max_chars')}</span>
            </label>
            <textarea
              id="contactMessage"
              rows={4}
              maxLength={5000}
              placeholder={t('message_placeholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('sending')}</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>{t('send_message')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ContactAgentModal = (props) => {
  if (!props.open) return null;
  return <ContactAgentModalContent {...props} />;
};

export default ContactAgentModal;