/**
 * useDebounce Hook
 * 
 * What: Debounces a value, delaying updates until after a specified delay
 * Why: Prevents excessive API calls or re-renders when user is typing
 * 
 * Usage:
 *   const debouncedSearch = useDebounce(search, 500);
 *   useEffect(() => {
 *     fetchData(debouncedSearch);
 *   }, [debouncedSearch]);
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
