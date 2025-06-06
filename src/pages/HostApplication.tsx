
import Layout from '@/components/layout/Layout';
import HostApplicationForm from '@/components/open-calls/HostApplicationForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const HostApplication = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <HostApplicationForm />
      </div>
    </Layout>
  );
};

export default HostApplication;
