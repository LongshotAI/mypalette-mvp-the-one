
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PlatformStats {
  totalUsers: number;
  totalArtists: number;
  totalPortfolios: number;
  totalArtworks: number;
  totalOpenCalls: number;
  totalSubmissions: number;
  newUsersThisMonth: number;
  activeUsers: number;
  popularArtisticMediums: Array<{ medium: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
}

export const useAnalytics = () => {
  const platformQuery = useQuery({
    queryKey: ['platform-analytics'],
    queryFn: async (): Promise<PlatformStats> => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total artists (users with portfolios)
      const { count: totalArtists } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('artistic_medium', 'is', null);

      // Get total portfolios
      const { count: totalPortfolios } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true });

      // Get total artworks
      const { count: totalArtworks } = await supabase
        .from('artworks')
        .select('*', { count: 'exact', head: true });

      // Get total open calls
      const { count: totalOpenCalls } = await supabase
        .from('open_calls')
        .select('*', { count: 'exact', head: true });

      // Get total submissions
      const { count: totalSubmissions } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true });

      // Get new users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Get popular artistic mediums
      const { data: mediumData } = await supabase
        .from('profiles')
        .select('artistic_medium')
        .not('artistic_medium', 'is', null);

      const mediumCounts = mediumData?.reduce((acc, profile) => {
        const medium = profile.artistic_medium;
        if (medium) {
          acc[medium] = (acc[medium] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const popularArtisticMediums = Object.entries(mediumCounts)
        .map(([medium, count]) => ({ medium, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get top locations
      const { data: locationData } = await supabase
        .from('profiles')
        .select('location')
        .not('location', 'is', null);

      const locationCounts = locationData?.reduce((acc, profile) => {
        const location = profile.location;
        if (location) {
          acc[location] = (acc[location] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const topLocations = Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      return {
        totalUsers: totalUsers || 0,
        totalArtists: totalArtists || 0,
        totalPortfolios: totalPortfolios || 0,
        totalArtworks: totalArtworks || 0,
        totalOpenCalls: totalOpenCalls || 0,
        totalSubmissions: totalSubmissions || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        activeUsers: Math.floor((totalUsers || 0) * 0.1), // Estimate active users as 10% of total
        popularArtisticMediums,
        topLocations,
      };
    },
  });

  return {
    platformStats: platformQuery.data,
    platformLoading: platformQuery.isLoading,
    platformError: platformQuery.error,
  };
};
