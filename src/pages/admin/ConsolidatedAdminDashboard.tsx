
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Settings,
  Shield,
  TrendingUp,
  Activity,
  FileText,
  Film,
  Database,
  Eye,
  Award,
  DollarSign,
  Download,
  UserCheck,
  Crown,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import EnhancedUserManagement from '@/components/admin/EnhancedUserManagement';
import AdminOpenCallManagement from '@/components/admin/AdminOpenCallManagement';
import ContentManagementPanel from '@/components/admin/ContentManagementPanel';
import AIFilm3ManagementPanel from '@/components/admin/AIFilm3ManagementPanel';
import AdminDebugInfo from '@/components/admin/AdminDebugInfo';
import CreateOpenCallDialog from '@/components/admin/CreateOpenCallDialog';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import PerformanceOptimizer from '@/components/performance/PerformanceOptimizer';

const ConsolidatedAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { platformStats, platformLoading } = useAnalytics();
  const { user } = useAuth();
  const { data: userRole } = useAdminCheck();

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
      icon: FileText,
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
      value: '3',
      icon: UserCheck,
    },
  ];

  const isCurrentUserPrimaryAdmin = user?.email === 'lshot.crypto@gmail.com';

  return (
    <PerformanceOptimizer dependencies={[platformStats, activeTab]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
          <div className="container mx-auto px-6 py-4">
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
                {isCurrentUserPrimaryAdmin && (
                  <Badge variant="destructive">
                    <Crown className="h-3 w-3 mr-1" />
                    Primary Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 h-12">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="open-calls" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Open Calls
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="aifilm3" className="flex items-center gap-2">
                <Film className="h-4 w-4" />
                AIFilm3
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Real-time Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewCards.map((card) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
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
                  </motion.div>
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
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('users')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Manage Users
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('open-calls')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Open Calls Hub
                    </CardTitle>
                    <CardDescription>Review applications and manage submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Review Applications
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('analytics')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Analytics Deep Dive
                    </CardTitle>
                    <CardDescription>Comprehensive platform analytics and insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Platform Analytics & Insights
                  </CardTitle>
                  <CardDescription>
                    Comprehensive real-time analytics and platform performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminAnalyticsDashboard />
                </CardContent>
              </Card>
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
                  <EnhancedUserManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="open-calls">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Open Calls Management & Curation</h2>
                    <p className="text-muted-foreground">Create, manage, and curate open calls for artists</p>
                  </div>
                  <CreateOpenCallDialog />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Open Calls Dashboard
                    </CardTitle>
                    <CardDescription>
                      Manage open calls, submissions, curation, and host applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminOpenCallManagement />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Content & Feature Management
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

                {isCurrentUserPrimaryAdmin && (
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-700">
                        <Crown className="h-5 w-5" />
                        Primary Admin Controls
                      </CardTitle>
                      <CardDescription>Critical system configurations (Primary Admin only)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-orange-200 rounded-lg">
                          <h4 className="font-medium text-orange-800">System-wide Settings</h4>
                          <p className="text-sm text-orange-600">Control platform banners, notices, and critical configurations</p>
                          <Button variant="outline" className="mt-2" size="sm">
                            Access Settings
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PerformanceOptimizer>
  );
};

export default ConsolidatedAdminDashboard;
