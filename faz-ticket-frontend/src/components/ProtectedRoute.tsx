import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  /** If true, redirect authenticated users away from this route */
  redirectIfAuthenticated?: boolean;
  /** If true, require authentication to access this route */
  requireAuth?: boolean;
}

/**
 * ProtectedRoute Component
 * - If redirectIfAuthenticated=true and user is logged in: redirect to /
 * - If requireAuth=true and user is NOT logged in: redirect to /auth/signin
 * - Otherwise: render children
 */
export default function ProtectedRoute({
  children,
  redirectIfAuthenticated = false,
  requireAuth = false,
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Redirect authenticated users away from auth pages (register, signin, etc.)
  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect unauthenticated users away from protected pages
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
}
