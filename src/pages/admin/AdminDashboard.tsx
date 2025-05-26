
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, Palette, Briefcase, BookOpen, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const stats = {
    totalUsers: 2847,
    activeArtists: 1923,
    totalPortfolios: 5432,
    totalOpenCalls: 127,
    pendingApprovals: 23,
    recentSignups: 145
  };

  const recentActivity = [
    { type: 'user', message: 'New user registration: johndoe@example.com', time: '5 minutes ago', status: 'info' },
    { type: 'portfolio', message: 'Portfolio "Digital Dreams" submitted for review', time: '15 minutes ago', status: 'pending' },
    { type: 'open_call', message: 'Open call "Modern Art Exhibition" approved', time: '1 hour ago', status: 'success' },
    { type: 'report', message: 'Content report filed for portfolio #1234', time: '2 hours ago', status: 'warning' }
  ];

  const quickActions = [
    { title: 'Review Portfolios', description: '5 portfolios pending approval', path: '/admin/portfolios', color: 'bg-blue-500' },
    { title: 'Manage Open Calls', description: '3 open calls need review', path: '/admin/open-calls', color: 'bg-green-500' },
    { title: 'User Management', description: 'Manage user accounts and roles', path: '/admin/users', color: 'bg-purple-500' },
    { title: 'Content Moderation', description: '8 reports to review', path: '/admin/moderation', color: 'bg-orange-500' }
  ];

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
            <p className="text-muted-foreground">Monitor and manage the MyPalette platform</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Artists</p>
                    <p className="text-2xl font-bold">{stats.activeArtists.toLocaleString()}</p>
                  </div>
                  <Palette className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolios</p>
                    <p className="text-2xl font-bold">{stats.totalPortfolios.toLocaleString()}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Calls</p>
                    <p className="text-2xl font-bold">{stats.totalOpenCalls}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Signups</p>
                    <p className="text-2xl font-bold">+{stats.recentSignups}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                        {action.title.includes('Portfolio') && <Palette className="h-5 w-5 text-white" />}
                        {action.title.includes('Open') && <Briefcase className="h-5 w-5 text-white" />}
                        {action.title.includes('User') && <Users className="h-5 w-5 text-white" />}
                        {action.title.includes('Content') && <AlertCircle className="h-5 w-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'warning' ? 'bg-yellow-500' :
                          activity.status === 'pending' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant={
                          activity.status === 'success' ? 'default' :
                          activity.status === 'warning' ? 'destructive' :
                          'secondary'
                        }>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Database: Operational</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">File Storage: Operational</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Email Service: Operational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
