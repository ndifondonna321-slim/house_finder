"use client";

import { useEffect, useState } from "react";
import { useSavedListings } from "@/hooks/useSavedListings";
import { getAllApprovedListings, formatPrice, roomTypeLabels, type Listing } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";

export default function SavedPage() {
  const { saved, toggleSave } = useSavedListings();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      const all = await getAllApprovedListings();
      setSavedListings(all.filter((l) => saved.includes(l.id)));
      setIsLoading(false);
    }
    fetchSaved();
  }, [saved]);

  if (isLoading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-subtle)" }}>
        Loading your saved listings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <p className="section-label" style={{ marginBottom: "0.375rem" }}>
          Your Collection
        </p>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 800,
            marginBottom: "0.5rem",
          }}
        >
          Saved Listings
        </h1>
        <p style={{ color: "var(--text-subtle)", fontSize: "0.9375rem" }}>
          {savedListings.length} saved house{savedListings.length !== 1 ? "s" : ""}
        </p>
      </div>

      {savedListings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "6rem 2rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🤍</div>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.625rem" }}>
            No saved listings yet
          </h2>
          <p
            style={{
              color: "var(--text-subtle)",
              fontSize: "0.9375rem",
              marginBottom: "2rem",
              maxWidth: "36ch",
              margin: "0 auto 2rem",
            }}
          >
            Browse listings and tap the heart icon to save houses you like.
          </p>
          <Link href="/listings" className="btn btn-primary">
            Browse Listings
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {savedListings.map((listing) => (
            <div
              key={listing.id}
              className="card-lift"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: "200px" }}>
                <Image
                  src={listing.images[0] || "/placeholder-house.jpg"}
                  alt={listing.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                  <span className={`badge badge-${listing.availability}`}>
                    {listing.availability === "available" && "● "}
                    {listing.availability.charAt(0).toUpperCase() +
                      listing.availability.slice(1)}
                  </span>
                </div>
                {/* Remove button */}
                <button
                  onClick={() => toggleSave(listing.id)}
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    background: "rgba(8,14,26,0.8)",
                    border: "none",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s",
                  }}
                  title="Remove from saved"
                >
                  ❤️
                </button>
              </div>

              {/* Card body */}
              <div style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    marginBottom: "0.375rem",
                    color: "var(--text)",
                  }}
                >
                  {listing.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-muted)",
                    marginBottom: "1rem",
                  }}
                >
                  📍 {listing.location}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "1.0625rem",
                        fontWeight: 800,
                        color: "var(--primary)",
                      }}
                    >
                      {formatPrice(listing.price)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {roomTypeLabels[listing.roomType]}
                    </div>
                  </div>
                  <Link
                    href={`/listing/${listing.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
