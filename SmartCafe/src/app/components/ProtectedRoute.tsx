import { Navigate } from "react-router";
import { useStore, UserRole } from "../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: UserRole;
}

/**
 * Wraps a page so that it redirects to /staff-login if the user
 * is not authenticated with the required role.
 * Keeping auth checks HERE (not inside the page component) avoids
 * the React "hooks after conditional return" rules-of-hooks violation.
 */
export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const auth = useStore((s) => s.auth);

  if (!auth.isAuthenticated || auth.role !== role) {
    return <Navigate to="/staff-login" replace />;
  }

  return <>{children}</>;
}
