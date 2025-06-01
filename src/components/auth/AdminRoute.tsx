
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading, error } = useAdminCheck();

  console.log('AdminRoute - User:', user?.email, 'Role:', userRole, 'Auth Loading:', authLoading, 'Role Loading:', roleLoading);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="ml-2">Checking admin access...</p>
      </div>
    );
  }

  if (!user) {
    console.log('AdminRoute: No user, redirecting to login');
    return <Navigate to="/auth/login" replace />;
  }

  if (error) {
    console.error('AdminRoute: Error checking role:', error);
    return <Navigate to="/dashboard" replace />;
  }

  if (userRole !== 'admin') {
    console.log('AdminRoute: User role is not admin:', userRole, 'Redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('AdminRoute: Admin access granted for:', user.email);
  return <>{children}</>;
};

export default AdminRoute;
