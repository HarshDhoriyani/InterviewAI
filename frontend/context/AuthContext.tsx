'use client';

import {
  createContext, useContext, useState,
  useEffect, useCallback, type ReactNode,
} from "react";
import authService from "@/services/auth";
import type { User } from "@/services/api";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  // isLoading = true until localStorage is read on the client.
  // ALL auth guards must wait for isLoading === false before redirecting.
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // start TRUE — SSR has no localStorage

  // Runs once on client after hydration — the only safe place to read localStorage
  useEffect(() => {
    try {
      const token  = localStorage.getItem("token");
      const stored = localStorage.getItem("user");
      if (token && stored) {
        setUser(JSON.parse(stored) as User);
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false); // ← guards may now run
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const u = await authService.register(name, email, password);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // Use replace so the back button doesn't return to a protected page
    window.location.replace("/auth");
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}