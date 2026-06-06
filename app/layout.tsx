import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

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
      data-scroll-behavior="smooth"
    >
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AuthProvider>
          <Navbar />
          <AuthGuard>
            <main style={{ flex: 1, paddingTop: "64px" }}>{children}</main>
          </AuthGuard>
          <MobileBottomNav />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
