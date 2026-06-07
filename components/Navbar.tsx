"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "./NotificationBell";

const navLinks = [
  { href: "/listings", label: "Browse Houses", icon: "🔍", roles: ["student", "landlord", "admin"] },
  { href: "/saved",    label: "Saved",         icon: "❤️", roles: ["student", "admin"] },
  { href: "/profile",  label: "Profile",       icon: "👤", roles: ["student", "landlord", "admin"] },
  { href: "/landlord", label: "My Listings",   icon: "📋", roles: ["landlord"] },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on nav
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const visibleLinks = isAuthenticated && user
    ? navLinks.filter(l => !l.roles || l.roles.includes(user.role || ""))
    : [];

  const isHome = pathname === "/";
  // On the home page, start fully transparent so the hero image shows through the navbar
  const navBg = scrolled
    ? "rgba(11, 15, 25, 0.95)"
    : isHome
    ? "transparent"
    : "rgba(11, 15, 25, 0.8)";
  const navBorder = scrolled
    ? "1px solid rgba(255, 255, 255, 0.08)"
    : "1px solid transparent";

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navBg,
          backdropFilter: scrolled || !isHome ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled || !isHome ? "blur(24px) saturate(180%)" : "none",
          borderBottom: navBorder,
          transition: "background 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.4s ease",
          boxShadow: scrolled ? "0 4px 6px -1px rgba(15,23,42,0.2)" : "none",
        }}
      >
        <nav
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          {/* ── Home Button (Replaced Logo) ── */}
          <Link 
            href="/" 
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span style={{ fontSize: "1rem" }}>🏠</span> 
            <span style={{ fontWeight: 600 }}>Home</span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1, justifyContent: "center" }}
            className="hidden-mobile"
          >
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.875rem",
                  fontWeight: isActive(link.href) ? 600 : 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  color: isActive(link.href) ? "var(--primary-light)" : "var(--text-subtle)",
                  background: isActive(link.href) ? "rgba(59, 130, 246, 0.1)" : "transparent",
                  border: isActive(link.href) ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                  position: "relative",
                }}
              >
                <span style={{ fontSize: "0.85rem" }}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.875rem",
                  fontWeight: isActive("/admin") ? 600 : 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  color: isActive("/admin") ? "var(--accent)" : "var(--text-muted)",
                  background: isActive("/admin") ? "rgba(245, 158, 11, 0.1)" : "transparent",
                  border: isActive("/admin") ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
                }}
              >
                <span style={{ fontSize: "0.85rem" }}>⚙️</span> Admin
              </Link>
            )}
          </div>

          {/* ── User Section ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }} className="hidden-mobile">
            {isAuthenticated && user ? (
              <>
                <NotificationBell />
                {/* User pill */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.375rem 0.875rem 0.375rem 0.375rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: "9999px",
                }}>
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "28px",
                      height: "28px",
                      background: "linear-gradient(135deg, var(--primary-dark), var(--primary))",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-subtle)" }}>
                    {user.name.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    background: "transparent",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.4)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.06)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Link
                  href="/login"
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    background: "transparent",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-subtle)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-light)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-subtle)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-light)";
                  }}
                >
                  Sign in
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm">
                  Register →
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              background: menuOpen ? "rgba(59,130,246,0.1)" : "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${menuOpen ? "rgba(59,130,246,0.3)" : "var(--border)"}`,
              borderRadius: "var(--radius-sm)",
              color: menuOpen ? "var(--primary)" : "var(--text-subtle)",
              padding: "0.5rem 0.625rem",
              cursor: "pointer",
              display: "none",
              fontSize: "1.1rem",
              lineHeight: 1,
              transition: "all 0.2s ease",
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* ── Mobile Menu ── */}
        <div
          style={{
            display: menuOpen ? "flex" : "none",
            flexDirection: "column",
            padding: "0.75rem 1rem 1.25rem",
            gap: "0.25rem",
            background: "rgba(11, 15, 25, 0.98)",
            borderTop: "1px solid var(--border)",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
            animation: "fadeInDown 0.2s ease both",
          }}
        >
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius)",
                fontSize: "0.9375rem",
                fontWeight: isActive(link.href) ? 600 : 500,
                textDecoration: "none",
                color: isActive(link.href) ? "var(--primary-light)" : "var(--text)",
                background: isActive(link.href) ? "rgba(59,130,246,0.1)" : "transparent",
                border: isActive(link.href) ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius)",
                fontSize: "0.9375rem",
                fontWeight: 500,
                textDecoration: "none",
                color: isActive("/admin") ? "var(--accent)" : "var(--text-muted)",
                background: isActive("/admin") ? "rgba(245, 158, 11, 0.1)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              <span>⚙️</span> Admin Panel
            </Link>
          )}

          <div className="divider" style={{ margin: "0.5rem 0" }} />

          {user ? (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
                cursor: "pointer",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius)",
                fontSize: "0.9375rem",
                fontWeight: 500,
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              🚪 Sign out
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline" style={{ justifyContent: "center" }}>
                Sign in
              </Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ justifyContent: "center" }}>
                Create Account →
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
