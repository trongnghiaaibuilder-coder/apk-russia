import { useState, useCallback } from 'react';
import { safeStorage } from '../services/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return safeStorage.getItem<T>(key, initialValue);
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        safeStorage.setItem(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
