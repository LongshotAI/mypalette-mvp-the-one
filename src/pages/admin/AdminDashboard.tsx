
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileText, Calendar, DollarSign, TrendingUp, Eye, Settings, Shield } from 'lucide-react';
import AdminOpenCallManagement from '@/components/admin/AdminOpenCallManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedOpenCall, setSelectedOpenCall] = useState<string | null>(null);

  // Check if user is admin
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalOpenCalls },
        { count: totalSubmissions },
        { count: pendingCalls },
        { count: totalPortfolios }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('open_calls').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true }),
        supabase.from('open_calls').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('portfolios').select('*', { count: 'exact', head: true })
      ]);

      const { data: revenueData } = await supabase
        .from('submissions')
        .select('submission_data')
        .in('payment_status', ['paid']);

      const totalRevenue = revenueData?.length * 2 || 0;

      return {
        totalUsers: totalUsers || 0,
        totalOpenCalls: totalOpenCalls || 0,
        totalSubmissions: totalSubmissions || 0,
        pendingCalls: pendingCalls || 0,
        totalPortfolios: totalPortfolios || 0,
        totalRevenue
      };
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      const { data: recentSubmissions } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles(username, first_name, last_name),
          open_calls(title)
        `)
        .order('submitted_at', { ascending: false })
        .limit(5);

      const { data: recentCalls } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(username, first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentPortfolios } = await supabase
        .from('portfolios')
        .select(`
          *,
          profiles(username, first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        recentSubmissions: recentSubmissions || [],
        recentCalls: recentCalls || [],
        recentPortfolios: recentPortfolios || []
      };
    },
  });

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-muted-foreground">You need to be logged in to access the admin dashboard.</p>
            <Button onClick={() => navigate('/auth/login')} className="mt-4">
              Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage MyPalette platform operations</p>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="open-calls">Open Calls</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                    <p className="text-xs text-muted-foreground">Registered artists</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Calls</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalOpenCalls || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.pendingCalls || 0} pending approval
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalSubmissions || 0}</div>
                    <p className="text-xs text-muted-foreground">Total submissions</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portfolios</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalPortfolios || 0}</div>
                    <p className="text-xs text-muted-foreground">Created portfolios</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats?.totalRevenue || 0}</div>
                    <p className="text-xs text-muted-foreground">Submission fees</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12%</div>
                    <p className="text-xs text-muted-foreground">Month over month</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity?.recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{submission.open_calls?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          by {submission.profiles?.first_name} {submission.profiles?.last_name}
                        </p>
                      </div>
                      <Badge variant={submission.payment_status === 'paid' ? 'default' : 'secondary'}>
                        {submission.payment_status}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-muted-foreground">No recent submissions</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Open Calls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity?.recentCalls.map((call) => (
                    <div key={call.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{call.title}</p>
                        <p className="text-sm text-muted-foreground">
                          by {call.profiles?.first_name} {call.profiles?.last_name}
                        </p>
                      </div>
                      <Badge variant={call.status === 'live' ? 'default' : 'secondary'}>
                        {call.status}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-muted-foreground">No recent open calls</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="open-calls">
            <AdminOpenCallManagement />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">User Management</h3>
                  <p className="text-muted-foreground">User management features coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Content Management</h3>
                  <p className="text-muted-foreground">Content management features coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
