
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Calendar, 
  BarChart3, 
  Shield,
  Building2,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import UserManagementTable from '@/components/admin/UserManagementTable';
import OpenCallManagement from '@/components/admin/OpenCallManagement';
import SubmissionReview from '@/components/admin/SubmissionReview';
import HostApplicationManagement from '@/components/admin/HostApplicationManagement';

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  useEffect(() => {
    if (user && profile && profile.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, profile, navigate]);

  // Fetch admin statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResult, openCallsResult, submissionsResult, hostAppsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('open_calls').select('id', { count: 'exact' }),
        supabase.from('submissions').select('id', { count: 'exact' }),
        supabase.rpc('get_all_host_applications' as any, {})
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalOpenCalls: openCallsResult.count || 0,
        totalSubmissions: submissionsResult.count || 0,
        totalHostApplications: hostAppsResult.data?.length || 0,
        pendingHostApplications: hostAppsResult.data?.filter((app: any) => app.application_status === 'pending').length || 0
      };
    },
    enabled: !!user && profile?.role === 'admin'
  });

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to access the admin dashboard.
              </p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                You don't have permission to access this area.
              </p>
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, content, and platform operations
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="open-calls">Open Calls</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="host-applications">Host Apps</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {statsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                          </div>
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Open Calls</p>
                            <p className="text-2xl font-bold">{stats?.totalOpenCalls || 0}</p>
                          </div>
                          <Calendar className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                            <p className="text-2xl font-bold">{stats?.totalSubmissions || 0}</p>
                          </div>
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Host Apps</p>
                            <p className="text-2xl font-bold">{stats?.totalHostApplications || 0}</p>
                            {stats && stats.pendingHostApplications > 0 && (
                              <Badge variant="destructive" className="mt-1">
                                {stats.pendingHostApplications} pending
                              </Badge>
                            )}
                          </div>
                          <Building2 className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Platform Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">User Management</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setActiveTab('users')}
                          >
                            Manage Users
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Open Call Approval</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setActiveTab('open-calls')}
                          >
                            Review Open Calls
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Host Applications</span>
                          <div className="flex gap-2">
                            {stats && stats.pendingHostApplications > 0 && (
                              <Badge variant="destructive">
                                {stats.pendingHostApplications} pending
                              </Badge>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveTab('host-applications')}
                            >
                              Review Applications
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserManagementTable />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Open Calls Tab */}
            <TabsContent value="open-calls">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Open Call Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OpenCallManagement />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Submission Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SubmissionReview openCallId="" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Host Applications Tab */}
            <TabsContent value="host-applications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Host Application Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HostApplicationManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
