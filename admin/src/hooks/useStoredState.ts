"use client";

import { useEffect, useState } from "react";

/**
 * useState that's remembered in this browser. Storage can be blocked
 * (private mode, previews), so every access is guarded and the default
 * always works.
 */
export function useStoredState<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) setValue(parsed);
      }
    } catch {
      // Unavailable or corrupt — keep the default.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function update(next: T) {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Not persisted; still applies for this visit.
    }
  }

  return [value, update];
}
