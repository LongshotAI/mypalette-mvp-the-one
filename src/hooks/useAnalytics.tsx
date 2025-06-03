
import { useQuery } from '@tanstack/react-query';

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
  // Placeholder analytics data until database queries are implemented
  const platformQuery = useQuery({
    queryKey: ['platform-analytics'],
    queryFn: async (): Promise<PlatformStats> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        totalUsers: 1250,
        totalArtists: 350,
        totalPortfolios: 180,
        totalArtworks: 2400,
        totalOpenCalls: 25,
        totalSubmissions: 140,
        newUsersThisMonth: 85,
        activeUsers: 42,
        popularArtisticMediums: [
          { medium: 'Digital Art', count: 85 },
          { medium: 'Photography', count: 72 },
          { medium: 'Painting', count: 65 },
          { medium: 'Mixed Media', count: 45 },
          { medium: 'Sculpture', count: 38 },
        ],
        topLocations: [
          { location: 'New York, NY', count: 125 },
          { location: 'Los Angeles, CA', count: 98 },
          { location: 'London, UK', count: 76 },
          { location: 'Berlin, Germany', count: 54 },
          { location: 'Tokyo, Japan', count: 43 },
          { location: 'Paris, France', count: 38 },
        ],
      };
    },
  });

  return {
    platformStats: platformQuery.data,
    platformLoading: platformQuery.isLoading,
    platformError: platformQuery.error,
  };
};
