"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFeaturedListings, getWebsiteReviews, submitWebsiteReview, type Listing, type WebsiteReview } from "@/lib/data";
import ListingCard from "@/components/ListingCard";

/* ──────────────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────────────── */
const whyItems = [
  {
    icon: "🛡️",
    title: "100% Verified Listings",
    desc: "Every property is personally reviewed before going live. No fake listings, no scams.",
  },
  {
    icon: "💬",
    title: "Direct Landlord Contact",
    desc: "Chat directly with property owners via WhatsApp. No middlemen, no extra charges.",
  },
  {
    icon: "📍",
    title: "Campus-Focused Search",
    desc: "Every listing shows exact walking distance from UBa campus, so you always know where you stand.",
  },
  {
    icon: "💰",
    title: "Transparent Pricing",
    desc: "What you see is what you pay. Prices are set by landlords with no hidden fees.",
  },
  {
    icon: "🔍",
    title: "Smart Filters",
    desc: "Filter by room type, price, distance, and availability to find exactly what you need.",
  },
  {
    icon: "⚡",
    title: "Free for Students",
    desc: "Creating an account, browsing listings, and contacting landlords is completely free.",
  },
];

const steps = [
  {
    num: "01",
    icon: "🔍",
    title: "Create a Free Account",
    desc: "Sign up in seconds with your student email. No credit card, no commitment required.",
  },
  {
    num: "02",
    icon: "📋",
    title: "Browse & Filter Listings",
    desc: "Use smart filters to narrow down by price, room type, and walking distance from campus.",
  },
  {
    num: "03",
    icon: "📞",
    title: "Contact the Landlord",
    desc: "Found the perfect room? Tap to open WhatsApp and speak directly with the property owner.",
  },
];

const testimonials = [
  {
    name: "Nkemdirim Grace",
    dept: "Faculty of Sciences · Level 300",
    text: "Found my current room in less than an hour on BambiHomes. No stress, no scam — just a clean listing and a direct call to the landlord.",
    avatar: "N",
    hue: 220,
  },
  {
    name: "Fon Desmond",
    dept: "HTTTC Bambili · Level 200",
    text: "As a first-year student I had no idea how to find housing in Bambili. BambiHomes made the whole process easy and totally transparent.",
    avatar: "F",
    hue: 250,
  },
  {
    name: "Achu Celine",
    dept: "Faculty of Arts · Level 400",
    text: "The filters are fantastic. I searched for a self-contain under 25k near campus and found exactly that in minutes.",
    avatar: "A",
    hue: 200,
  },
];

const stats = [
  { value: "8+", label: "Active Listings" },
  { value: "300+", label: "Students Helped" },
  { value: "100%", label: "Verified" },
  { value: "Free", label: "Always" },
];

