"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  getAllApprovedListings,
  roomTypeLabels,
  type RoomType,
  type AvailabilityStatus,
  type Listing,
} from "@/lib/data";
import { useSavedListings } from "@/hooks/useSavedListings";
import { useAuth } from "@/context/AuthContext";
import ListingCard from "@/components/ListingCard";

const ROOM_TYPES: RoomType[] = ["single", "studio", "chamber-parlour", "2-bedroom", "3-bedroom"];

const ROOM_ICONS: Record<RoomType, string> = {
  single: "🛏",
  studio: "🏠",
  "chamber-parlour": "🛋",
  "2-bedroom": "🏡",
  "3-bedroom": "🏘",
};

export default function ListingsPage() {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedListings();

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState<RoomType | "">("");
  const [availability, setAvailability] = useState<AvailabilityStatus | "">("");
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      const isStaff = user?.role === "admin" || user?.role === "landlord";
      let data;
      if (isStaff) {
        const { getAllListings } = await import("@/lib/data");
        data = await getAllListings();
      } else {
        data = await getAllApprovedListings();
      }
      setListings(data);
      setIsLoading(false);
    };
    fetchListings();
  }, [user]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !q || l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q);
      const matchRoom = !roomType || l.roomType === roomType;
      const matchAvail = !availability || l.availability === availability;
      const matchPrice = l.price <= maxPrice;
      const matchDist = l.distanceFromCampus <= maxDistance;
      const isStaff = user?.role === "admin" || user?.role === "landlord";
      const matchStatus = isStaff ? true : l.status === "approved";
      return matchSearch && matchRoom && matchAvail && matchPrice && matchDist && matchStatus;
    });
  }, [search, roomType, availability, maxPrice, maxDistance, listings, user]);

  const hasActiveFilters = roomType !== "" || availability !== "" || maxPrice < 10000000 || maxDistance < 100;

  const resetFilters = () => {
    setSearch("");
    setRoomType("");
    setAvailability("");
    setMaxPrice(10000000);
    setMaxDistance(100);
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

      {/* ── Page Header ── */}
      <div className="anim-fade-up" style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="section-label" style={{ marginBottom: "0.5rem" }}>BAMBILI CAMPUS HOUSING</p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.625rem" }}>
              Find Your{" "}
              <span className="gradient-text">Perfect Room</span>
            </h1>
            <p style={{ color: "var(--text-subtle)", fontSize: "0.9375rem" }}>
              {isLoading ? "Loading listings…" : (
                <>
                  <span style={{ color: "var(--primary)", fontWeight: 700 }}>{filtered.length}</span>
                  {" "}listing{filtered.length !== 1 ? "s" : ""} available in Bambili
                  {hasActiveFilters && <span style={{ color: "var(--accent)", marginLeft: "0.5rem", fontSize: "0.8125rem" }}>• Filters active</span>}
                </>
              )}
            </p>
          </div>

          {user?.role === "landlord" && (
            <Link href="/admin/new" className="btn btn-accent anim-slide-left" style={{ flexShrink: 0 }}>
              ＋ Add Listing
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }} className="listings-layout">

        {/* ── Sidebar Filters ── */}
        <aside
          style={{ width: "260px", flexShrink: 0, position: "sticky", top: "80px" }}
          className="filters-sidebar"
        >
          <div style={{
            background: "linear-gradient(160deg, var(--bg-card) 0%, rgba(8,14,26,0.98) 100%)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}>
            {/* Filter header */}
            <div style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(20,184,166,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1rem" }}>⚙️</span>
                <h2 style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-subtle)" }}>Filters</h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent)", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "9999px", padding: "0.2rem 0.625rem", cursor: "pointer", transition: "all 0.2s ease" }}
                >
                  Reset
                </button>
              )}
            </div>

            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Room Type */}
              <div>
                <p className="form-label" style={{ marginBottom: "0.75rem" }}>Room Type</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <button
                    onClick={() => setRoomType("")}
                    style={{
                      textAlign: "left", padding: "0.5rem 0.75rem",
                      borderRadius: "var(--radius-sm)", fontSize: "0.875rem",
                      cursor: "pointer", border: "none",
                      background: !roomType ? "rgba(20,184,166,0.1)" : "transparent",
                      color: !roomType ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: !roomType ? 700 : 400,
                      transition: "all 0.15s ease",
                      display: "flex", alignItems: "center", gap: "0.5rem",
                    }}
                  >
                    <span>🏘</span> All Types
                  </button>
                  {ROOM_TYPES.map((rt) => (
                    <button
                      key={rt}
                      onClick={() => setRoomType(rt)}
                      style={{
                        textAlign: "left", padding: "0.5rem 0.75rem",
                        borderRadius: "var(--radius-sm)", fontSize: "0.875rem",
                        cursor: "pointer", border: "none",
                        background: roomType === rt ? "rgba(20,184,166,0.1)" : "transparent",
                        color: roomType === rt ? "var(--primary)" : "var(--text-muted)",
                        fontWeight: roomType === rt ? 700 : 400,
                        transition: "all 0.15s ease",
                        display: "flex", alignItems: "center", gap: "0.5rem",
                      }}
                    >
                      <span>{ROOM_ICONS[rt]}</span> {roomTypeLabels[rt]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divider" />

              {/* Availability */}
              <div>
                <p className="form-label" style={{ marginBottom: "0.625rem" }}>Availability</p>
                <select
                  className="input"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as AvailabilityStatus | "")}
                  style={{ fontSize: "0.875rem", padding: "0.5rem 0.75rem" }}
                >
                  <option value="">All Status</option>
                  <option value="available">✅ Available</option>
                  <option value="reserved">🟡 Reserved</option>
                  <option value="occupied">🔴 Occupied</option>
                </select>
              </div>

              <div className="divider" />

              {/* Max Price */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
                  <p className="form-label">Max Price</p>
                  <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--primary)" }}>
                    {maxPrice >= 10000000 ? "Any" : `${(maxPrice / 1000).toFixed(0)}k FCFA`}
                  </span>
                </div>
                <input
                  type="range" min={10000} max={10000000} step={5000} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer", height: "4px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                  <span>10k FCFA</span><span>Any</span>
                </div>
              </div>

              <div className="divider" />

              {/* Max Distance */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
                  <p className="form-label">Distance</p>
                  <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--primary)" }}>
                    {maxDistance >= 100 ? "Any" : `≤ ${maxDistance} min`}
                  </span>
                </div>
                <input
                  type="range" min={3} max={100} step={1} value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer", height: "4px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                  <span>3 min</span><span>Any</span>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="btn btn-ghost btn-sm"
                  style={{ width: "100%", justifyContent: "center", border: "1px solid var(--border)", marginTop: "-0.5rem" }}
                >
                  ↺ Clear all filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Search + controls bar */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.9rem", pointerEvents: "none" }}>
                🔍
              </span>
              <input
                id="listings-search"
                type="search"
                className="input"
                placeholder="Search by name or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "2.5rem", paddingRight: "1rem" }}
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="show-mobile btn btn-outline btn-sm"
              style={{
                display: "none",
                flexShrink: 0,
                borderColor: hasActiveFilters ? "rgba(245,158,11,0.4)" : undefined,
                color: hasActiveFilters ? "var(--accent)" : undefined,
              }}
            >
              ⚙ {hasActiveFilters ? "Active" : "Filter"}
            </button>

            {/* View toggle */}
            <div style={{ display: "flex", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", flexShrink: 0 }}>
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "0.5625rem 0.875rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    background: view === v ? "rgba(20,184,166,0.12)" : "transparent",
                    color: view === v ? "var(--primary)" : "var(--text-muted)",
                    transition: "all 0.2s ease",
                  }}
                  title={`${v} view`}
                >
                  {v === "grid" ? "⊞" : "☰"}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile expandable filters */}
          {filtersOpen && (
            <div className="show-mobile anim-fade-down" style={{
              display: "none",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
              marginBottom: "1.5rem",
              flexDirection: "column",
              gap: "1rem",
            }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button onClick={() => setRoomType("")} className={`chip ${!roomType ? "chip-active" : ""}`}>All</button>
                {ROOM_TYPES.map(rt => (
                  <button key={rt} onClick={() => setRoomType(rt)} className={`chip ${roomType === rt ? "chip-active" : ""}`}>
                    {ROOM_ICONS[rt]} {roomTypeLabels[rt]}
                  </button>
                ))}
              </div>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="btn btn-ghost btn-sm" style={{ justifyContent: "center" }}>
                  ↺ Reset filters
                </button>
              )}
            </div>
          )}

          {/* Results */}
          {isLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div className="shimmer" style={{ height: "210px" }} />
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div className="shimmer" style={{ height: "20px", borderRadius: "var(--radius-sm)", width: "70%" }} />
                    <div className="shimmer" style={{ height: "14px", borderRadius: "var(--radius-sm)", width: "50%" }} />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <div className="shimmer" style={{ height: "28px", borderRadius: "9999px", flex: 1 }} />
                      <div className="shimmer" style={{ height: "28px", borderRadius: "9999px", flex: 1 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="anim-scale-in" style={{
              textAlign: "center",
              padding: "6rem 2rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
            }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🏚️</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>No listings found</h3>
              <p style={{ color: "var(--text-subtle)", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
                Try adjusting your filters or search terms.
              </p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="btn btn-outline btn-sm">
                  ↺ Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div
              className="anim-fade-up"
              style={view === "grid" ? {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(288px, 1fr))",
                gap: "1.25rem",
              } : {
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {filtered.map((listing, i) => (
                <div
                  key={listing.id}
                  className={`anim-fade-up delay-${Math.min(i * 50, 400)}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <ListingCard
                    listing={listing}
                    isSaved={isSaved(listing.id)}
                    onToggleSave={toggleSave}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .filters-sidebar { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
