import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import { submitInquiry } from '../../services/inquiry.service';
import useAuth from '../../hooks/useAuth';

const InquiryModalContent = ({
  onClose,
  property,
  onSuccess,
}) => {
  const { user } = useAuth();
  const nameInputRef = useRef(null);
  const modalRef = useRef(null);
  const loadingRef = useRef(false);

  const defaultName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
  const defaultEmail = user?.email || '';
  const defaultPhone = user?.phone || '';

  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState(
    property?.title
      ? `Hello, I am interested in "${property.title}". Is this property still available for viewing?`
      : 'Hello, I would like more information about this property listing.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  loadingRef.current = loading;

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

        if (e.shiftKey) {
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

    if (!property?.id) {
      setError('Property identifier is missing. Please select a valid property.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setError('Please enter a message of at least 5 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const created = await submitInquiry({
        propertyId: property.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        message: message.trim(),
      });

      if (onSuccess) {
        onSuccess(created, 'Your inquiry has been sent to the listing agent!');
      }
      onClose();
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      const msg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.message) ||
        'Failed to send inquiry';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 id="inquiry-modal-title" className="text-base font-bold text-slate-900">
                Contact Listing Agent
              </h2>
              <p className="text-xs text-slate-500">
                Send a direct message or inquiry about this property
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Property Summary Preview */}
          {property && (
            <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              {(property.img || property.image || property.propertyImage) && (
                <img
                  src={property.img || property.image || property.propertyImage}
                  alt={property.title}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {property.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {property.location || property.city || property.address}
                </p>
                {property.price && (
                  <p className="text-xs font-bold text-blue-600 mt-0.5">
                    {typeof property.price === 'number' ? `$${property.price.toLocaleString()}` : property.price}
                  </p>
                )}
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
              <label htmlFor="inquiryName" className="block text-xs font-bold text-slate-700">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="inquiryName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="inquiryEmail" className="block text-xs font-bold text-slate-700">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="inquiryEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-1">
            <label htmlFor="inquiryPhone" className="block text-xs font-bold text-slate-700">
              Phone Number <span className="text-[11px] font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              id="inquiryPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251 911 000 000"
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          {/* Message Area */}
          <div className="space-y-1">
            <label htmlFor="inquiryMessage" className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Your Message <span className="text-rose-500">*</span></span>
              <span className="text-[11px] font-normal text-slate-400">Max 2000 chars</span>
            </label>
            <textarea
              id="inquiryMessage"
              rows={4}
              maxLength={2000}
              placeholder="Ask about pricing, availability, or property features..."
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Send Inquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const InquiryModal = (props) => {
  if (!props.isOpen) return null;
  return <InquiryModalContent {...props} />;
};

export default InquiryModal;
