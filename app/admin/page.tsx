"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllListings, getAllLandlords, updateLandlordStatus, type Listing, type Profile } from "@/lib/data";
import { getAdminDataAction, approveLandlordAction } from "./actions";

export default function AdminDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [landlords, setLandlords] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const result = await getAdminDataAction();
      if (result.success) {
        setListings(result.listings || []);
        setLandlords(result.landlords || []);
      } else {
        console.error("Dashboard fetch error:", result.error);
      }
    } catch (error) {
      console.error("Dashboard unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const total = listings.length;
  const approved = listings.filter((l) => l.status === "approved").length;
  const pending = listings.filter((l) => l.status === "pending").length;
  const pendingLandlords = landlords.filter((p) => p.status === "pending");
  const recent = [...listings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    { label: "Total Listings", value: total, icon: "🏠", color: "var(--primary)" },
    { label: "Pending Listings", value: pending, icon: "⏳", color: "#fbbf24" },
    { label: "Total Landlords", value: landlords.length, icon: "👥", color: "var(--secondary)" },
    { label: "Pending Landlords", value: pendingLandlords.length, icon: "🛡️", color: "#f59e0b" },
  ];

  const handleApproveLandlord = async (id: string) => {
    if (!confirm("Are you sure you want to approve this landlord?")) return;
    
    setIsLoading(true);
    const result = await approveLandlordAction(id);
    
    if (result.success) {
      alert("Landlord approved successfully!");
      await fetchAll();
    } else {
      alert(`Error: ${result.error || "Failed to approve landlord."}\n\nPlease ensure you have added the SUPABASE_SERVICE_ROLE_KEY to your .env.local file.`);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="anim-fade-up" style={{ marginBottom: "2rem" }}>
        <p className="section-label" style={{ marginBottom: "0.5rem" }}>OVERVIEW</p>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>Dashboard</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>Platform overview and pending actions</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {stats.map((stat, i) => (
          <div key={stat.label} className={`stat-card anim-fade-up`} style={{ animationDelay: `${i * 0.07}s` }}>
            <div style={{ width: "40px", height: "40px", background: `${stat.color}18`, border: `1px solid ${stat.color}30`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", marginBottom: "1rem" }}>{stat.icon}</div>
            <div style={{ fontSize: "2.25rem", fontWeight: 900, color: stat.color, lineHeight: 1, marginBottom: "0.375rem", letterSpacing: "-0.03em" }}>{stat.value}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="anim-fade-up" style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <Link href="/admin/new" className="btn btn-accent btn-sm">➕ Add Listing</Link>
        <Link href="/admin/listings" className="btn btn-outline btn-sm">📋 Manage Listings</Link>
        <Link href="/admin/landlords" className="btn btn-outline btn-sm">👥 Manage Landlords</Link>
      </div>

      {/* Pending Landlords */}
      {pendingLandlords.length > 0 && (
        <div className="anim-fade-up" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02))", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "var(--radius-xl)", padding: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)", animation: "pulse-dot 2s ease-in-out infinite" }} />
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--accent)" }}>Pending Approvals ({pendingLandlords.length})</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pendingLandlords.map((landlord) => (
              <div key={landlord.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(255,255,255,0.06)", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "38px", height: "38px", background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 800, color: "var(--accent)", flexShrink: 0 }}>
                    {landlord.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{landlord.name}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--accent)", fontWeight: 600 }}>📞 {landlord.phone || "No phone"}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Joined {new Date(landlord.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  {landlord.phone && (
                    <a href={`https://wa.me/${landlord.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", color: "white", boxShadow: "0 4px 12px rgba(37,211,102,0.25)" }}>💬 Chat</a>
                  )}
                  <button onClick={() => handleApproveLandlord(landlord.id)} className="btn btn-accent btn-sm">✅ Approve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Approvals (Listings) */}
      {pending > 0 && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(20,184,166,0.3)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text)" }}>
              🔔 Pending Listings ({pending})
            </h2>
            <Link href="/admin/listings" className="btn btn-accent btn-sm">
              Review All →
            </Link>
          </div>
          <p style={{ color: "var(--text-subtle)", fontSize: "0.9375rem" }}>
            New listings from landlords awaiting your review before going live.
          </p>
        </div>
      )}

      {/* Recent listings */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 700 }}>
            Recently Added
          </h2>
          <Link
            href="/admin/listings"
            style={{
              fontSize: "0.8125rem",
              color: "var(--primary)",
              textDecoration: "none",
            }}
          >
            View all →
          </Link>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "var(--bg-elevated)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
              }}
            >
              {["Title", "Location", "Price", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.75rem 1.5rem",
                    textAlign: "left",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((l, i) => (
              <tr
                key={l.id}
                style={{
                  borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  transition: "background 0.15s",
                }}
              >
                <td style={{ padding: "1rem 1.5rem" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)" }}>
                    {l.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>
                    Added {l.createdAt}
                  </div>
                </td>
                <td
                  style={{
                    padding: "1rem 1.5rem",
                    fontSize: "0.875rem",
                    color: "var(--text-subtle)",
                  }}
                >
                  {l.location}
                </td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>
                    {l.price.toLocaleString("fr-CM")} FCFA
                  </span>
                </td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <span className={`badge badge-${l.availability}`}>
                    {l.availability.charAt(0).toUpperCase() + l.availability.slice(1)}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      href={`/admin/edit/${l.id}`}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "0.3rem 0.625rem", fontSize: "0.8rem" }}
                    >
                      ✏️ Edit
                    </Link>
                    <Link
                      href={`/listing/${l.id}`}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "0.3rem 0.625rem", fontSize: "0.8rem" }}
                      target="_blank"
                    >
                      👁️ View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
