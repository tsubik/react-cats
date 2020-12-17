import { useEffect, useState } from 'react';

export function useDebounce(value, delay, callback) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
        if (callback && typeof callback === 'function') callback();
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay, callback]
  );

  return debouncedValue;
}
