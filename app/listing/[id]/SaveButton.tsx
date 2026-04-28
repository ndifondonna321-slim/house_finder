"use client";

import { useSavedListings } from "@/hooks/useSavedListings";

export default function SaveButton({ listingId }: { listingId: string }) {
  const { isSaved, toggleSave } = useSavedListings();
  const saved = isSaved(listingId);

  return (
    <button
      onClick={() => toggleSave(listingId)}
      id={`save-btn-${listingId}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        background: saved ? "rgba(248, 113, 113, 0.1)" : "var(--bg-elevated)",
        border: `1px solid ${saved ? "rgba(248,113,113,0.3)" : "var(--border-light)"}`,
        borderRadius: "var(--radius)",
        color: saved ? "#f87171" : "var(--text-subtle)",
        fontSize: "0.875rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
      aria-label={saved ? "Remove from saved" : "Save listing"}
    >
      {saved ? "❤️ Saved" : "🤍 Save"}
    </button>
  );
}
