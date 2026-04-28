"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bambihomes_saved";

export function useSavedListings() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id: string) => saved.includes(id),
    [saved]
  );

  return { saved, toggleSave, isSaved };
}
