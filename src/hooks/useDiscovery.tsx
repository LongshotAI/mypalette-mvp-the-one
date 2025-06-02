
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Artist {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  artistic_medium: string | null;
  artistic_style: string | null;
  years_active: number | null;
  available_for_commission: boolean | null;
  created_at: string;
  portfolio_count?: number;
  follower_count?: number;
  is_following?: boolean;
}

export interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  cover_image: string | null;
  view_count: number | null;
  is_public: boolean | null;
  is_featured: boolean | null;
  created_at: string;
  profiles: {
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export interface SearchFilters {
  query: string;
  artisticMedium: string[];
  artisticStyle: string[];
  location: string;
  yearsActive: string;
  availableForCommission: boolean | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  selectedCategory: string;
}

export const useDiscovery = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    artisticMedium: [],
    artisticStyle: [],
    location: '',
    yearsActive: '',
    availableForCommission: null,
    sortBy: 'created_at',
    sortOrder: 'desc',
    selectedCategory: ''
  });

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  // Featured content query
  const featuredQuery = useQuery({
    queryKey: ['featured-content'],
    queryFn: async () => {
      console.log('Loading featured content...');
      
      const [artistsResponse, portfoliosResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .not('username', 'is', null)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('portfolios')
          .select(`
            *,
            profiles!inner (
              username,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('is_public', true)
          .eq('is_featured', true)
          .order('view_count', { ascending: false })
          .limit(6)
      ]);

      const result = {
        artists: artistsResponse.data?.length || 0,
        portfolios: portfoliosResponse.data?.length || 0
      };

      console.log('Featured content loaded:', result);
      return result;
    },
  });

  // Artists search query
  const artistsQuery = useQuery({
    queryKey: ['artists-search', filters, currentPage],
    queryFn: async () => {
      console.log('Searching artists with filters:', filters, 'page:', currentPage);
      
      let query = supabase
        .from('profiles')
        .select('*')
        .not('username', 'is', null);

      // Apply search filters
      if (filters.query) {
        // Fix the search query syntax - use 'or' filter properly
        query = query.or(`first_name.ilike.%${filters.query}%,last_name.ilike.%${filters.query}%,username.ilike.%${filters.query}%,bio.ilike.%${filters.query}%,artistic_medium.ilike.%${filters.query}%,artistic_style.ilike.%${filters.query}%`);
      }

      if (filters.artisticMedium.length > 0) {
        query = query.in('artistic_medium', filters.artisticMedium);
      }

      if (filters.artisticStyle.length > 0) {
        query = query.in('artistic_style', filters.artisticStyle);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.yearsActive) {
        const years = parseInt(filters.yearsActive);
        query = query.gte('years_active', years);
      }

      if (filters.availableForCommission !== null) {
        query = query.eq('available_for_commission', filters.availableForCommission);
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

      // Apply pagination
      const from = currentPage * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Error searching artists:', error);
        throw error;
      }

      console.log('Artists search result:', data);
      return data || [];
    },
  });

  // Portfolios search query
  const portfoliosQuery = useQuery({
    queryKey: ['portfolios-search', filters, currentPage],
    queryFn: async () => {
      console.log('Searching portfolios with filters:', filters, 'page:', currentPage);
      
      let query = supabase
        .from('portfolios')
        .select(`
          *,
          profiles!inner (
            username,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('is_public', true);

      // Apply search filters
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

      // Apply pagination
      const from = currentPage * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Error searching portfolios:', error);
        throw error;
      }

      console.log('Portfolios search result:', data);
      return data || [];
    },
  });

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(0); // Reset to first page when filters change
  };

  const nextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const followArtist = async (artistId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', (await supabase.auth.getUser()).data.user?.id)
          .eq('following_id', artistId);
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: (await supabase.auth.getUser()).data.user?.id,
            following_id: artistId
          });
      }
      
      // Refetch artists to update follow status
      artistsQuery.refetch();
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  return {
    filters,
    updateFilters,
    currentPage,
    nextPage,
    prevPage,
    featuredData: featuredQuery.data,
    featuredLoading: featuredQuery.isLoading,
    featuredError: featuredQuery.error,
    artists: artistsQuery.data || [],
    artistsLoading: artistsQuery.isLoading,
    artistsError: artistsQuery.error,
    portfolios: portfoliosQuery.data || [],
    portfoliosLoading: portfoliosQuery.isLoading,
    portfoliosError: portfoliosQuery.error,
    followArtist,
    refetchArtists: artistsQuery.refetch,
    refetchPortfolios: portfoliosQuery.refetch
  };
};
