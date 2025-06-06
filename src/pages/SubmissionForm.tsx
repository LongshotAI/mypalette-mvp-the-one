import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SubmissionWizard from '@/components/submissions/SubmissionWizard';
import { useAuth } from '@/contexts/AuthContext';

const SubmissionForm = () => {
  const { callId } = useParams();
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

  if (!callId) {
    return <Navigate to="/open-calls" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <SubmissionWizard 
          openCallId={callId}
          onSuccess={() => {
            // Navigate back to open calls or show success page
          }}
        />
      </div>
    </Layout>
  );
};

export default SubmissionForm;
