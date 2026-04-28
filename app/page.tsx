"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getFeaturedListings, formatPrice, roomTypeLabels, type Listing } from "@/lib/data";
import ListingCard from "@/components/ListingCard";

const steps = [
  {
    icon: "🔍",
    title: "Search",
    desc: "Browse verified listings filtered by price, location, and room type — all in one place.",
  },
  {
    icon: "📋",
    title: "Compare",
    desc: "View detailed photos, amenities, and distance from campus for every listing.",
  },
  {
    icon: "📞",
    title: "Contact",
    desc: "Reach the landlord directly via WhatsApp or phone — no middleman, no hidden fees.",
  },
];

const testimonials = [
  {
    name: "Nkemdirim Grace",
    dept: "Faculty of Sciences, Level 300",
    text: "I found my current room in less than an hour on BambiHomes. No stress, no scam — just a clean listing and a direct call to the landlord.",
    avatar: "N",
  },
  {
    name: "Fon Desmond",
    dept: "HTTTC, Level 200",
    text: "As a first-year student I had no idea how to find housing in Bambili. BambiHomes made the whole process easy and transparent.",
    avatar: "F",
  },
  {
    name: "Achu Celine",
    dept: "Faculty of Arts, Level 400",
    text: "The filters are fantastic. I searched specifically for a self-contain under 25k near campus and found exactly that in minutes.",
    avatar: "A",
  },
];

