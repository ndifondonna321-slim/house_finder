"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllListings, getAllLandlords, updateLandlordStatus, type Listing, type Profile } from "@/lib/data";

export default function AdminDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [landlords, setLandlords] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = async () => {
    setIsLoading(true);
    const [listingsData, landlordsData] = await Promise.all([
      getAllListings(),
      getAllLandlords()
    ]);
    setListings(listingsData);
    setLandlords(landlordsData);
    setIsLoading(false);
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
    const success = await updateLandlordStatus(id, "approved");
    if (success) {
      fetchAll();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
          Overview of all listings on BambiHomes
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
            }}
          >
            <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{stat.icon}</div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                color: stat.color,
                lineHeight: 1,
                marginBottom: "0.25rem",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <Link href="/admin/new" className="btn btn-accent">
          ➕ Add New Listing
        </Link>
        <Link href="/admin/listings" className="btn btn-outline">
          📋 Manage Listings
        </Link>
        <Link href="/admin/landlords" className="btn btn-outline">
          👥 Manage Landlords
        </Link>
      </div>

      {/* Pending Landlords */}
      {pendingLandlords.length > 0 && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(245,158,11,0.3)",
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
              🛡️ Pending Landlord Approvals ({pendingLandlords.length})
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {pendingLandlords.map((landlord) => (
              <div 
                key={landlord.id}
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "1rem",
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{landlord.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Joined {new Date(landlord.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button 
                    onClick={() => handleApproveLandlord(landlord.id)}
                    className="btn btn-primary btn-sm"
                  >
                    ✅ Approve
                  </button>
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
