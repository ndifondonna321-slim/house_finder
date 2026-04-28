"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/listings", label: "Manage Listings", icon: "🏠" },
  { href: "/admin/new", label: "Add Listing", icon: "➕" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          background: "var(--bg-card)",
          borderRight: "1px solid var(--border)",
          padding: "1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.375rem",
          position: "sticky",
          top: "64px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        {/* Admin badge */}
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "var(--radius)",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
          }}
        >
          <span style={{ fontSize: "1.125rem" }}>⚙️</span>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)" }}>
              Admin Panel
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
              Platform Management
            </div>
          </div>
        </div>

        {adminLinks.map((link) => (
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
              fontSize: "0.9rem",
              fontWeight: isActive(link.href, link.exact) ? 600 : 400,
              color: isActive(link.href, link.exact)
                ? "var(--accent)"
                : "var(--text-subtle)",
              background: isActive(link.href, link.exact)
                ? "rgba(245,158,11,0.1)"
                : "transparent",
              border: isActive(link.href, link.exact)
                ? "1px solid rgba(245,158,11,0.2)"
                : "1px solid transparent",
              transition: "all 0.2s",
            }}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}

        <div className="divider" style={{ margin: "0.75rem 0" }} />

        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.625rem 0.875rem",
            borderRadius: "var(--radius)",
            textDecoration: "none",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            transition: "all 0.2s",
          }}
        >
          <span>←</span> Back to Site
        </Link>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "2rem", minWidth: 0, overflowX: "hidden" }}>
        {children}
      </main>
    </div>
  );
}
