
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Award, 
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import HostApplicationManagement from '@/components/admin/HostApplicationManagement';
import { useHostApplications } from '@/hooks/useHostApplications';

const AdminDashboard = () => {
  const { getAllHostApplications } = useHostApplications();
  const { data: hostApplications, isLoading: hostAppsLoading } = getAllHostApplications;

  // Get platform statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResult, submissionsResult, openCallsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('submissions').select('id', { count: 'exact' }),
        supabase.from('open_calls').select('*')
      ]);

      const totalUsers = usersResult.count || 0;
      const totalSubmissions = submissionsResult.count || 0;
      const openCalls = openCallsResult.data || [];
      
      const liveOpenCalls = openCalls.filter(call => call.status === 'live').length;
      const pendingOpenCalls = openCalls.filter(call => call.status === 'pending').length;

      // For host applications, we're using open_calls data for now
      const approvedApplications = openCalls.filter(call => call.status === 'live').length;
      const pendingApplications = openCalls.filter(call => call.status === 'pending').length;
      const rejectedApplications = openCalls.filter(call => call.status === 'rejected').length;

      return {
        totalUsers,
        totalSubmissions,
        liveOpenCalls,
        pendingOpenCalls,
        approvedApplications,
        pendingApplications,
        rejectedApplications
      };
    },
  });

  if (statsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const applicationStats = [
    {
      title: 'Pending Review',
      value: stats?.pendingApplications || 0,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Approved',
      value: stats?.approvedApplications || 0,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Rejected',
      value: stats?.rejectedApplications || 0,
      icon: XCircle,
      color: 'text-red-600'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your platform and review applications
            </p>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalSubmissions || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Open Calls</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.liveOpenCalls || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingOpenCalls || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Host Application Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Host Application Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {applicationStats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="host-applications" className="space-y-6">
            <TabsList>
              <TabsTrigger value="host-applications">Host Applications</TabsTrigger>
              <TabsTrigger value="open-calls">Open Calls</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="host-applications">
              <HostApplicationManagement />
            </TabsContent>

            <TabsContent value="open-calls">
              <Card>
                <CardHeader>
                  <CardTitle>Open Calls Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Open calls management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submissions">
              <Card>
                <CardHeader>
                  <CardTitle>Submissions Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Submissions management coming soon...</p>
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
