"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSavedListings } from "@/hooks/useSavedListings";
import { getAllApprovedListings } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, logout, refreshProfile } = useAuth();
  const { saved } = useSavedListings();
  const [listingStats, setListingStats] = useState({
    total: 0,
    available: 0
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    const file = files[0];
    if (file.size > 1024 * 1024 * 2) {
      setUploadError("Image size must be less than 2MB.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        setUploadError("Failed to upload image to storage.");
        setIsUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (dbError) {
        console.error("DB update error details:", dbError);
        setUploadError("Database update failed. Make sure table columns are updated.");
      } else {
        await refreshProfile();
      }
    } catch (err: any) {
      console.error("Profile picture upload failed:", err);
      setUploadError("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    async function fetchStats() {
      const all = await getAllApprovedListings();
      setListingStats({
        total: all.length,
        available: all.filter(l => l.availability === "available").length
      });
    }
    fetchStats();
  }, []);

  if (!user) return null;

  const savedCount = saved.length;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <p className="section-label" style={{ marginBottom: "0.375rem" }}>
          Account
        </p>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 800,
          }}
        >
          My Profile
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
        {/* Avatar card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              margin: "0 auto 1.25rem",
              boxShadow: "0 0 0 4px rgba(20,184,166,0.2)",
            }}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                {user.name.charAt(0)}
              </div>
            )}

            {(user.role === "admin" || user.role === "landlord" || user.role === "student") && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    right: "-4px",
                    background: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    transition: "all 0.2s ease",
                    zIndex: 10,
                  }}
                  title="Upload Profile Picture"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--primary-dark)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
                  }}
                >
                  {isUploading ? "⏳" : "📷"}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </>
            )}
          </div>
          {uploadError && (
            <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "-0.5rem", marginBottom: "1rem" }}>
              {uploadError}
            </p>
          )}
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              marginBottom: "0.25rem",
              color: "var(--text)",
            }}
          >
            {user.name}
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            {user.email}
          </p>
          <div
            className="badge badge-featured"
            style={{ display: "inline-flex", marginBottom: "1.5rem", textTransform: "capitalize" }}
          >
            {user.role === "student" ? "🎓 Student" : user.role === "landlord" ? "🏠 Landlord" : "🛡️ Admin"}
          </div>

          <div className="divider" style={{ marginBottom: "1.5rem" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", textAlign: "left" }}>
            {[
              { icon: "🏛️", label: "Faculty", value: user.faculty || "Not set" },
              { icon: "📚", label: "Level", value: user.level || "Not set" },
            ].map((row) => (
              <div key={row.label}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.125rem" }}>
                  {row.icon} {row.label}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--text)", fontWeight: 500 }}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>
          <div className="divider" style={{ margin: "1.5rem 0" }} />

          <button
            className="btn btn-danger btn-sm"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => logout()}
          >
            🚪 Sign Out
          </button>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { icon: "❤️", value: savedCount, label: "Saved Houses" },
              { icon: "👁️", value: listingStats.total, label: "Total Listings" },
              { icon: "✅", value: listingStats.available, label: "Available Now" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "0.375rem" }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    color: "var(--primary)",
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
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                marginBottom: "1.25rem",
              }}
            >
              Quick Actions
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { href: "/listings", icon: "🏠", label: "Browse all listings" },
                { href: "/saved", icon: "❤️", label: "View my saved listings" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.875rem 1rem",
                    borderRadius: "var(--radius)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--text)",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{action.icon}</span>
                  {action.label}
                  <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Role-based shortcuts */}
          {user.role === "landlord" && (
            <Link href="/landlord" className="btn btn-primary" style={{ justifyContent: "center" }}>
              📊 Go to Landlord Dashboard
            </Link>
          )}
          {user.role === "admin" && (
            <Link href="/admin" className="btn btn-accent" style={{ justifyContent: "center" }}>
              🛠️ Go to Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
