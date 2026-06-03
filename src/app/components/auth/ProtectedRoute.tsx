import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@/stores';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

/**
 * Route guard that redirects unauthenticated users to /login.
 * Optionally restricts access by role (e.g., 'admin').
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // While initial auth check is running, show spinner
  // But if we already have a persisted user, skip the spinner
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F3]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff3131] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check (e.g., admin-only pages)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/**
 * Route guard for guest-only pages (login, register).
 * Redirects authenticated users to dashboard.
 */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // Don't block while loading — let the page show
  if (isLoading && !user) {
    return <>{children}</>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
