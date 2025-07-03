import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePlatformStats = () => {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      console.log('Fetching platform statistics...');

      // Get total registered users
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('Error fetching users count:', usersError);
        throw usersError;
      }

      // Get total active portfolios
      const { count: totalPortfolios, error: portfoliosError } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true })
        .eq('is_public', true);

      if (portfoliosError) {
        console.error('Error fetching portfolios count:', portfoliosError);
        throw portfoliosError;
      }

      // Get current live open calls
      const { count: totalOpenCalls, error: openCallsError } = await supabase
        .from('open_calls')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'live');

      if (openCallsError) {
        console.error('Error fetching open calls count:', openCallsError);
        throw openCallsError;
      }

      console.log('Platform stats fetched:', {
        totalUsers,
        totalPortfolios,
        totalOpenCalls
      });

      return {
        totalUsers: totalUsers || 0,
        totalPortfolios: totalPortfolios || 0,
        totalOpenCalls: totalOpenCalls || 0
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};