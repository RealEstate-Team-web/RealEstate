import { useState, useEffect, useRef } from 'react';
import { Calendar, X, AlertCircle } from 'lucide-react';
import { bookVisit, rescheduleVisit } from '../../services/visit.service';

const BookVisitModalContent = ({
  onClose,
  property,
  visit,
  isReschedule = false,
  onSuccess,
}) => {
  const dateInputRef = useRef(null);

  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  })();

  const [visitDate, setVisitDate] = useState(
    isReschedule && visit?.visitDate ? visit.visitDate : tomorrowStr
  );
  const [visitTime, setVisitTime] = useState(
    isReschedule && visit?.visitTime ? visit.visitTime.slice(0, 5) : '10:00'
  );
  const [notes, setNotes] = useState(
    isReschedule && visit?.notes ? visit.notes : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  // Auto focus first interactive control and handle Escape key
  useEffect(() => {
    dateInputRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, loading]);

  const targetProperty = property || (visit ? {
    id: visit.propertyId,
    title: visit.propertyTitle,
    address: visit.propertyAddress,
    city: visit.propertyCity,
    price: visit.propertyPrice,
    img: visit.propertyImage,
  } : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!visitDate) {
      setError('Please select a visit date');
      return;
    }
    if (!visitTime) {
      setError('Please select a visit time');
      return;
    }

    const selectedDateTime = new Date(`${visitDate}T${visitTime}:00`);
    if (selectedDateTime <= new Date()) {
      setError('Visit date and time must be in the future');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isReschedule && visit?.id) {
        const updated = await rescheduleVisit(visit.id, {
          visitDate,
          visitTime,
          notes,
        });
        if (onSuccess) onSuccess(updated, 'Visit rescheduled successfully!');
      } else if (targetProperty?.id) {
        const created = await bookVisit({
          propertyId: targetProperty.id,
          visitDate,
          visitTime,
          notes,
        });
        if (onSuccess) onSuccess(created, 'Visit booked successfully! The agent will review your request.');
      } else {
        setError('This property is not available for booking. Please try again.');
        return;
      }
      onClose();
    } catch (err) {
      console.error('Failed to submit visit:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to save visit booking';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar size={20} />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-slate-900">
                {isReschedule ? 'Reschedule Property Visit' : 'Schedule a Property Visit'}
              </h2>
              <p className="text-xs text-slate-500">
                {isReschedule
                  ? 'Select a new date and time for your visit'
                  : 'Choose your preferred date and time to visit'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Property Summary Preview */}
          {targetProperty && (
            <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              {targetProperty.img && (
                <img
                  src={targetProperty.img}
                  alt={targetProperty.title}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {targetProperty.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {targetProperty.location || targetProperty.city || targetProperty.address}
                </p>
                {targetProperty.price && (
                  <p className="text-xs font-bold text-blue-600 mt-0.5">
                    {targetProperty.price}
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

          {/* Visit Date */}
          <div className="space-y-1.5">
            <label htmlFor="visitDate" className="block text-xs font-bold text-slate-700">
              Visit Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={dateInputRef}
                id="visitDate"
                type="date"
                min={tomorrowStr}
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Preferred Time Slot <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = visitTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setVisitTime(slot)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <label htmlFor="notes" className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Notes for the Agent (Optional)</span>
              <span className="text-[11px] font-normal text-slate-400">Max 500 chars</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              maxLength={500}
              placeholder="e.g. Interested in seeing the master bedroom and parking facilities..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isReschedule ? 'Save Changes' : 'Confirm Visit Request'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const BookVisitModal = (props) => {
  if (!props.isOpen) return null;
  return <BookVisitModalContent {...props} />;
};

export default BookVisitModal;
