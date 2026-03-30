import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';

/**
 * Protects routes that require authentication.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to='/login' replace />;

  return <Outlet />;
};

/**
 * Protects routes that require admin role.
 */
export const AdminRoute = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to='/login' replace />;
  if (!isAdmin) return <Navigate to='/' replace />;

  return <Outlet />;
};

/**
 * Redirects authenticated users away from auth pages (login/signup).
 */
export const GuestRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to='/' replace />;

  return <Outlet />;
};
