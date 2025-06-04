
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Heart, 
  Users, 
  TrendingUp,
  Calendar,
  Palette
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import { useSocialStats } from '@/hooks/useSocialStats';
import { format, subDays } from 'date-fns';

const UserAnalytics = () => {
  const { getUserStats } = useUserAnalytics();
  const { stats: socialStats, loading: socialLoading } = useSocialStats();

  const { data: userStats, isLoading: statsLoading } = getUserStats;

  if (statsLoading || socialLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded w-3/4 mt-2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  // Generate sample view data for the last 30 days
  const viewsData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, 'MMM dd'),
      views: Math.floor(Math.random() * 50) + 10,
    };
  });

  const stats = [
    {
      title: 'Total Portfolio Views',
      value: userStats?.totalViews || 0,
      icon: Eye,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Followers',
      value: socialStats?.followersCount || 0,
      icon: Users,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Following',
      value: socialStats?.followingCount || 0,
      icon: Heart,
      change: '+3%',
      changeType: 'positive' as const,
    },
    {
      title: 'Portfolios',
      value: userStats?.totalPortfolios || 0,
      icon: Palette,
      change: '+1',
      changeType: 'positive' as const,
    },
    {
      title: 'Profile Views',
      value: Math.floor((userStats?.totalViews || 0) * 0.3),
      icon: TrendingUp,
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'This Month',
      value: Math.floor((userStats?.totalViews || 0) * 0.4),
      icon: Calendar,
      change: '+22%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Analytics</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          <TrendingUp className="h-3 w-3 mr-1" />
          Personal Insights
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        {/* Views Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Views</CardTitle>
            <CardDescription>Your portfolio views over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>How users interact with your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Portfolio Completion</span>
                <div className="flex items-center">
                  <div className="w-20 h-2 bg-muted rounded-full mr-2">
                    <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Profile Views</span>
                <div className="flex items-center">
                  <div className="w-20 h-2 bg-muted rounded-full mr-2">
                    <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">72%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Social Engagement</span>
                <div className="flex items-center">
                  <div className="w-20 h-2 bg-muted rounded-full mr-2">
                    <div className="w-3/5 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">68%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Growth Rate</span>
                <div className="flex items-center">
                  <div className="w-20 h-2 bg-muted rounded-full mr-2">
                    <div className="w-4/6 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAnalytics;
