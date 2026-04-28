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
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(form.email, form.password);

    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || "Invalid email or password");
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px" }}>
      {/* Logo */}
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "2.5rem" }}>
        <span style={{ fontSize: "1.75rem" }}>🏠</span>
        <span style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text)" }}>BambiHomes</span>
      </Link>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>Welcome back</h1>
        <p style={{ color: "var(--text-subtle)", fontSize: "0.9375rem" }}>Sign in to find your perfect room</p>
      </div>

      {/* Messages */}
      {signupSuccess && (
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          ✅ Account created successfully! Please sign in below.
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>Email</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="you@uba.cm" style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-card)", color: "var(--text)", fontSize: "1rem" }} />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="password" style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>Password</label>
          <input type="password" id="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-card)", color: "var(--text)", fontSize: "1rem" }} />
        </div>

        <button type="submit" disabled={isLoading} style={{ width: "100%", padding: "0.875rem 1rem", border: "none", borderRadius: "var(--radius-md)", background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1, transition: "all 0.2s" }}>
          {isLoading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
        <p style={{ color: "var(--text-subtle)" }}>
          Don't have an account? <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 140px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
