import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, Calendar, DollarSign, TrendingUp, Eye } from 'lucide-react';
import AdminOpenCallManagement from '@/components/admin/AdminOpenCallManagement';
import SubmissionReview from '@/components/admin/SubmissionReview';
import AdminDebugInfo from '@/components/admin/AdminDebugInfo';

const AdminDashboard = () => {
  const [selectedOpenCall, setSelectedOpenCall] = useState<string | null>(null);

  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalOpenCalls },
        { count: totalSubmissions },
        { count: pendingCalls }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('open_calls').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true }),
        supabase.from('open_calls').select('*', { count: 'exact', head: true }).eq('status', 'pending')
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

      return {
        recentSubmissions: recentSubmissions || [],
        recentCalls: recentCalls || []
      };
    },
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage the MyPalette platform</p>
        </div>

        <AdminDebugInfo />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Calls</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOpenCalls || 0}</div>
              <p className="text-xs text-muted-foreground">Total created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSubmissions || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingCalls || 0}</div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue || 0}</div>
              <p className="text-xs text-muted-foreground">From submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="open-calls" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="open-calls">Open Calls</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="open-calls" className="space-y-6">
            <AdminOpenCallManagement />
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Submission Management</h2>
              
              {selectedOpenCall ? (
                <div>
                  <button 
                    onClick={() => setSelectedOpenCall(null)}
                    className="text-blue-600 hover:underline mb-4"
                  >
                    ← Back to all submissions
                  </button>
                  <SubmissionReview openCallId={selectedOpenCall} />
                </div>
              ) : (
                <div className="grid gap-4">
                  {recentActivity?.recentCalls?.map((call) => (
                    <Card key={call.id} className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedOpenCall(call.id)}>
                      <CardHeader>
                        <CardTitle className="text-lg">{call.title}</CardTitle>
                        <p className="text-sm text-gray-600">
                          by {call.profiles?.first_name} {call.profiles?.last_name}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Deadline: {new Date(call.submission_deadline).toLocaleDateString()}
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            View submissions →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Recent Submissions</h4>
                      <div className="space-y-2">
                        {recentActivity?.recentSubmissions?.map((submission) => {
                          const submissionData = submission.submission_data as any;
                          return (
                            <div key={submission.id} className="text-sm p-2 bg-gray-50 rounded">
                              <strong>{submissionData?.title || 'Untitled Submission'}</strong>
                              <br />
                              by {submission.profiles?.first_name} {submission.profiles?.last_name}
                              <br />
                              <span className="text-gray-500">
                                {new Date(submission.submitted_at).toLocaleDateString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Growth</span>
                      <span className="text-sm text-green-600">+12% this month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Open Call Activity</span>
                      <span className="text-sm text-green-600">+8% this month</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Revenue Growth</span>
                      <span className="text-sm text-green-600">+15% this month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
