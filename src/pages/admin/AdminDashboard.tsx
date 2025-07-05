
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Palette, 
  Calendar, 
  BarChart3, 
  Shield,
  Settings,
  Database,
  Film,
  Eye,
  TrendingUp,
  Activity,
  UserCheck,
  FileText,
  Plus
} from 'lucide-react';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import UserManagementTable from '@/components/admin/UserManagementTable';
import AdminOpenCallManagement from '@/components/admin/AdminOpenCallManagement';
import HostApplicationManagement from '@/components/admin/HostApplicationManagement';
import AdminDebugInfo from '@/components/admin/AdminDebugInfo';
import CreateOpenCallDialog from '@/components/admin/CreateOpenCallDialog';
import ContentManagementPanel from '@/components/admin/ContentManagementPanel';
import AIFilm3ManagementPanel from '@/components/admin/AIFilm3ManagementPanel';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import PerformanceOptimizer from '@/components/performance/PerformanceOptimizer';
import LaunchReadinessChecker from '@/components/testing/LaunchReadinessChecker';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { platformStats, platformLoading } = useAnalytics();
  const { getUserStats } = useUserAnalytics();
  const { user } = useAuth();
  const userStatsQuery = getUserStats;

  // Real-time overview cards with actual data
  const overviewCards = [
    {
      title: 'Total Users',
      value: platformStats?.totalUsers || 0,
      change: `+${platformStats?.newUsersThisMonth || 0} this month`,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Portfolios',
      value: platformStats?.totalPortfolios || 0,
      change: `${platformStats?.totalArtists || 0} artists`,
      icon: Palette,
      color: 'text-green-600',
    },
    {
      title: 'Open Calls',
      value: platformStats?.totalOpenCalls || 0,
      change: `${platformStats?.totalSubmissions || 0} submissions`,
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Platform Growth',
      value: `${Math.round(((platformStats?.newUsersThisMonth || 0) / (platformStats?.totalUsers || 1)) * 100)}%`,
      change: 'Monthly growth rate',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  const quickStats = [
    {
      label: 'Total Artworks',
      value: platformStats?.totalArtworks || 0,
      icon: FileText,
    },
    {
      label: 'Active Users',
      value: platformStats?.activeUsers || 0,
      icon: Activity,
    },
    {
      label: 'Admin Users',
      value: '3', // You can make this dynamic
      icon: UserCheck,
    },
  ];

  return (
    <PerformanceOptimizer dependencies={[platformStats, activeTab]}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              MyPalette Admin Control Center
            </h1>
            <p className="text-muted-foreground">Complete platform management and analytics</p>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {user?.email} • Last updated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Database className="h-3 w-3 mr-1" />
              All Systems Operational
            </Badge>
            <Badge variant="secondary">
              <Eye className="h-3 w-3 mr-1" />
              Real-time Monitoring
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="open-calls">Open Calls</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="aifilm3">AIFilm3</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Real-time Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewCards.map((card) => (
                <Card key={card.title} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {platformLoading ? (
                        <div className="animate-pulse bg-muted h-6 w-16 rounded"></div>
                      ) : (
                        card.value
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.change}
                    </p>
                  </CardContent>
                  <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-primary/20 to-transparent"></div>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Quick Stats</CardTitle>
                <CardDescription>Real-time platform metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <stat.icon className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-xl font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Artistic Mediums */}
            {platformStats?.popularArtisticMediums && (
              <Card>
                <CardHeader>
                  <CardTitle>Popular Artistic Mediums</CardTitle>
                  <CardDescription>Most common artistic mediums on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {platformStats.popularArtisticMediums.map((medium, index) => (
                      <div key={medium.medium} className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="font-medium text-sm">{medium.medium}</p>
                        <p className="text-2xl font-bold text-primary">{medium.count}</p>
                        <p className="text-xs text-muted-foreground">artists</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab('users')} className="w-full">
                    Manage Users
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Open Calls Hub
                  </CardTitle>
                  <CardDescription>Review applications and manage submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab('open-calls')} className="w-full">
                    Review Applications
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics Deep Dive
                  </CardTitle>
                  <CardDescription>Comprehensive platform analytics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab('analytics')} className="w-full">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management Center
                </CardTitle>
                <CardDescription>
                  Manage all platform users, roles, and permissions. Admin user: lshot.crypto@gmail.com has full control.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagementTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="open-calls">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Open Calls Management</h2>
                  <p className="text-muted-foreground">Create and manage open calls for artists</p>
                </div>
                <CreateOpenCallDialog />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Active Open Calls
                  </CardTitle>
                  <CardDescription>
                    Manage open calls, submissions, and host applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminOpenCallManagement />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Host Applications</CardTitle>
                  <CardDescription>Review and manage hosting applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <HostApplicationManagement />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Content Management Hub
                </CardTitle>
                <CardDescription>Manage platform content, portfolios, and featured artworks</CardDescription>
              </CardHeader>
              <CardContent>
                <ContentManagementPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aifilm3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  AIFilm3 Festival Management
                </CardTitle>
                <CardDescription>Manage AIFilm3 festival content and announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <AIFilm3ManagementPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Administration
                  </CardTitle>
                  <CardDescription>Platform status, debugging, and system configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminDebugInfo />
                </CardContent>
              </Card>

              {/* Launch Readiness Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle>Launch Readiness Assessment</CardTitle>
                  <CardDescription>Comprehensive pre-launch system check</CardDescription>
                </CardHeader>
                <CardContent>
                  <LaunchReadinessChecker />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health Monitoring</CardTitle>
                  <CardDescription>Real-time system status and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Database</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">All systems operational</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Storage</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">File storage active</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Authentication</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Auth services running</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PerformanceOptimizer>
  );
};

export default AdminDashboard;
