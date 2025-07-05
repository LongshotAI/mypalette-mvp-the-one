import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import OpenCallCuration from '@/components/open-calls/OpenCallCuration';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const OpenCallCurationPage = () => {
  const { callId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { data: adminRole, isLoading } = useAdminCheck();
  const isAdmin = adminRole === 'admin';

  const { data: openCall, isLoading: openCallLoading, error } = useQuery({
    queryKey: ['curation-open-call', callId],
    queryFn: async () => {
      if (!callId) throw new Error('Open call ID is required');

      const { data, error } = await supabase
        .from('open_calls')
        .select('*')
        .eq('id', callId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Open call not found');
        }
        throw error;
      }

      return data;
    },
    enabled: !!callId && !!user,
  });

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin && openCall?.host_user_id !== user.id) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
                <p className="text-muted-foreground mb-6">
                  You don't have permission to curate this open call. Only administrators and the original host can access curation.
                </p>
                <Button onClick={() => window.history.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (!callId) {
    return <Navigate to="/open-calls" replace />;
  }

  if (openCallLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !openCall) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold mb-2">Open Call Not Found</h1>
                <p className="text-muted-foreground mb-6">
                  The open call you're trying to curate doesn't exist or has been removed.
                </p>
                <Button onClick={() => window.history.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Open Calls
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Curation Center</h1>
                <p className="text-muted-foreground">
                  Select winners and manage the curation process for "{openCall.title}"
                </p>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Administrator Access
                </div>
              )}
            </div>
          </div>

          {/* Curation Interface */}
          <OpenCallCuration
            openCallId={callId}
            openCall={{
              id: openCall.id,
              title: openCall.title,
              num_winners: openCall.num_winners,
              organization_name: openCall.organization_name,
              submission_deadline: openCall.submission_deadline,
              status: openCall.status
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default OpenCallCurationPage;