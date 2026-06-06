"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function MobileBottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-inner">
        {/* HOME (Everyone) */}
        <Link href="/" className={`mobile-nav-item ${isActive("/") ? "active" : ""}`}>
          <span className="mobile-nav-icon">🏠</span>
          <span>Home</span>
        </Link>

        {/* SELL (Admins Only) */}
        {user?.role === "admin" && (
          <Link href="/admin/new" className={`mobile-nav-item ${isActive("/admin/new") ? "active" : ""}`}>
            <span className="mobile-nav-icon">➕</span>
            <span>Sell</span>
          </Link>
        )}

        {/* NOTIFICATIONS (Logged-in users) */}
        {user && (
          <div className="mobile-nav-item">
            {/* We pass direction="up" so the popup doesn't open off-screen! */}
            <div style={{ marginTop: "-8px" }}>
              <NotificationBell direction="up" />
            </div>
            <span style={{ marginTop: "-2px" }}>News</span>
          </div>
        )}

        {/* PROFILE (Everyone, routes to login if logged out) */}
        <Link 
          href={user ? "/profile" : "/login"} 
          className={`mobile-nav-item ${isActive("/profile") || isActive("/login") ? "active" : ""}`}
        >
          <span className="mobile-nav-icon">👤</span>
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
