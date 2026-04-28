"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getLandlordListings, deleteListing, type Listing } from "@/lib/data";

export default function LandlordDashboard() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (user?.id) {
        setIsLoading(true);
        const data = await getLandlordListings(user.id);
        setMyListings(data);
        setIsLoading(false);
      }
    };
    fetchMyListings();
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      const success = await deleteListing(id);
      if (success) {
        setMyListings((prev) => prev.filter((l) => l.id !== id));
      }
    }
  };

  const pendingListings = myListings.filter((l) => l.status === "pending");
  const approvedListings = myListings.filter((l) => l.status === "approved");
  const rejectedListings = myListings.filter((l) => l.status === "rejected");

  if (user?.status !== "approved") {
    return (
      <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>⏳</div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1rem" }}>
          Account Pending Approval
        </h1>
        <p style={{ color: "var(--text-subtle)", fontSize: "1.125rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          Hi {user?.name.split(" ")[0]}, your landlord account is currently being reviewed by our administration. 
          You will be able to upload and manage your property listings once your account has been verified.
        </p>
        <div style={{ padding: "1.5rem", background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.2)", borderRadius: "var(--radius-lg)" }}>
          <p style={{ fontSize: "0.9375rem", color: "var(--text)", fontWeight: 500 }}>
            Need help? Contact support at <span style={{ color: "var(--primary)" }}>support@bambihomes.cm</span>
          </p>
        </div>
        <Link href="/" className="btn btn-outline" style={{ marginTop: "2rem" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          Welcome back, {user?.name.split(" ")[0]}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
          Manage your Bambili property listings
        </p>
      </div>

      {/* Quick stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: "Total Listings", value: myListings.length, icon: "🏠", color: "var(--primary)" },
          { label: "Approved", value: approvedListings.length, icon: "✅", color: "#34d399" },
          { label: "Pending Review", value: pendingListings.length, icon: "⏳", color: "#fbbf24" },
          { label: "Rejected", value: rejectedListings.length, icon: "❌", color: "#f87171" },
        ].map((stat) => (
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
          ➕ Upload New Listing
        </Link>
        <Link href="/listings" className="btn btn-outline">
          👁️ View All Listings
        </Link>
      </div>

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
          }}
        >
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 700 }}>
            Your Listings
          </h2>
        </div>

        {myListings.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏠</div>
            <p style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              No listings yet
            </p>
            <p style={{ fontSize: "0.9375rem" }}>
              Start by uploading your first property in Bambili.
            </p>
            <Link href="/admin/new" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Upload Listing
            </Link>
          </div>
        ) : (
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
              {myListings.map((l, i) => (
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
                    <span className={`badge badge-${l.status === "approved" ? "available" : l.status === "pending" ? "reserved" : "occupied"}`}>
                      {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
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
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: "0.3rem 0.625rem", fontSize: "0.8rem" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Notice */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.25rem 1.5rem",
          background: "rgba(20,184,166,0.06)",
          border: "1px solid rgba(20,184,166,0.2)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>ℹ️</span>
        <div>
          <p style={{ fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.9375rem" }}>
            Fast-Track Approval Enabled
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-subtle)", lineHeight: 1.6 }}>
            Since your account is verified, your property listings will now appear <strong>instantly</strong> on the home page.
            New listings from unverified accounts still require manual review for safety.
          </p>
        </div>
      </div>
    </div>
  );
}