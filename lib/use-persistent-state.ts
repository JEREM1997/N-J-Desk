'use client';

import { useEffect, useRef, useState } from 'react';

export function usePersistentState<T>(getValue: () => T, setValue?: (value: T) => void) {
  const getValueRef = useRef(getValue);
  const setValueRef = useRef(setValue);

  getValueRef.current = getValue;
  setValueRef.current = setValue;

  const [value, setInternalValue] = useState<T>(() => getValueRef.current());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setInternalValue(getValueRef.current());
    setHydrated(true);
  }, []);

  const updateValue = (next: T | ((current: T) => T)) => {
    setInternalValue((current) => {
      const resolved = typeof next === 'function' ? (next as (current: T) => T)(current) : next;
      setValueRef.current?.(resolved);
      return resolved;
    });
  };

  return { value, setValue: updateValue, hydrated };
}
