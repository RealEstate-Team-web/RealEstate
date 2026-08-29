import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing toast messages with timer ref cleanup and unmount safety.
 * @param {number} defaultDuration Default duration in ms (default 3000)
 */
export const useToast = (defaultDuration = 3000) => {
  const [toastMessage, setToastMessage] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback(
    (message, duration = defaultDuration) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setToastMessage(message);
      timerRef.current = setTimeout(() => {
        setToastMessage(null);
        timerRef.current = null;
      }, duration);
    },
    [defaultDuration]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toastMessage, showToast };
};

export default useToast;
