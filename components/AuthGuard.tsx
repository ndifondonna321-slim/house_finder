"use client";

import { useAuth, type User } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// Routes that require authentication
const PROTECTED_ROUTES = ["/listings", "/saved", "/profile", "/landlord"];

// Routes that should redirect authenticated users away
const AUTH_ROUTES = ["/login", "/signup", "/auth"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isProtected = PROTECTED_ROUTES.some((route) => pathname?.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.includes(pathname || "");

    // Redirect unauthenticated users to login
    if (!isAuthenticated && isProtected) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || "")}`);
      return;
    }

    // Redirect authenticated users away from auth page
    if (isAuthenticated && isAuthRoute) {
      const redirect = new URLSearchParams(window.location.search).get("redirect");
      if (redirect) {
        router.push(redirect);
      } else {
        // Redirect based on role
        if (user?.role === "landlord") {
          router.push("/landlord");
        } else {
          router.push("/listings");
        }
      }
      return;
    }
  }, [isLoading, isAuthenticated, pathname, router, user]);

  // Show nothing while loading or redirecting
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid var(--border)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Don't render protected content while redirecting
  const isProtected = PROTECTED_ROUTES.some((route) => pathname?.startsWith(route));
  if (!isAuthenticated && isProtected) {
    return null;
  }

  return <>{children}</>;
}