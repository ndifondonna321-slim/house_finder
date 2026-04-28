"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/listings", label: "Browse Houses", roles: ["student", "admin"] },
  { href: "/saved", label: "Saved", roles: ["student", "admin"] },
  { href: "/profile", label: "Profile", roles: ["student", "landlord", "admin"] },
  { href: "/landlord", label: "My Listings", roles: ["landlord"] },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(8, 14, 26, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
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
          gap: "2rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: "34px",
              height: "34px",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              flexShrink: 0,
            }}
          >
            🏠
          </span>
          <span
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            Bambi<span style={{ color: "var(--primary)" }}>Homes</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flex: 1,
            justifyContent: "center",
          }}
          className="hidden-mobile"
        >
          {isAuthenticated && user && navLinks
            .filter((link) => !link.roles || link.roles.includes(user?.role || ""))
            .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.2s ease",
                color: isActive(link.href) ? "var(--primary)" : "var(--text-subtle)",
                background: isActive(link.href)
                  ? "rgba(20, 184, 166, 0.1)"
                  : "transparent",
                border: isActive(link.href)
                  ? "1px solid rgba(20,184,166,0.2)"
                  : "1px solid transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.2s ease",
                color: isActive("/admin") ? "var(--accent)" : "var(--text-muted)",
                background: isActive("/admin")
                  ? "rgba(245, 158, 11, 0.1)"
                  : "transparent",
                border: isActive("/admin")
                  ? "1px solid rgba(245,158,11,0.2)"
                  : "1px solid transparent",
              }}
            >
              ⚙ Admin Panel
            </Link>
          )}
        </div>

        {/* User Menu / CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          {isAuthenticated && user ? (
            <>
              <span
                className="hidden-mobile"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-subtle)",
                  paddingRight: "0.5rem",
                  borderRight: "1px solid var(--border-light)",
                }}
              >
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                className="hidden-mobile"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text-subtle)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor = "var(--text-muted)";
                  (e.target as HTMLButtonElement).style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
                  (e.target as HTMLButtonElement).style.color = "var(--text-subtle)";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <Link
                href="/"
                className="hidden-mobile"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text-subtle)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                Home
              </Link>
              <Link
                href="/login"
                className="btn btn-primary hidden-mobile"
                style={{
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                Login / Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="show-mobile"
          style={{
            background: "none",
            border: "1px solid var(--border-light)",
            borderRadius: "0.5rem",
            color: "var(--text)",
            padding: "0.5rem",
            cursor: "pointer",
            display: "none",
            fontSize: "1.25rem",
            lineHeight: 1,
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {isAuthenticated && user && navLinks
            .filter((link) => !link.roles || link.roles.includes(user?.role || ""))
            .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.9375rem",
                fontWeight: 500,
                textDecoration: "none",
                color: isActive(link.href) ? "var(--primary)" : "var(--text)",
                background: isActive(link.href)
                  ? "rgba(20, 184, 166, 0.1)"
                  : "transparent",
                border: isActive(link.href) ? "1px solid rgba(20,184,166,0.2)" : "1px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.9375rem",
                fontWeight: 500,
                textDecoration: "none",
                color: isActive("/admin") ? "var(--accent)" : "var(--text-muted)",
                background: isActive("/admin") ? "rgba(245, 158, 11, 0.1)" : "transparent",
                border: isActive("/admin") ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              ⚙ Admin Panel
            </Link>
          )}
          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0.5rem 0" }} />
          {user ? (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-subtle)",
                cursor: "pointer",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.9375rem",
                fontWeight: 500,
                transition: "all 0.2s ease",
                width: "100%",
                textAlign: "center",
              }}
            >
              Logout
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text-subtle)",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}
              >
                Home
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary"
                style={{ 
                  padding: "0.75rem 1rem", 
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Login / Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
