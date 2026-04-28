"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const { signup, isLoading } = useAuth();
  const router = useRouter();

  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as "student" | "landlord",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = await signup(form.name, form.email, form.password, form.role);

    if (result.success) {
      // Redirect to login with success message
      router.push("/login?signup=success");
    } else {
      setError(result.error || "Signup failed");
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "2.5rem" }}>
          <span style={{ fontSize: "1.75rem" }}>🏠</span>
          <span style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text)" }}>BambiHomes</span>
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>Create account</h1>
          <p style={{ color: "var(--text-subtle)", fontSize: "0.9375rem" }}>Join students finding better housing in Bambili</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="name" style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>Full Name</label>
            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-card)", color: "var(--text)", fontSize: "1rem" }} />
          </div>

          {/* Role Selection */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>I am a...</label>
            <div style={{ display: "flex", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "0.25rem", gap: "0.25rem" }}>
              <button type="button" onClick={() => setForm((prev) => ({ ...prev, role: "student" }))} style={{ flex: 1, padding: "0.75rem 1rem", border: "none", borderRadius: "var(--radius-md)", background: form.role === "student" ? "var(--primary)" : "transparent", color: form.role === "student" ? "#fff" : "var(--text-subtle)", fontWeight: 600, fontSize: "0.9375rem", cursor: "pointer", transition: "all 0.2s" }}>🎓 Student</button>
              <button type="button" onClick={() => setForm((prev) => ({ ...prev, role: "landlord" }))} style={{ flex: 1, padding: "0.75rem 1rem", border: "none", borderRadius: "var(--radius-md)", background: form.role === "landlord" ? "var(--primary)" : "transparent", color: form.role === "landlord" ? "#fff" : "var(--text-subtle)", fontWeight: 600, fontSize: "0.9375rem", cursor: "pointer", transition: "all 0.2s" }}>🏠 Landlord</button>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email" style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>Email</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="you@uba.cm" style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-card)", color: "var(--text)", fontSize: "1rem" }} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="password" style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>Password</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-card)", color: "var(--text)", fontSize: "1rem" }} />
          </div>

          <button type="submit" disabled={isLoading} style={{ width: "100%", padding: "0.875rem 1rem", border: "none", borderRadius: "var(--radius-md)", background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1, transition: "all 0.2s" }}>
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
          <p style={{ color: "var(--text-subtle)" }}>
            Already have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
