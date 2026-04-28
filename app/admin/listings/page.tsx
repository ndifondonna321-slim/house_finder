"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  getAllListings, 
  formatPrice, 
  roomTypeLabels, 
  updateListingStatus, 
  deleteListing,
  type Listing 
} from "@/lib/data";

export default function AdminListingsPage() {
  const [items, setItems] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchAll = async () => {
    setIsLoading(true);
    const data = await getAllListings();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const visible = items.filter(
    (l) =>
      (l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.location.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || l.status === statusFilter)
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing permanently?")) {
      const success = await deleteListing(id);
      if (success) {
        setItems((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert("Failed to delete listing");
      }
    }
  };

  const handleApprove = async (id: string) => {
    const success = await updateListingStatus(id, "approved");
    if (success) {
      setItems((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "approved" } : l
        )
      );
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Reason for rejection (optional):");
    if (reason === null) return; // User cancelled prompt

    const success = await updateListingStatus(id, "rejected", reason || undefined);
    if (success) {
      setItems((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "rejected", rejectionReason: reason || undefined } : l
        )
      );
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            Manage Listings
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
            {visible.length} listing{visible.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/new" className="btn btn-accent">
          ➕ Add New Listing
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1.5rem", maxWidth: "420px" }}>
        <span
          style={{
            position: "absolute",
            left: "0.875rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          type="search"
          className="input"
          placeholder="Search listings…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: "2.5rem" }}
          id="admin-listings-search"
        />
      </div>

      {/* Status Filter */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-subtle)" }}>
          Filter by Status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
          style={{ maxWidth: "200px" }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {visible.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🏚️</div>
            <p>No listings found.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                  {["Listing", "Type", "Price", "Distance", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "0.875rem 1.25rem", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((l, i) => (
                  <tr
                    key={l.id}
                    style={{
                      borderTop: i > 0 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    {/* Listing */}
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: "52px",
                            height: "42px",
                            borderRadius: "0.5rem",
                            overflow: "hidden",
                            flexShrink: 0,
                            position: "relative",
                          }}
                        >
                          <Image
                            src={l.images[0] || "https://picsum.photos/seed/placeholder/800/600"}
                            alt={l.title}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)" }}>
                            {l.title}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>
                            📍 {l.location}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", color: "var(--text-subtle)", whiteSpace: "nowrap" }}>
                      {roomTypeLabels[l.roomType]}
                    </td>

                    {/* Price */}
                    <td style={{ padding: "1rem 1.25rem", whiteSpace: "nowrap" }}>
                      <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>
                        {formatPrice(l.price)}
                      </span>
                    </td>

                    {/* Distance */}
                    <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      🚶 {l.distanceFromCampus} min
                    </td>

                    {/* Status */}
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span className={`badge badge-${l.status === "approved" ? "available" : l.status === "pending" ? "reserved" : "occupied"}`}>
                        {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "nowrap" }}>
                        {l.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(l.id)}
                              className="btn btn-success btn-sm"
                              style={{ padding: "0.35rem 0.625rem", fontSize: "0.8rem" }}
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleReject(l.id)}
                              className="btn btn-danger btn-sm"
                              style={{ padding: "0.35rem 0.625rem", fontSize: "0.8rem" }}
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                        <Link
                          href={`/admin/edit/${l.id}`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: "0.35rem 0.625rem", fontSize: "0.8rem" }}
                        >
                          ✏️ Edit
                        </Link>
                        <Link
                          href={`/listing/${l.id}`}
                          target="_blank"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "0.35rem 0.625rem", fontSize: "0.8rem" }}
                        >
                          👁️
                        </Link>
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: "0.35rem 0.625rem", fontSize: "0.8rem" }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1rem" }}>
        ⚠️ Delete and availability changes are local mock actions — Supabase DB will be connected soon.
      </p>
    </div>
  );
}
