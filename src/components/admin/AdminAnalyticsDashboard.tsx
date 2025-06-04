
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Palette, 
  Eye, 
  TrendingUp, 
  Activity,
  Calendar,
  Award,
  MessageSquare
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminAnalyticsDashboard = () => {
  const { platformStats, platformLoading } = useAnalytics();

  if (platformLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4 mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: platformStats?.totalUsers || 0,
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Artists',
      value: platformStats?.totalArtists || 0,
      icon: Palette,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Portfolios',
      value: platformStats?.totalPortfolios || 0,
      icon: Eye,
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Artworks',
      value: platformStats?.totalArtworks || 0,
      icon: Activity,
      change: '+22%',
      changeType: 'positive' as const,
    },
    {
      title: 'Open Calls',
      value: platformStats?.totalOpenCalls || 0,
      icon: Calendar,
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Submissions',
      value: platformStats?.totalSubmissions || 0,
      icon: Award,
      change: '+18%',
      changeType: 'positive' as const,
    },
    {
      title: 'New This Month',
      value: platformStats?.newUsersThisMonth || 0,
      icon: TrendingUp,
      change: '+25%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Now',
      value: platformStats?.activeUsers || 0,
      icon: MessageSquare,
      change: '+3%',
      changeType: 'positive' as const,
    },
  ];

  // Sample data for charts
  const userGrowthData = [
    { name: 'Jan', users: 850, artists: 280 },
    { name: 'Feb', users: 920, artists: 310 },
    { name: 'Mar', users: 1080, artists: 340 },
    { name: 'Apr', users: 1150, artists: 350 },
    { name: 'May', users: 1250, artists: 350 },
  ];

  const mediumData = platformStats?.popularArtisticMediums?.map((medium, index) => ({
    ...medium,
    color: COLORS[index % COLORS.length]
  })) || [];

  const locationData = platformStats?.topLocations || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Activity className="h-3 w-3 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user and artist registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Total Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="artists" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Artists"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Artistic Mediums */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Art Mediums</CardTitle>
            <CardDescription>Distribution of artistic mediums on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mediumData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ medium, percent }) => `${medium} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {mediumData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Top User Locations</CardTitle>
            <CardDescription>Geographic distribution of users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="location" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User Engagement</span>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-muted rounded-full mr-2">
                  <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Portfolio Completion</span>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-muted rounded-full mr-2">
                  <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground">72%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Submission Rate</span>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-muted rounded-full mr-2">
                  <div className="w-3/5 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground">68%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Platform Uptime</span>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-muted rounded-full mr-2">
                  <div className="w-full h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground">99.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
