
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { TrendingUp, Users, Palette, Activity, Globe, MapPin } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const RealTimeAnalytics = () => {
  const { platformStats, platformLoading, platformError } = useAnalytics();

  if (platformLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
        <p className="ml-2">Loading analytics...</p>
      </div>
    );
  }

  if (platformError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading analytics. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Locations */}
      {platformStats?.topLocations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top User Locations
            </CardTitle>
            <CardDescription>Geographic distribution of platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {platformStats.topLocations.map((location, index) => (
                <div key={location.location} className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Globe className="h-3 w-3 text-primary" />
                    <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                  </div>
                  <p className="font-medium text-sm">{location.location}</p>
                  <p className="text-lg font-bold text-primary">{location.count}</p>
                  <p className="text-xs text-muted-foreground">users</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformStats?.newUsersThisMonth && platformStats?.totalUsers 
                ? `${Math.round((platformStats.newUsersThisMonth / platformStats.totalUsers) * 100)}%`
                : '0%'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly user growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-600" />
              Artist Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformStats?.totalArtists && platformStats?.totalUsers
                ? `${Math.round((platformStats.totalArtists / platformStats.totalUsers) * 100)}%`
                : '0%'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Users with portfolios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-600" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformStats?.totalPortfolios && platformStats?.totalArtworks
                ? Math.round(platformStats.totalArtworks / platformStats.totalPortfolios)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Avg artworks per portfolio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Platform Status</CardTitle>
          <CardDescription>Live platform metrics updated every 30 seconds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Updates Active</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Data Synced</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">Analytics Active</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">Admin Controls</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAnalytics;
