
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlatformStats {
  totalUsers: number;
  totalArtists: number;
  totalPortfolios: number;
  totalArtworks: number;
  totalOpenCalls: number;
  totalSubmissions: number;
  activeUsers: number;
  newUsersThisMonth: number;
  popularArtisticMediums: Array<{ medium: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    userId?: string;
  }>;
}

export interface UserAnalytics {
  profileViews: number;
  portfolioViews: number;
  totalLikes: number;
  followerCount: number;
  followingCount: number;
  submissionCount: number;
  viewsByMonth: Array<{ month: string; views: number }>;
  topPortfolios: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
  }>;
}

export const useAnalytics = () => {
  // Platform-wide analytics
  const { data: platformStats, isLoading: platformLoading } = useQuery({
    queryKey: ['platform-analytics'],
    queryFn: async (): Promise<PlatformStats> => {
      console.log('Fetching platform analytics...');

      const [
        usersResponse,
        artistsResponse,
        portfoliosResponse,
        artworksResponse,
        openCallsResponse,
        submissionsResponse,
        recentUsersResponse
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }).not('artistic_medium', 'is', null),
        supabase.from('portfolios').select('id', { count: 'exact' }),
        supabase.from('artworks').select('id', { count: 'exact' }),
        supabase.from('open_calls').select('id', { count: 'exact' }),
        supabase.from('submissions').select('id', { count: 'exact' }),
        supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      // Get popular artistic mediums
      const { data: mediums } = await supabase
        .from('profiles')
        .select('artistic_medium')
        .not('artistic_medium', 'is', null);

      const mediumCounts = mediums?.reduce((acc, { artistic_medium }) => {
        acc[artistic_medium] = (acc[artistic_medium] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const popularArtisticMediums = Object.entries(mediumCounts)
        .map(([medium, count]) => ({ medium, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Get top locations
      const { data: locations } = await supabase
        .from('profiles')
        .select('location')
        .not('location', 'is', null);

      const locationCounts = locations?.reduce((acc, { location }) => {
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topLocations = Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalUsers: usersResponse.count || 0,
        totalArtists: artistsResponse.count || 0,
        totalPortfolios: portfoliosResponse.count || 0,
        totalArtworks: artworksResponse.count || 0,
        totalOpenCalls: openCallsResponse.count || 0,
        totalSubmissions: submissionsResponse.count || 0,
        activeUsers: usersResponse.count || 0, // Could be enhanced with last_seen tracking
        newUsersThisMonth: recentUsersResponse.count || 0,
        popularArtisticMediums,
        topLocations,
        recentActivity: [] // Could be enhanced with activity tracking
      };
    },
  });

  // User-specific analytics
  const getUserAnalytics = (userId: string) => {
    return useQuery({
      queryKey: ['user-analytics', userId],
      queryFn: async (): Promise<UserAnalytics> => {
        console.log('Fetching user analytics for:', userId);

        const [
          portfoliosResponse,
          followersResponse,
          followingResponse,
          submissionsResponse
        ] = await Promise.all([
          supabase
            .from('portfolios')
            .select('id, title, view_count')
            .eq('user_id', userId),
          supabase
            .from('follows')
            .select('id', { count: 'exact' })
            .eq('following_id', userId),
          supabase
            .from('follows')
            .select('id', { count: 'exact' })
            .eq('follower_id', userId),
          supabase
            .from('submissions')
            .select('id', { count: 'exact' })
            .eq('artist_id', userId)
        ]);

        const portfolios = portfoliosResponse.data || [];
        const totalPortfolioViews = portfolios.reduce((sum, p) => sum + (p.view_count || 0), 0);

        // Get portfolio likes
        const { data: likes } = await supabase
          .from('portfolio_likes')
          .select('id', { count: 'exact' })
          .in('portfolio_id', portfolios.map(p => p.id));

        const topPortfolios = portfolios
          .map(portfolio => ({
            id: portfolio.id,
            title: portfolio.title,
            views: portfolio.view_count || 0,
            likes: 0 // Would need to count likes per portfolio
          }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        return {
          profileViews: 0, // Would need profile view tracking
          portfolioViews: totalPortfolioViews,
          totalLikes: likes?.length || 0,
          followerCount: followersResponse.count || 0,
          followingCount: followingResponse.count || 0,
          submissionCount: submissionsResponse.count || 0,
          viewsByMonth: [], // Would need time-series data
          topPortfolios
        };
      },
      enabled: !!userId
    });
  };

  return {
    platformStats,
    platformLoading,
    getUserAnalytics
  };
};