// CTA button that respects auth state
function HeroCTA() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push("/listings");
    } else {
      router.push("/login?redirect=/listings");
    }
  };

  return (
    <Link
      href={isAuthenticated ? "/listings" : "/login?redirect=/listings"}
      onClick={handleClick}
      className="btn btn-primary"
      id="hero-cta-btn"
    >
      🏠 Find a House Now
    </Link>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const data = await getFeaturedListings();
      setFeatured(data);
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="https://picsum.photos/seed/bambili-hero/1600/900"
            alt="Student housing in Bambili"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div
            className="hero-overlay"
            style={{ position: "absolute", inset: 0 }}
          />
          {/* dot grid decorative */}
          <div
            className="dot-grid"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.4,
            }}
          />
        </div>

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "5rem 1.5rem",
            width: "100%",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <span
              className="badge badge-featured anim-fade-up"
              style={{
                marginBottom: "1.5rem",
                display: "inline-flex",
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                background: "rgba(20, 184, 166, 0.15)",
                border: "1px solid rgba(20, 184, 166, 0.3)",
                borderRadius: "9999px",
              }}
            >
              ✨ Built for UBa Students
            </span>

            <h1
              className="anim-fade-up delay-100"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 4rem)",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-0.04em",
                marginBottom: "1.5rem",
                color: "var(--text)",
              }}
            >
              Find your perfect{" "}
              <span className="gradient-text" style={{ fontSize: "inherit" }}>student room</span>
              {" "}in Bambili
            </h1>

            <p
              className="anim-fade-up delay-200"
              style={{
                fontSize: "1.125rem",
                color: "var(--text-subtle)",
                lineHeight: 1.8,
                marginBottom: "2.5rem",
                maxWidth: "55ch",
                fontWeight: 400,
              }}
            >
              Verified listings, transparent pricing, and direct landlord contact. No agents, no hidden fees, no stress.
            </p>

            <div
              className="anim-fade-up delay-300"
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}
            >
              <HeroCTA />
              <Link
                href="#how-it-works"
                className="btn btn-outline"
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                See how it works →
              </Link>
            </div>

            {/* Stats bar */}
            <div
              className="anim-fade-up delay-400"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "2.5rem",
                marginTop: "4rem",
                maxWidth: "400px",
              }}
            >
              {[
                { value: "8+", label: "Verified Listings" },
                { value: "300+", label: "Students Housed" },
                { value: "100%", label: "Direct Landlords" },
              ].map((stat) => (
                <div key={stat.label} style={{ borderLeft: "2px solid var(--primary)", paddingLeft: "1rem" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "var(--primary)",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem", fontWeight: 500 }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it Works ──────────────────────────────────────── */}
      <section
        style={{
          padding: "7rem 1.5rem",
          background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(20, 184, 166, 0.02) 100%)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: 600 }}>
              OUR PROCESS
            </p>
            <h2 className="section-title" style={{ marginBottom: "1.25rem", fontSize: "2.25rem", fontWeight: 800 }}>
              How BambiHomes Works
            </h2>
            <p className="section-desc" style={{ margin: "0 auto", fontSize: "1.0625rem", color: "var(--text-subtle)" }}>
              Find your next home in three simple steps.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="card-lift"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "2.5rem",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = "0 12px 24px rgba(20, 184, 166, 0.15)";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Step number watermark */}
                <span
                  style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    fontSize: "3.5rem",
                    fontWeight: 900,
                    color: "rgba(20,184,166,0.08)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </span>

                <div
                  style={{
                    fontSize: "2.75rem",
                    marginBottom: "1.25rem",
                    display: "inline-block",
                  }}
                >
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                    color: "var(--text)",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: "var(--text-subtle)", lineHeight: 1.7, fontSize: "0.9375rem", fontWeight: 400 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Listings ─────────────────────────────────── */}
      <section style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2.5rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p className="section-label" style={{ marginBottom: "0.5rem" }}>
                Verified Properties
              </p>
              <h2 className="section-title">Available Student Housing</h2>
            </div>
            <Link href="/listings" className="btn btn-outline btn-sm">
              View all listings →
            </Link>
          </div>

          {/* Featured listings section */}
          {featured.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "var(--bg-card)",
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "4rem 2rem",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(20,184,166,0.02) 0%, rgba(13,148,136,0.01) 100%)",
                  opacity: 0.5,
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🏠</div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "var(--text)",
                  }}
                >
                  Featured listings arriving soon
                </h3>
                <p
                  style={{
                    color: "var(--text-subtle)",
                    fontSize: "1rem",
                    marginBottom: "2rem",
                    maxWidth: "48ch",
                    margin: "0 auto 2rem",
                  }}
                >
                  We are currently verifying the latest housing options in Bambili. 
                  Check back in a few minutes or browse all listings now.
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <HeroCTA />
                  <Link href="/listings" className="btn btn-outline">
                    Browse All Listings
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section
        style={{
          padding: "7rem 1.5rem",
          background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(13, 148, 136, 0.02) 100%)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: 600 }}>
              STUDENT REVIEWS
            </p>
            <h2 className="section-title" style={{ marginBottom: "1rem", fontSize: "2.25rem", fontWeight: 800 }}>
              What Students Say About BambiHomes
            </h2>
            <p style={{ color: "var(--text-subtle)", fontSize: "1.0625rem" }}>Real feedback from real students who found housing.</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="glass"
                style={{
                  borderRadius: "var(--radius-lg)",
                  padding: "2.5rem",
                  border: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "0 12px 24px rgba(20, 184, 166, 0.12)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)";
                }}
              >
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ fontSize: "1.1rem" }}>⭐</span>
                  ))}
                </div>
                <p
                  style={{
                    color: "var(--text)",
                    lineHeight: 1.8,
                    fontSize: "1rem",
                    marginBottom: "1.75rem",
                    fontWeight: 500,
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                      {t.dept}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section style={{ padding: "7rem 1.5rem", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(13,148,136,0.08) 100%)",
              border: "1px solid rgba(20,184,166,0.25)",
              borderRadius: "var(--radius-xl)",
              padding: "5rem 3rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="dot-grid"
              style={{ position: "absolute", inset: 0, opacity: 0.3 }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 900,
                  marginBottom: "1.25rem",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                Ready to find your home <span className="gradient-text">in Bambili?</span>
              </h2>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "var(--text-subtle)",
                  marginBottom: "2.5rem",
                  maxWidth: "52ch",
                  margin: "0 auto 2.5rem",
                  fontWeight: 400,
                }}
              >
                Join hundreds of students who have found their perfect housing. Browse verified listings today.
              </p>
              <Link
                href="/listings"
                className="btn btn-accent"
                id="cta-find-house-btn"
                style={{
                  padding: "0.875rem 1.75rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                🏠 Explore All Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