/* ──────────────────────────────────────────────────────────────────
   AUTH-AWARE CTA
────────────────────────────────────────────────────────────────── */
function CTAButton({
  label,
  variant = "primary",
  size = "lg",
}: {
  label: string;
  variant?: "primary" | "outline";
  size?: "sm" | "lg";
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const dest = isAuthenticated ? "/listings" : "/login?redirect=/listings";
  const pad = size === "lg" ? "1rem 2.25rem" : "0.75rem 1.625rem";
  const fs = size === "lg" ? "1rem" : "0.9375rem";

  return (
    <button
      onClick={() => router.push(dest)}
      className={`btn btn-${variant}`}
      style={{ padding: pad, fontSize: fs, fontWeight: 700 }}
    >
      {label}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<WebsiteReview[]>([]);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchReviews = () => {
    getWebsiteReviews().then((data) => {
      setReviews(data);
    });
  };

  useEffect(() => {
    getFeaturedListings().then(setFeatured);
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (comment.trim().length < 10) {
      setSubmitError("Please write a review of at least 10 characters.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    const res = await submitWebsiteReview(user.id, rating, comment);
    setIsSubmitting(false);
    if (res.success) {
      setSubmitSuccess(true);
      setComment("");
      setRating(5);
      fetchReviews();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } else {
      setSubmitError(res.error || "Failed to submit review. If you haven't setup the reviews table in Supabase, please run the SQL script.");
    }
  };

  return (
    <main style={{ fontFamily: "inherit" }}>

      {/* ╔══════════════════════════════════════════════════════════╗
          ║  1. HERO                                                 ║
          ╚══════════════════════════════════════════════════════════╝ */}
      <section style={{
        minHeight: "100vh",
        marginTop: "-64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "calc(64px + 7rem) 1.5rem 6rem",
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}>
        {/* Primary dark overlay for readability */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg, rgba(4,8,18,0.84) 0%, rgba(8,15,32,0.72) 50%, rgba(4,8,18,0.88) 100%)", pointerEvents: "none" }} />
        {/* Subtle dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        {/* Bottom fade into next section */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", background: "linear-gradient(to bottom, transparent, #111827)", pointerEvents: "none" }} />
        {/* Blue ambient glow top-left */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "480px", height: "480px", background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
        {/* Amber glow bottom-right */}
        <div style={{ position: "absolute", bottom: "8%", right: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "860px" }}>

          {/* Headline */}
          <h1 className="anim-fade-up delay-100" style={{
            fontSize: "clamp(1.75rem, 7vw, 5.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            color: "#f1f5f9",
            marginBottom: "1.5rem",
            wordBreak: "break-word"
          }}>
            Find your perfect{" "}
            <span style={{
              background: "linear-gradient(120deg, #93c5fd 0%, #3b82f6 45%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              student room
            </span>
            <br />in Bambili
          </h1>

          {/* Subheading */}
          <p className="anim-fade-up delay-200" style={{
            fontSize: "clamp(0.85rem, 2.2vw, 1.1875rem)",
            color: "#94a3b8",
            lineHeight: 1.7,
            maxWidth: "52ch",
            margin: "0 auto 2.5rem",
            fontWeight: 400,
            padding: "0 0.5rem"
          }}>
            Verified listings, transparent pricing, and direct landlord contact.
            No agents. No hidden fees. Just housing that works.
          </p>

          {/* CTA row */}
          <div className="anim-fade-up delay-300" style={{
            display: "flex", gap: "0.75rem", justifyContent: "center",
            flexWrap: "wrap", marginBottom: "4rem",
          }}>
            <CTAButton label="🏠 Browse All Listings" />
            <Link href="#how-it-works" className="btn btn-outline" style={{ padding: "0.875rem 1.5rem", fontSize: "0.9375rem", fontWeight: 600 }}>
              See how it works
            </Link>
          </div>

          {/* Stats row */}
          <div className="anim-fade-up delay-400" style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "1.125rem",
            overflow: "hidden",
          }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                padding: "1.375rem 2.25rem",
                textAlign: "center",
                borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}>
                <div style={{ fontSize: "1.875rem", fontWeight: 900, color: "#93c5fd", lineHeight: 1, letterSpacing: "-0.04em" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", marginTop: "0.4rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗
          ║  2. WHY BAMBIHOMES  — Value propositions grid            ║
          ╚══════════════════════════════════════════════════════════╝ */}
      <section style={{ padding: "7rem 1.5rem", background: "#111827", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "0.75rem" }}>
              Why BambiHomes
            </p>
            <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#f1f5f9", marginBottom: "1rem" }}>
              The smarter way to find student housing
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1.0625rem", maxWidth: "46ch", margin: "0 auto" }}>
              We built BambiHomes to solve the exact problems UBa students face every year.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {whyItems.map((item, i) => (
              <div key={item.title} style={{
                background: "#0b0f19",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1.125rem",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
                transition: "border-color 0.2s ease, transform 0.2s ease",
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(59,130,246,0.3)";
                  el.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "46px", height: "46px",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.18)",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.375rem",
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em" }}>
                  {item.title}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗
          ║  3. HOW IT WORKS                                         ║
          ╚══════════════════════════════════════════════════════════╝ */}
      <section id="how-it-works" style={{ padding: "7rem 1.5rem", background: "#0b0f19", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "4rem" }}>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "0.75rem" }}>
                Our Process
              </p>
              <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#f1f5f9" }}>
                Get housed in 3 simple steps
              </h2>
            </div>
            <CTAButton label="Get Started →" size="sm" variant="outline" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.5rem" }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1.25rem",
                padding: "2.25rem",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 0.2s ease, transform 0.2s ease",
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(59,130,246,0.3)";
                  el.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  position: "absolute", top: "-1rem", right: "1.5rem",
                  fontSize: "6rem", fontWeight: 900,
                  color: "rgba(59,130,246,0.04)",
                  lineHeight: 1, userSelect: "none", fontFamily: "monospace",
                }}>
                  {s.num}
                </div>
                <div style={{ position: "absolute", top: 0, right: 0, width: "140px", height: "140px", background: `radial-gradient(circle at top right, rgba(59,130,246,${0.05 + i * 0.025}), transparent 70%)`, pointerEvents: "none" }} />

                <div style={{
                  width: "52px", height: "52px",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  borderRadius: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", marginBottom: "1.75rem",
                }}>
                  {s.icon}
                </div>

                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#60a5fa", marginBottom: "0.625rem" }}>
                  Step {i + 1} of 3
                </p>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
                  {s.title}
                </h3>
                <p style={{ color: "#94a3b8", lineHeight: 1.75, fontSize: "0.9375rem" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗
          ║  4. FEATURED LISTINGS                                    ║
          ╚══════════════════════════════════════════════════════════╝ */}
      <section style={{ padding: "7rem 1.5rem", background: "#111827", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "0.5rem" }}>
                Verified Properties
              </p>
              <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#f1f5f9" }}>
                Available Student Housing
              </h2>
            </div>
            <Link href="/listings" className="btn btn-outline btn-sm">View all listings →</Link>
          </div>

          {featured.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {featured.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div style={{
              padding: "4.5rem 2rem", textAlign: "center",
              border: "2px dashed rgba(255,255,255,0.06)",
              borderRadius: "1.25rem",
            }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>🏠</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.625rem" }}>
                Featured listings arriving soon
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.9375rem", maxWidth: "38ch", margin: "0 auto 2rem" }}>
                We&apos;re verifying the latest options. Browse all available listings now.
              </p>
              <Link href="/listings" className="btn btn-primary btn-sm">Browse All Listings</Link>
            </div>
          )}
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗
          ║  5. TESTIMONIALS & REVIEWS                               ║
          ╚══════════════════════════════════════════════════════════╝ */}
      <section style={{ padding: "7rem 1.5rem", background: "#0b0f19", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "0.75rem" }}>
              Student Reviews
            </p>
            <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "#f1f5f9", marginBottom: "1rem" }}>
              Trusted by students across UBa
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1.0625rem", maxWidth: "44ch", margin: "0 auto" }}>
              Real feedback from students who found their housing on BambiHomes.
            </p>
          </div>

          {/* Website Review Form - Visible for registered students and landlords */}
          {(user?.role === "student" || user?.role === "landlord") && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "1.25rem",
                padding: "2.5rem",
                marginBottom: "4rem",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                backdropFilter: "blur(4px)",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.5rem" }}>
                How was your experience with BambiHomes?
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Leave a review about our platform to help other students find better housing!
              </p>

              {submitSuccess && (
                <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "1rem", borderRadius: "var(--radius)", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
                  ✅ Thank you! Your review has been submitted successfully and is now live.
                </div>
              )}

              {submitError && (
                <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "1rem", borderRadius: "var(--radius)", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
                  ⚠️ {submitError}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Star rating selector */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                    Your Rating
                  </label>
                  <div style={{ display: "flex", gap: "0.375rem" }}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isHighlighted = hoverRating ? star <= hoverRating : star <= rating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "2rem",
                            color: isHighlighted ? "#f59e0b" : "#475569",
                            padding: "0",
                            transition: "transform 0.15s ease, color 0.15s ease",
                            transform: isHighlighted ? "scale(1.15)" : "scale(1)",
                            textShadow: isHighlighted ? "0 0 10px rgba(245, 158, 11, 0.4)" : "none",
                          }}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment area */}
                <div className="form-group">
                  <label htmlFor="comment" className="form-label">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked, what we can improve, or how BambiHomes helped you find your room..."
                    required
                    rows={4}
                    className="input"
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      background: "var(--bg-input)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "var(--radius)",
                      color: "var(--text)",
                      fontFamily: "inherit",
                      fontSize: "0.9375rem",
                      resize: "vertical",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    alignSelf: "flex-start",
                    padding: "0.75rem 2rem",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="spinner spinner-sm" /> Submitting...
                    </span>
                  ) : "Submit Review →"}
                </button>
              </form>
            </div>
          )}

          {/* Testimonials/Reviews Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "1.5rem" }}>
            {reviews.length > 0
              ? reviews.map((r) => {
                  const initials = r.name ? r.name.charAt(0).toUpperCase() : "S";
                  const hue = (r.name.charCodeAt(0) * 13) % 360;
                  const formattedDept = r.role === "admin"
                    ? "Administrator"
                    : r.role === "landlord"
                    ? "Property Owner"
                    : `${r.faculty || "UBa Student"}${r.level ? ` · Level ${r.level}` : ""}`;
                  return (
                    <div key={r.id} style={{
                      background: "#111827",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "1.25rem",
                      padding: "2.25rem",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "var(--shadow-md)",
                    }}>
                      <div style={{ position: "absolute", top: 0, right: "1.25rem", fontSize: "7rem", fontWeight: 900, color: "rgba(255,255,255,0.02)", lineHeight: 1, userSelect: "none", fontFamily: "Georgia, serif" }}>&ldquo;</div>

                      {/* Stars */}
                      <div style={{ display: "flex", gap: "2px", marginBottom: "1.25rem" }}>
                        {[...Array(5)].map((_, si) => (
                          <span key={si} style={{ color: si < r.rating ? "#f59e0b" : "#475569", fontSize: "0.9rem" }}>★</span>
                        ))}
                      </div>

                      <p style={{ color: "#cbd5e1", lineHeight: 1.8, fontSize: "0.9375rem", flex: 1, marginBottom: "1.75rem", position: "relative" }}>
                        &ldquo;{r.comment}&rdquo;
                      </p>

                      <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "1.5rem" }} />

                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, hsl(${hue},70%,62%), hsl(${hue},80%,47%))`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "1rem",
                          color: "#fff",
                          flexShrink: 0,
                          boxShadow: `0 4px 14px hsla(${hue},70%,50%,0.3)`,
                          overflow: "hidden",
                          position: "relative",
                        }}>
                          {r.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.avatar_url} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            initials
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#f1f5f9" }}>{r.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.125rem" }}>{formattedDept}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : testimonials.map((t) => (
                  <div key={t.name} style={{
                    background: "#111827",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "1.25rem",
                    padding: "2.25rem",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    <div style={{ position: "absolute", top: 0, right: "1.25rem", fontSize: "7rem", fontWeight: 900, color: "rgba(255,255,255,0.02)", lineHeight: 1, userSelect: "none", fontFamily: "Georgia, serif" }}>&ldquo;</div>

                    {/* Stars */}
                    <div style={{ display: "flex", gap: "2px", marginBottom: "1.25rem" }}>
                      {[...Array(5)].map((_, si) => (
                        <span key={si} style={{ color: "#f59e0b", fontSize: "0.9rem" }}>★</span>
                      ))}
                    </div>

                    <p style={{ color: "#cbd5e1", lineHeight: 1.8, fontSize: "0.9375rem", flex: 1, marginBottom: "1.75rem", position: "relative" }}>
                      &ldquo;{t.text}&rdquo;
                    </p>

                    <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "1.5rem" }} />

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        background: `linear-gradient(135deg, hsl(${t.hue},70%,62%), hsl(${t.hue},80%,47%))`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: "1rem", color: "#fff", flexShrink: 0,
                        boxShadow: `0 4px 14px hsla(${t.hue},70%,50%,0.3)`,
                      }}>
                        {t.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#f1f5f9" }}>{t.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.125rem" }}>{t.dept}</div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗
          ║  6. FINAL CTA                                            ║
          ╚══════════════════════════════════════════════════════════╝ */}
      <section style={{ padding: "8rem 1.5rem", background: "#111827", borderTop: "1px solid rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "1.25rem" }}>
            Get Started — It&apos;s Free
          </p>
          <h2 style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.06, color: "#f1f5f9", marginBottom: "1.5rem" }}>
            Ready to find your home{" "}
            <span style={{
              background: "linear-gradient(120deg, #93c5fd, #3b82f6, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              in Bambili?
            </span>
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "#94a3b8", lineHeight: 1.75, maxWidth: "46ch", margin: "0 auto 3rem" }}>
            Join hundreds of students who found their perfect housing through BambiHomes — verified listings, zero hidden fees.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <CTAButton label="🏠 Browse Listings" />
            <Link href="/signup" className="btn btn-outline" style={{ padding: "1rem 2.25rem", fontSize: "1rem", fontWeight: 600 }}>
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
