"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getAllApprovedListings,
  formatPrice,
  roomTypeLabels,
  type RoomType,
  type AvailabilityStatus,
  type Listing,
} from "@/lib/data";
import { useSavedListings } from "@/hooks/useSavedListings";
import { useAuth } from "@/context/AuthContext";
import ListingCard from "@/components/ListingCard";

const ROOM_TYPES: RoomType[] = [
  "single",
  "studio",
  "chamber-parlour",
  "2-bedroom",
  "3-bedroom",
];

export default function ListingsPage() {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedListings();

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState<RoomType | "">("");
  const [availability, setAvailability] = useState<AvailabilityStatus | "">("");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [maxDistance, setMaxDistance] = useState<number>(30);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      const data = await getAllApprovedListings();
      setListings(data);
      setIsLoading(false);
    };
    fetchListings();
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q);
      const matchRoom = !roomType || l.roomType === roomType;
      const matchAvail = !availability || l.availability === availability;
      const matchPrice = l.price <= maxPrice;
      const matchDist = l.distanceFromCampus <= maxDistance;
      
      // Admin sees everything, students see only approved
      const isAdmin = user?.role === "admin";
      const matchStatus = isAdmin ? true : l.status === "approved";
      
      return matchSearch && matchRoom && matchAvail && matchPrice && matchDist && matchStatus;
    });
  }, [search, roomType, availability, maxPrice, maxDistance, listings, user]);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      {/* Page header */}
      <div style={{ marginBottom: "3rem" }}>
        <p className="section-label" style={{ marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>
          BROWSE HOUSING
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            fontWeight: 900,
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          Find Your Perfect Room
        </h1>
        <p style={{ color: "var(--text-subtle)", fontSize: "1rem", fontWeight: 400 }}>
          {filtered.length} verified listing{filtered.length !== 1 ? "s" : ""} available in Bambili
        </p>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        {/* ── Sidebar Filters ── */}
        <aside
          style={{
            width: "260px",
            flexShrink: 0,
            position: "sticky",
            top: "80px",
          }}
          className="filters-sidebar"
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
              }}
            >
              Filters
            </h2>

            {/* Room Type */}
            <div>
              <label
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-subtle)",
                  display: "block",
                  marginBottom: "0.625rem",
                }}
              >
                Room Type
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <button
                  onClick={() => setRoomType("")}
                  style={{
                    textAlign: "left",
                    padding: "0.4rem 0.625rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    border: "none",
                    background: !roomType ? "rgba(20,184,166,0.12)" : "transparent",
                    color: !roomType ? "var(--primary)" : "var(--text-subtle)",
                    fontWeight: !roomType ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  All Types
                </button>
                {ROOM_TYPES.map((rt) => (
                  <button
                    key={rt}
                    onClick={() => setRoomType(rt)}
                    style={{
                      textAlign: "left",
                      padding: "0.4rem 0.625rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      border: "none",
                      background:
                        roomType === rt ? "rgba(20,184,166,0.12)" : "transparent",
                      color:
                        roomType === rt ? "var(--primary)" : "var(--text-subtle)",
                      fontWeight: roomType === rt ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {roomTypeLabels[rt]}
                  </button>
                ))}
              </div>
            </div>

            <div className="divider" />

            {/* Availability */}
            <div>
              <label
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-subtle)",
                  display: "block",
                  marginBottom: "0.625rem",
                }}
              >
                Availability
              </label>
              <select
                className="input"
                value={availability}
                onChange={(e) =>
                  setAvailability(e.target.value as AvailabilityStatus | "")
                }
                style={{ fontSize: "0.875rem", padding: "0.5rem 0.75rem" }}
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>

            <div className="divider" />

            {/* Max Price */}
            <div>
              <label
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-subtle)",
                  display: "block",
                  marginBottom: "0.375rem",
                }}
              >
                Max Price
              </label>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  marginBottom: "0.625rem",
                }}
              >
                {maxPrice.toLocaleString("fr-CM")} FCFA
              </div>
              <input
                type="range"
                min={10000}
                max={100000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "var(--primary)",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "0.25rem",
                }}
              >
                <span>10k</span>
                <span>100k</span>
              </div>
            </div>

            <div className="divider" />

            {/* Max Distance */}
            <div>
              <label
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-subtle)",
                  display: "block",
                  marginBottom: "0.375rem",
                }}
              >
                Distance from Campus
              </label>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  marginBottom: "0.625rem",
                }}
              >
                ≤ {maxDistance} min walk
              </div>
              <input
                type="range"
                min={3}
                max={30}
                step={1}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "var(--primary)",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "0.25rem",
                }}
              >
                <span>3 min</span>
                <span>30 min</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setRoomType("");
                setAvailability("");
                setMaxPrice(100000);
                setMaxDistance(30);
              }}
              className="btn btn-ghost btn-sm"
              style={{ width: "100%", justifyContent: "center" }}
            >
              ↺ Reset filters
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Search + view toggle */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <span
                style={{
                  position: "absolute",
                  left: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  fontSize: "1rem",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                id="listings-search"
                type="search"
                className="input"
                placeholder="Search by name or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>

            {/* View toggle */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "0.625rem",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "0.5rem 0.875rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    background: view === v ? "rgba(20,184,166,0.15)" : "transparent",
                    color: view === v ? "var(--primary)" : "var(--text-muted)",
                    transition: "all 0.2s",
                  }}
                  title={`${v} view`}
                >
                  {v === "grid" ? "⊞" : "☰"}
                </button>
              ))}
            </div>
          </div>

          {/* Listing results */}
          {isLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 2rem",
                color: "var(--text-muted)",
              }}
            >
              <div className="spinner" style={{ margin: "0 auto 1.5rem" }} />
              <p>Loading listings...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 2rem",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏚️</div>
              <p style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                No listings match your filters
              </p>
              <p style={{ fontSize: "0.9375rem" }}>
                Try adjusting the price range or distance filters.
              </p>
            </div>
          ) : (
            <div
              style={
                view === "grid"
                  ? {
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                      gap: "1.25rem",
                    }
                  : {
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }
              }
            >
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isSaved={isSaved(listing.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .filters-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}
