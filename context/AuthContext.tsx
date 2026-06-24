"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "landlord" | "admin";
  status: "pending" | "approved" | "rejected";
  level?: string;
  faculty?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: "student" | "landlord", phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Fetch profile data from the profiles table
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data: initialData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      let data = initialData;

      // If profile is missing, create a default one (self-healing)
      if (error && error.code === "PGRST116") {
        console.log("Profile missing, creating default...");
        const { data: newData, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: email,
            name: email.split("@")[0],
            role: "student",
            status: "approved"
          })
          .select()
          .single();
        
        if (createError) {
          console.error("Error creating missing profile:", createError);
          return null;
        }
        data = newData;
      } else if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      if (!data) return null;

      return {
        id: userId,
        email: email,
        name: data.name,
        role: data.role,
        status: data.status || "pending",
        phone: data.phone,
        level: data.level,
        faculty: data.faculty,
        avatarUrl: data.avatar_url,
      } as User;
    } catch (err) {
      console.error("fetchProfile exception:", err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Listen for changes on auth state (logged in, signed out, etc.)
    // Note: onAuthStateChange natively triggers immediately on subscription with the current session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      
      try {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email!);
          if (mounted) {
            setUser(profile);
            setIsLoading(false);
          }
        } else {
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        if (mounted) {
          setIsLoading(false);
        }
      }
    });

    // Fallback safety timeout (5 seconds) to ensure isLoading is eventually set to false
    const safetyTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("Auth state check timed out. Forcing isLoading to false.");
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, [isLoading]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id, data.user.email!);
        setUser(profile);
      }

      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      console.error("Login exception:", e);
      setIsLoading(false);
      return { success: false, error: e?.message || "An unexpected error occurred" };
    }
  };

  const signup = async (name: string, email: string, password: string, role: "student" | "landlord", phone?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setIsSigningUp(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        setIsSigningUp(false);
        return { success: false, error: error.message };
      }

      // Force sign out immediately to ensure they have to log in manually
      await supabase.auth.signOut();
      
      setIsSigningUp(false);
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      console.error("Signup exception:", e);
      setIsSigningUp(false);
      setIsLoading(false);
      return { success: false, error: e?.message || "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Logout exception:", e);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchProfile(user.id, user.email);
      if (profile) setUser(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}