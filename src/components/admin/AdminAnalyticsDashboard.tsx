
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import RealTimeAnalytics from './RealTimeAnalytics';

const AdminAnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Platform Analytics & Insights
        </h2>
        <p className="text-muted-foreground">
          Comprehensive analytics dashboard with real-time data and insights
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Platform Overview
              </CardTitle>
              <CardDescription>
                High-level platform metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-time Analytics
              </CardTitle>
              <CardDescription>
                Live platform data with automatic updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealTimeAnalytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Detailed Analytics
              </CardTitle>
              <CardDescription>
                In-depth analysis and comprehensive platform insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsDashboard />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsDashboard;
