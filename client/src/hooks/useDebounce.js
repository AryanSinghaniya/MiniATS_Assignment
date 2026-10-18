import { useState, useEffect } from 'react';

/**
 * useDebounce - delays updating the returned value until after the delay period.
 * Used to avoid firing a search API call on every keystroke.
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default 300ms)
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Cleanup: cancel the timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
