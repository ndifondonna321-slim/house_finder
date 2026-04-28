import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BambiHomes — Student Housing in Bambili",
  description:
    "Find affordable, verified student housing in Bambili, near the University of Bamenda. Browse rooms, studios, and apartments — no stress.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AuthProvider>
          <AuthGuard>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <footer
              style={{
                borderTop: "1px solid var(--border)",
                padding: "2rem 1.5rem",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.875rem",
              }}
            >
              <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                <p>
                  © {new Date().getFullYear()}{" "}
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>BambiHomes</span>{" "}
                  — Trusted student housing in Bambili, Cameroon.
                </p>
              </div>
            </footer>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
