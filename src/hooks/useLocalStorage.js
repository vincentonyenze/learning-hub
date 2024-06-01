import { useEffect, useState } from "react";

// Like useState, but the value is kept in localStorage: still there after
// a refresh, and in step across open tabs. (The same hook as Project 16.)
//
// clean(value): checks what was read back and returns a safe version, or
// throws if it's unusable. Stored data is untrusted.
// fallback and clean must be the same between renders (define them
// outside components): they're in an effect's dependency list.

function read(key, fallback, clean) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : clean(JSON.parse(raw));
  } catch {
    return fallback; // blocked storage, broken JSON, or clean() said no
  }
}

export function useLocalStorage(key, fallback, clean = (value) => value) {
  const [value, setValue] = useState(() => read(key, fallback, clean));

  // Save after every change (null means "nothing": remove the key)
  useEffect(() => {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Full or blocked: keep working, just without remembering
    }
  }, [key, value]);

  // Another tab changed it: take the new value
  useEffect(() => {
    function handleStorage(event) {
      if (event.storageArea === localStorage && event.key === key) {
        setValue(read(key, fallback, clean));
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, fallback, clean]);

  return [value, setValue];
}
