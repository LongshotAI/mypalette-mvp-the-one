
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Users,
  Palette,
  Image,
  TrendingUp,
  Eye,
  Heart,
  MapPin,
  Brush
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AnalyticsDashboard = () => {
  const { platformStats, platformLoading } = useAnalytics();

  if (platformLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!platformStats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: platformStats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Artists',
      value: platformStats.totalArtists.toLocaleString(),
      icon: Brush,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Portfolios',
      value: platformStats.totalPortfolios.toLocaleString(),
      icon: Palette,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Artworks',
      value: platformStats.totalArtworks.toLocaleString(),
      icon: Image,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Open Calls',
      value: platformStats.totalOpenCalls.toLocaleString(),
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'New Users (30d)',
      value: platformStats.newUsersThisMonth.toLocaleString(),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Platform Analytics</h2>
        <p className="text-muted-foreground">
          Overview of MyPalette platform performance and user engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Artistic Mediums */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brush className="h-5 w-5" />
              Popular Artistic Mediums
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformStats.popularArtisticMediums}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="medium" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Artist Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformStats.topLocations.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ location, percent }) => `${location} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {platformStats.topLocations.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Growth Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {((platformStats.totalArtists / platformStats.totalUsers) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Artist Conversion Rate</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {(platformStats.totalPortfolios / Math.max(platformStats.totalArtists, 1)).toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Avg Portfolios per Artist</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {(platformStats.totalSubmissions / Math.max(platformStats.totalOpenCalls, 1)).toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Avg Submissions per Call</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900">System Status</p>
                <p className="text-sm text-green-700">All systems operational</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Active Users</p>
                <p className="text-sm text-blue-700">{platformStats.activeUsers} online</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-900">Growth</p>
                <p className="text-sm text-purple-700">+{platformStats.newUsersThisMonth} this month</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <Palette className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Content</p>
                <p className="text-sm text-orange-700">{platformStats.totalArtworks} artworks</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
