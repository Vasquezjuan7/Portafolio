'use client';

import { useState, useEffect } from 'react';
import { safeGetStorage, safeSetStorage } from '../utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => safeGetStorage(key, initialValue));

  useEffect(() => {
    safeSetStorage(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
