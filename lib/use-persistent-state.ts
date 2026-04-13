'use client';

import { useEffect, useState } from 'react';

export function usePersistentState<T>(getValue: () => T, setValue: (value: T) => void) {
  const [value, setInternalValue] = useState<T>(getValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setInternalValue(getValue());
    setHydrated(true);
  }, [getValue]);

  const updateValue = (next: T | ((current: T) => T)) => {
    setInternalValue((current) => {
      const resolved = typeof next === 'function' ? (next as (current: T) => T)(current) : next;
      setValue(resolved);
      return resolved;
    });
  };

  return { value, setValue: updateValue, hydrated };
}
