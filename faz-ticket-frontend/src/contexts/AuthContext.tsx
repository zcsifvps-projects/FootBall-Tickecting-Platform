import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  register: (firstName: string, lastName: string, email: string, mobile: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setAccessToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err: any) {
      throw new Error(err.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          userId: user?.id,
          refreshToken: localStorage.getItem("refreshToken"),
        }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      navigate("/");
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
    } catch (err) {
      console.error("Token refresh error:", err);
      logout();
    }
  };

  const register = async (firstName: string, lastName: string, email: string, mobile: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, mobile, password, confirmPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Don't auto-login; user needs to verify email first
      sessionStorage.setItem("register_email", email);
    } catch (err: any) {
      throw new Error(err.message || "Registration failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        login,
        logout,
        refreshToken,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
