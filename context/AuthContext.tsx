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
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: "student" | "landlord") => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Fetch profile data from the profiles table
  const fetchProfile = async (userId: string, email: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return {
      id: userId,
      email: email,
      name: data.name,
      role: data.role,
      status: data.status || "approved",
      level: data.level,
      faculty: data.faculty,
    } as User;
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email!);
        setUser(profile);
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && !isSigningUp) {
        const profile = await fetchProfile(session.user.id, session.user.email!);
        setUser(profile);
      } else if (!session?.user) {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
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
  };

  const signup = async (name: string, email: string, password: string, role: "student" | "landlord"): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setIsSigningUp(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
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
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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