"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin",           label: "Dashboard",       icon: "📊", exact: true },
  { href: "/admin/listings",  label: "Manage Listings", icon: "🏠" },
  { href: "/admin/landlords", label: "Landlords",       icon: "👥" },
  { href: "/admin/new",       label: "Add Listing",     icon: "➕" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: "230px",
        flexShrink: 0,
        background: "linear-gradient(180deg, var(--bg-card) 0%, rgba(8,14,26,0.99) 100%)",
        borderRight: "1px solid var(--border)",
        padding: "1.25rem 0.875rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        position: "sticky",
        top: "64px",
        height: "calc(100vh - 64px)",
        overflowY: "auto",
      }}>

        {/* Admin badge */}
        <div style={{
          padding: "0.875rem 1rem",
          background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.05))",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "var(--radius-lg)",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          boxShadow: "0 4px 16px rgba(245,158,11,0.08)",
        }}>
          <div style={{
            width: "34px", height: "34px",
            background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
            borderRadius: "9px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
            boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
            flexShrink: 0,
          }}>⚙️</div>
          <div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.01em" }}>Admin Panel</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Platform Management</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", padding: "0.5rem 0.875rem 0.25rem", marginTop: "0.25rem" }}>
            Navigation
          </p>
          {adminLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "var(--radius)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--accent)" : "var(--text-subtle)",
                  background: active ? "rgba(245,158,11,0.1)" : "transparent",
                  border: `1px solid ${active ? "rgba(245,158,11,0.2)" : "transparent"}`,
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-subtle)";
                  }
                }}
              >
                <span style={{ fontSize: "1rem", opacity: active ? 1 : 0.7 }}>{link.icon}</span>
                {link.label}
                {active && (
                  <div style={{
                    position: "absolute", right: "0.875rem",
                    width: "6px", height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    boxShadow: "0 0 8px var(--accent)",
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom — Back to site */}
        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <div className="divider" style={{ marginBottom: "0.875rem" }} />
          <Link
            href="/listings"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.625rem 0.875rem",
              borderRadius: "var(--radius)",
              textDecoration: "none",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              transition: "all 0.2s ease",
              background: "transparent",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(20,184,166,0.3)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(20,184,166,0.06)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            }}
          >
            <span>←</span> Back to Site
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        padding: "2rem 2.5rem",
        minWidth: 0,
        overflowX: "hidden",
        background: "radial-gradient(ellipse 70% 40% at 70% 0%, rgba(245,158,11,0.04), transparent)",
      }}>
        {children}
      </main>
    </div>
  );
}
