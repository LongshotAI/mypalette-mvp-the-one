
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlatformStats {
  totalArtists: number;
  totalPortfolios: number;
  totalOpenCalls: number;
  totalArtworks: number;
  activeOpenCalls: number;
  featuredArtists: number;
}

export const usePlatformStats = () => {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: async (): Promise<PlatformStats> => {
      console.log('Fetching platform statistics...');

      // Get total artists (users with portfolios or artworks)
      const { data: artistsData, error: artistsError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      if (artistsError) throw artistsError;

      // Get total portfolios
      const { data: portfoliosData, error: portfoliosError } = await supabase
        .from('portfolios')
        .select('id', { count: 'exact' });

      if (portfoliosError) throw portfoliosError;

      // Get total open calls
      const { data: openCallsData, error: openCallsError } = await supabase
        .from('open_calls')
        .select('id', { count: 'exact' });

      if (openCallsError) throw openCallsError;

      // Get active open calls
      const { data: activeCallsData, error: activeCallsError } = await supabase
        .from('open_calls')
        .select('id', { count: 'exact' })
        .eq('status', 'live')
        .gt('submission_deadline', new Date().toISOString());

      if (activeCallsError) throw activeCallsError;

      // Get total artworks
      const { data: artworksData, error: artworksError } = await supabase
        .from('artworks')
        .select('id', { count: 'exact' });

      if (artworksError) throw artworksError;

      // Get featured artists (users with featured portfolios)
      const { data: featuredData, error: featuredError } = await supabase
        .from('featured_content')
        .select('content_id', { count: 'exact' })
        .eq('content_type', 'portfolio')
        .eq('is_active', true);

      if (featuredError) throw featuredError;

      const stats: PlatformStats = {
        totalArtists: artistsData?.length || 0,
        totalPortfolios: portfoliosData?.length || 0,
        totalOpenCalls: openCallsData?.length || 0,
        totalArtworks: artworksData?.length || 0,
        activeOpenCalls: activeCallsData?.length || 0,
        featuredArtists: featuredData?.length || 0,
      };

      console.log('Platform stats fetched:', stats);
      return stats;
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
