"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupForm() {
  const { signup, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as "student" | "landlord",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    const result = await signup(form.name, form.email, form.password, form.role, form.phone);
    if (result.success) {
      const loginUrl = redirect
        ? `/login?signup=success&redirect=${encodeURIComponent(redirect)}`
        : "/login?signup=success";
      router.push(loginUrl);
    }
    else { setError(result.error || "Signup failed"); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>

      {/* ── Left decorative panel ── */}
      <div
        className="hidden-mobile"
        style={{
          width: "40%",
          background: "linear-gradient(155deg, #0b1121 0%, #172554 50%, #0b1121 100%)",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", top: "15%", right: "10%", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)", borderRadius: "50%", animation: "float 8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "15%", left: "5%", width: "240px", height: "240px", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", borderRadius: "50%", animation: "float 6s ease-in-out infinite reverse" }} />
          <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "3rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", marginBottom: "4rem" }}>
            <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 4px 16px rgba(59,130,246,0.4)" }}>🏠</div>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>Bambi<span style={{ color: "var(--primary)" }}>Homes</span></span>
          </Link>

          <div className="anim-fade-up">
            <p className="section-label" style={{ marginBottom: "1rem" }}>JOIN TODAY</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.04em", color: "white", marginBottom: "1.5rem" }}>
              The smartest way to<br />
              <span className="gradient-text">find housing in Bambili</span>
            </h2>
            <p style={{ color: "var(--text-subtle)", lineHeight: 1.7, fontSize: "1rem", maxWidth: "34ch" }}>
              Join hundreds of students who found affordable, safe housing near campus.
            </p>
          </div>

          {/* Role cards preview */}
          <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {[
              { role: "🎓 Student", desc: "Browse and save listings near campus" },
              { role: "🏠 Landlord", desc: "List your property and find tenants" },
            ].map((item, i) => (
              <div key={i} className={`anim-fade-up delay-${(i + 2) * 100}`} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "var(--radius)",
                padding: "0.875rem 1.125rem",
              }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "white", marginBottom: "0.25rem" }}>{item.role}</div>
                <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "440px" }} className="anim-scale-in">

          {/* Mobile logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }} className="show-mobile">
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🏠</div>
              <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text)" }}>Bambi<span style={{ color: "var(--primary)" }}>Homes</span></span>
            </Link>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.04em" }}>Create account ✨</h1>
            <p style={{ color: "var(--text-subtle)", fontSize: "0.9375rem" }}>Join students finding better housing in Bambili</p>
          </div>

          {error && (
            <div className="anim-scale-in" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "0.875rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Role Toggle */}
            <div>
              <p className="form-label" style={{ marginBottom: "0.625rem" }}>I am a...</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                {(["student", "landlord"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, role: r }))}
                    style={{
                      padding: "0.875rem 1rem",
                      borderRadius: "var(--radius)",
                      border: form.role === r ? "1px solid rgba(59,130,246,0.4)" : "1px solid var(--border-light)",
                      background: form.role === r ? "rgba(59,130,246,0.08)" : "var(--bg-input)",
                      color: form.role === r ? "var(--primary)" : "var(--text-subtle)",
                      fontWeight: form.role === r ? 700 : 500,
                      fontSize: "0.9375rem",
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      boxShadow: form.role === r ? "0 0 16px rgba(59,130,246,0.1)" : "none",
                    }}
                  >
                    {r === "student" ? "🎓" : "🏠"} {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input" />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="you@uba.cm" autoComplete="email" className="input" />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" id="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" autoComplete="new-password" className="input" />
            </div>

            {/* Phone – only for landlords */}
            {form.role === "landlord" && (
              <div className="form-group anim-fade-down">
                <label htmlFor="phone" className="form-label">
                  Phone / WhatsApp <span style={{ color: "var(--primary)", fontSize: "0.75rem" }}>• Required for landlords</span>
                </label>
                <input
                  type="text" id="phone" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="+237 6xx xxx xxx"
                  className="input"
                />
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  Admins will contact you on this number before approving your account.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.5rem", padding: "0.875rem", fontSize: "1rem", opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <span className="spinner spinner-sm" /> Creating account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <div className="divider" style={{ marginBottom: "1.5rem" }} />
            <p style={{ color: "var(--text-subtle)", fontSize: "0.875rem" }}>
              Already have an account?{" "}
              <Link href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"} style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="spinner" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
