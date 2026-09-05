import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing toast messages with timer ref cleanup and unmount safety.
 * @param {number} defaultDuration Default duration in ms (default 3000)
 */
export const useToast = (defaultDuration = 3000) => {
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTone, setToastTone] = useState('success');
  const timerRef = useRef(null);

  const showToast = useCallback(
    (message, { tone = 'success', duration = defaultDuration } = {}) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setToastMessage(message);
      setToastTone(tone);
      timerRef.current = setTimeout(() => {
        setToastMessage(null);
        timerRef.current = null;
      }, duration);
    },
    [defaultDuration],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toastMessage, toastTone, showToast };
};

export default useToast;
