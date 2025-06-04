
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserAnalytics = () => {
  const trackEvent = useMutation({
    mutationFn: async ({ eventType, eventData }: { eventType: string; eventData?: any }) => {
      const { error } = await supabase.rpc('track_user_event', {
        p_event_type: eventType,
        p_event_data: eventData || {}
      });

      if (error) throw error;
    },
  });

  const getUserStats = useQuery({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get portfolio views
      const { data: portfolioViews } = await supabase
        .from('portfolio_views')
        .select('portfolio_id, created_at')
        .eq('viewer_id', user.id);

      // Get user events
      const { data: userEvents } = await supabase
        .from('user_analytics')
        .select('event_type, created_at')
        .eq('user_id', user.id);

      // Get portfolio stats
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select('id, view_count, created_at')
        .eq('user_id', user.id);

      return {
        portfolioViews: portfolioViews || [],
        userEvents: userEvents || [],
        portfolios: portfolios || [],
        totalViews: portfolios?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0,
        totalPortfolios: portfolios?.length || 0,
      };
    },
  });

  const trackPortfolioView = useMutation({
    mutationFn: async (portfolioId: string) => {
      const { error } = await supabase.rpc('track_portfolio_view', {
        p_portfolio_id: portfolioId
      });

      if (error) throw error;
    },
  });

  return {
    trackEvent,
    getUserStats,
    trackPortfolioView,
  };
};
