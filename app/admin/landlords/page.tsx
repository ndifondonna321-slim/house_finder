"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { type Profile } from "@/lib/data";
import { getAdminDataAction, updateLandlordStatusAction } from "../actions";

export default function AdminLandlordsPage() {
  const [landlords, setLandlords] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLandlords = async () => {
    setIsLoading(true);
    try {
      const result = await getAdminDataAction();
      if (result.success) {
        setLandlords(result.landlords || []);
      } else {
        console.error("Fetch landlords error:", result.error);
      }
    } catch (error) {
      console.error("Fetch landlords unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLandlords();
  }, []);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected" | "pending") => {
    setUpdatingId(id);
    const result = await updateLandlordStatusAction(id, status);
    
    if (result.success) {
      alert("Status updated successfully!");
      fetchLandlords();
    } else {
      alert(`Error: ${result.error || "Failed to update status."}\n\nPlease check your .env.local for SUPABASE_SERVICE_ROLE_KEY.`);
    }
    setUpdatingId(null);
  };

  const { user } = useAuth();

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" }}>

      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            Manage Landlords
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
            Approve or reject landlord accounts
          </p>
        </div>
        <Link href="/admin" className="btn btn-outline btn-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg-elevated)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
              <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600 }}>Name</th>
              <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600 }}>Joined</th>
              <th style={{ padding: "0.75rem 1.5rem", textAlign: "right", fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                  Loading landlords...
                </td>
              </tr>
            ) : landlords.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No landlords found.
                </td>
              </tr>
            ) : (
              landlords.map((landlord, i) => (
                <tr key={landlord.id} style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{landlord.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 500, marginTop: "0.25rem" }}>
                      📞 {landlord.phone || "No phone provided"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>ID: {landlord.id.slice(0, 8)}...</div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span className={`badge badge-${landlord.status === "approved" ? "available" : landlord.status === "pending" ? "reserved" : "occupied"}`}>
                      {landlord.status.charAt(0).toUpperCase() + landlord.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", color: "var(--text-subtle)" }}>
                    {new Date(landlord.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      {landlord.phone && (
                        <a 
                          href={`https://wa.me/${landlord.phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: "#25D366", color: "#25D366" }}
                        >
                          💬 Chat
                        </a>
                      )}
                      {landlord.status !== "approved" && (
                        <button 
                          onClick={() => handleStatusUpdate(landlord.id, "approved")} 
                          className="btn btn-primary btn-sm"
                          disabled={updatingId === landlord.id}
                        >
                          {updatingId === landlord.id ? "..." : "Approve"}
                        </button>
                      )}
                      {landlord.status !== "rejected" && (
                        <button 
                          onClick={() => handleStatusUpdate(landlord.id, "rejected")} 
                          className="btn btn-danger btn-sm"
                          disabled={updatingId === landlord.id}
                        >
                          {updatingId === landlord.id ? "..." : "Reject"}
                        </button>
                      )}
                      {landlord.status !== "pending" && (
                        <button 
                          onClick={() => handleStatusUpdate(landlord.id, "pending")} 
                          className="btn btn-ghost btn-sm"
                          disabled={updatingId === landlord.id}
                        >
                          {updatingId === landlord.id ? "..." : "Reset"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
