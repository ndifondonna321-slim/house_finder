"use client";

import Link from "next/link";

const footerLinks = [
  { href: "/listings", label: "Browse Houses" },
  { href: "/login",    label: "Sign In" },
  { href: "/signup",   label: "Register" },
];

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      background: "linear-gradient(to top, rgba(11,15,25,0.95), transparent)",
      padding: "3rem 1.5rem 2rem",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ width: "30px", height: "30px", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>🏠</div>
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
            Bambi<span style={{ color: "var(--primary)" }}>Homes</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {footerLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="footer-link"
              style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.8125rem", transition: "color 0.2s ease" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="divider" style={{ width: "100%", maxWidth: "400px" }} />

        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
          © {new Date().getFullYear()} BambiHomes · Trusted student housing in Bambili, Cameroon
        </p>
      </div>

      <style>{`
        .footer-link:hover { color: var(--primary) !important; }
      `}</style>
    </footer>
  );
}
