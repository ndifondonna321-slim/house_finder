"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/listings";
  const signupSuccess = searchParams.get("signup") === "success";

  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    const result = await login(form.email, form.password);
    if (result.success) { router.push(redirect); }
    else { setError(result.error || "Invalid email or password"); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>
      {/* Left decorative panel */}
      <div
        className="hidden-mobile"
        style={{
          width: "45%",
          background: "linear-gradient(155deg, #0b1121 0%, #172554 50%, #0b1121 100%)",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Animated background circles */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "20%", left: "15%",
            width: "300px", height: "300px",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "float 7s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "20%", right: "10%",
            width: "250px", height: "250px",
            background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "float 9s ease-in-out infinite reverse",
          }} />
          <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        </div>

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column",
          justifyContent: "center", height: "100%",
          padding: "3rem",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", marginBottom: "4rem" }}>
            <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 4px 16px rgba(59,130,246,0.4)" }}>🏠</div>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>Bambi<span style={{ color: "var(--primary)" }}>Homes</span></span>
          </Link>

          <div className="anim-fade-up">
            <p className="section-label" style={{ marginBottom: "1rem" }}>TRUSTED BY STUDENTS</p>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.04em", color: "white", marginBottom: "1.5rem" }}>
              Find your perfect<br />
              <span className="gradient-text">room in Bambili</span>
            </h2>
            <p style={{ color: "var(--text-subtle)", lineHeight: 1.7, fontSize: "1rem", maxWidth: "35ch" }}>
              Verified listings close to campus. Connect directly with landlords and move in with confidence.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { icon: "✅", text: "Verified listings only" },
              { icon: "💬", text: "Direct WhatsApp contact" },
              { icon: "📍", text: "Near UBA campus" },
            ].map((item, i) => (
              <div key={i} className={`anim-fade-up delay-${(i + 2) * 100}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9375rem" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        position: "relative",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }} className="anim-scale-in">
          {/* Mobile logo */}
          <div className="show-mobile" style={{ marginBottom: "2rem", justifyContent: "center", display: "none" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🏠</div>
              <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text)" }}>Bambi<span style={{ color: "var(--primary)" }}>Homes</span></span>
            </Link>
          </div>

          <div style={{ marginBottom: "2.5rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.04em" }}>Welcome back 👋</h1>
            <p style={{ color: "var(--text-subtle)", fontSize: "0.9375rem" }}>Sign in to find your perfect room</p>
          </div>

          {signupSuccess && (
            <div className="anim-fade-in" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399", padding: "0.875rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              ✅ Account created! Please sign in below.
            </div>
          )}

          {error && (
            <div className="anim-scale-in" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "0.875rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email" id="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@uba.cm" autoComplete="email"
                className="input"
                style={{ fontSize: "0.9375rem" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password" id="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" autoComplete="current-password"
                className="input"
                style={{ fontSize: "0.9375rem" }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.5rem", padding: "0.875rem", fontSize: "1rem", opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="spinner spinner-sm" /> Signing in...
                </span>
              ) : "Sign In →"}
            </button>
          </form>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <div className="divider" style={{ marginBottom: "1.5rem" }} />
            <p style={{ color: "var(--text-subtle)", fontSize: "0.875rem" }}>
              Don&apos;t have an account?{" "}
              <Link href={redirect !== "/listings" ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/signup"} style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
