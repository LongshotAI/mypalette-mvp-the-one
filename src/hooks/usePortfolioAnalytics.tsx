
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PortfolioAnalyticsData {
  totalViews: number;
  uniqueViewers: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  dailyViews: Array<{ date: string; views: number }>;
  topEvents: Array<{ event_type: string; count: number }>;
}

export const usePortfolioAnalytics = (portfolioId?: string) => {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trackView = async (portfolioId: string, viewerData?: any) => {
    try {
      await supabase.rpc('track_portfolio_view', {
        p_portfolio_id: portfolioId,
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const trackEvent = async (portfolioId: string, eventType: string, eventData?: any) => {
    try {
      await supabase.rpc('track_portfolio_analytics', {
        p_portfolio_id: portfolioId,
        p_event_type: eventType,
        p_event_data: eventData || {}
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      let portfolioIds: string[] = [];

      if (portfolioId) {
        portfolioIds = [portfolioId];
      } else {
        // Get all user's portfolios
        const { data: portfolios, error: portfoliosError } = await supabase
          .from('portfolios')
          .select('id')
          .eq('user_id', user.id);

        if (portfoliosError) throw portfoliosError;
        portfolioIds = portfolios?.map(p => p.id) || [];
      }

      if (portfolioIds.length === 0) {
        setData({
          totalViews: 0,
          uniqueViewers: 0,
          viewsToday: 0,
          viewsThisWeek: 0,
          viewsThisMonth: 0,
          dailyViews: [],
          topEvents: []
        });
        return;
      }

      // Get views
      const { data: views, error: viewsError } = await supabase
        .from('portfolio_views')
        .select('created_at, viewer_id, portfolio_id')
        .in('portfolio_id', portfolioIds);

      if (viewsError) throw viewsError;

      // Get analytics events
      const { data: events, error: eventsError } = await supabase
        .from('portfolio_analytics')
        .select('event_type, created_at, portfolio_id')
        .in('portfolio_id', portfolioIds);

      if (eventsError) throw eventsError;

      // Process data
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const totalViews = views?.length || 0;
      const uniqueViewers = new Set(views?.map(v => v.viewer_id).filter(Boolean)).size;
      
      const viewsToday = views?.filter(v => new Date(v.created_at) >= today).length || 0;
      const viewsThisWeek = views?.filter(v => new Date(v.created_at) >= weekAgo).length || 0;
      const viewsThisMonth = views?.filter(v => new Date(v.created_at) >= monthAgo).length || 0;

      // Daily views
      const dailyViewsMap = new Map<string, number>();
      views?.forEach(view => {
        const date = new Date(view.created_at).toISOString().split('T')[0];
        dailyViewsMap.set(date, (dailyViewsMap.get(date) || 0) + 1);
      });

      const dailyViews = Array.from(dailyViewsMap.entries())
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30);

      // Top events
      const eventCounts = new Map<string, number>();
      events?.forEach(event => {
        eventCounts.set(event.event_type, (eventCounts.get(event.event_type) || 0) + 1);
      });

      const topEvents = Array.from(eventCounts.entries())
        .map(([event_type, count]) => ({ event_type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setData({
        totalViews,
        uniqueViewers,
        viewsToday,
        viewsThisWeek,
        viewsThisMonth,
        dailyViews,
        topEvents
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, portfolioId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAnalytics,
    trackView,
    trackEvent
  };
};
