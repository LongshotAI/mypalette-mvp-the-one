
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PortfolioAnalyticsProps {
  portfolioId?: string;
  showOverview?: boolean;
}

interface AnalyticsData {
  totalViews: number;
  uniqueViewers: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  dailyViews: Array<{ date: string; views: number }>;
  topEvents: Array<{ event_type: string; count: number }>;
}

const PortfolioAnalytics = ({ portfolioId, showOverview = false }: PortfolioAnalyticsProps) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (portfolioId || showOverview)) {
      fetchAnalytics();
    }
  }, [user, portfolioId, showOverview]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      if (showOverview) {
        // Fetch analytics for all user's portfolios
        const { data: portfolios } = await supabase
          .from('portfolios')
          .select('id')
          .eq('user_id', user?.id);

        if (!portfolios) return;

        const portfolioIds = portfolios.map(p => p.id);
        
        // Get views for all portfolios
        const { data: views } = await supabase
          .from('portfolio_views')
          .select('created_at, viewer_id, portfolio_id')
          .in('portfolio_id', portfolioIds);

        // Get analytics events
        const { data: events } = await supabase
          .from('portfolio_analytics')
          .select('event_type, created_at, portfolio_id')
          .in('portfolio_id', portfolioIds);

        processAnalyticsData(views || [], events || []);
      } else if (portfolioId) {
        // Fetch analytics for specific portfolio
        const { data: views } = await supabase
          .from('portfolio_views')
          .select('created_at, viewer_id')
          .eq('portfolio_id', portfolioId);

        const { data: events } = await supabase
          .from('portfolio_analytics')
          .select('event_type, created_at')
          .eq('portfolio_id', portfolioId);

        processAnalyticsData(views || [], events || []);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (views: any[], events: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate view metrics
    const totalViews = views.length;
    const uniqueViewers = new Set(views.map(v => v.viewer_id).filter(Boolean)).size;
    
    const viewsToday = views.filter(v => new Date(v.created_at) >= today).length;
    const viewsThisWeek = views.filter(v => new Date(v.created_at) >= weekAgo).length;
    const viewsThisMonth = views.filter(v => new Date(v.created_at) >= monthAgo).length;

    // Process daily views for chart
    const dailyViewsMap = new Map<string, number>();
    views.forEach(view => {
      const date = new Date(view.created_at).toISOString().split('T')[0];
      dailyViewsMap.set(date, (dailyViewsMap.get(date) || 0) + 1);
    });

    const dailyViews = Array.from(dailyViewsMap.entries())
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days

    // Process top events
    const eventCounts = new Map<string, number>();
    events.forEach(event => {
      eventCounts.set(event.event_type, (eventCounts.get(event.event_type) || 0) + 1);
    });

    const topEvents = Array.from(eventCounts.entries())
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setAnalytics({
      totalViews,
      uniqueViewers,
      viewsToday,
      viewsThisWeek,
      viewsThisMonth,
      dailyViews,
      topEvents
    });
  };

  // Track analytics events
  const trackEvent = async (eventType: string, eventData: any = {}) => {
    if (!portfolioId || !user) return;

    try {
      await supabase.rpc('track_portfolio_analytics', {
        p_portfolio_id: portfolioId,
        p_event_type: eventType,
        p_event_data: eventData
      });
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">Total Views</span>
            </div>
            <div className="text-2xl font-bold mt-2">{analytics.totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Unique Viewers</span>
            </div>
            <div className="text-2xl font-bold mt-2">{analytics.uniqueViewers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-muted-foreground">This Week</span>
            </div>
            <div className="text-2xl font-bold mt-2">{analytics.viewsThisWeek}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-muted-foreground">Today</span>
            </div>
            <div className="text-2xl font-bold mt-2">{analytics.viewsToday}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Views (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topEvents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event_type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;
