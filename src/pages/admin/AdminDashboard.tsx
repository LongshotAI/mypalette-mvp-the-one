
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Building,
  Send,
  CheckCircle,
  Clock
} from 'lucide-react';
import UserManagementTable from '@/components/admin/UserManagementTable';
import HostApplicationManagement from '@/components/admin/HostApplicationManagement';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AdminDashboard = () => {
  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      console.log('Fetching admin dashboard stats...');
      
      // Get user count
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, role');
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }

      // Get host applications count
      const { data: hostApps, error: hostAppsError } = await supabase
        .from('host_applications')
        .select('id, application_status');
      
      if (hostAppsError) {
        console.error('Error fetching host applications:', hostAppsError);
        throw hostAppsError;
      }

      // Get open calls count
      const { data: openCalls, error: openCallsError } = await supabase
        .from('open_calls')
        .select('id, status');
      
      if (openCallsError) {
        console.error('Error fetching open calls:', openCallsError);
        throw openCallsError;
      }

      // Get submissions count
      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('id, payment_status');
      
      if (submissionsError) {
        console.error('Error fetching submissions:', submissionsError);
        throw submissionsError;
      }

      console.log('Dashboard stats fetched successfully');
      
      return {
        totalUsers: users?.length || 0,
        adminUsers: users?.filter(u => u.role === 'admin').length || 0,
        totalHostApplications: hostApps?.length || 0,
        pendingHostApplications: hostApps?.filter(h => h.application_status === 'pending').length || 0,
        totalOpenCalls: openCalls?.length || 0,
        liveOpenCalls: openCalls?.filter(o => o.status === 'live').length || 0,
        totalSubmissions: submissions?.length || 0,
        paidSubmissions: submissions?.filter(s => s.payment_status === 'paid' || s.payment_status === 'free').length || 0
      };
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, applications, and platform content</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats?.adminUsers || 0} admins
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Host Applications</p>
                    <p className="text-2xl font-bold">{stats?.totalHostApplications || 0}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats?.pendingHostApplications || 0} pending review
                    </p>
                  </div>
                  <Building className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Calls</p>
                    <p className="text-2xl font-bold">{stats?.totalOpenCalls || 0}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats?.liveOpenCalls || 0} currently live
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Submissions</p>
                    <p className="text-2xl font-bold">{stats?.totalSubmissions || 0}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats?.paidSubmissions || 0} completed
                    </p>
                  </div>
                  <Send className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Management Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="host-applications" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Host Applications
                  {stats?.pendingHostApplications && stats.pendingHostApplications > 0 && (
                    <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                      {stats.pendingHostApplications}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="open-calls" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Open Calls
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserManagementTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="host-applications">
                <HostApplicationManagement />
              </TabsContent>

              <TabsContent value="open-calls">
                <Card>
                  <CardHeader>
                    <CardTitle>Open Calls Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Open Calls management functionality coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Analytics dashboard coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
