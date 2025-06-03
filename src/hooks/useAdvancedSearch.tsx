
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdvancedSearchFilters {
  query: string;
  artisticMediums: string[];
  artisticStyles: string[];
  locations: string[];
  yearRange: [number, number];
  availableForCommission: boolean | null;
  portfolioType: string[];
  sortBy: 'relevance' | 'date' | 'popularity' | 'alphabetical';
  sortOrder: 'asc' | 'desc';
}

export interface SearchResult {
  type: 'artist' | 'portfolio' | 'artwork';
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  artistName?: string;
  artistId?: string;
  relevanceScore: number;
}

export const useAdvancedSearch = () => {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    query: '',
    artisticMediums: [],
    artisticStyles: [],
    locations: [],
    yearRange: [1900, new Date().getFullYear()],
    availableForCommission: null,
    portfolioType: [],
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const [isSearching, setIsSearching] = useState(false);

  // Search suggestions
  const { data: suggestions } = useQuery({
    queryKey: ['search-suggestions', filters.query],
    queryFn: async () => {
      if (filters.query.length < 2) return [];

      const [artistsResponse, portfoliosResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('username, first_name, last_name, artistic_medium')
          .or(`first_name.ilike.%${filters.query}%,last_name.ilike.%${filters.query}%,username.ilike.%${filters.query}%`)
          .limit(5),
        supabase
          .from('portfolios')
          .select('title, slug')
          .ilike('title', `%${filters.query}%`)
          .eq('is_public', true)
          .limit(5)
      ]);

      const suggestions = [];
      
      if (artistsResponse.data) {
        suggestions.push(...artistsResponse.data.map(artist => ({
          type: 'artist' as const,
          label: `${artist.first_name} ${artist.last_name}`.trim() || artist.username,
          value: artist.username
        })));
      }

      if (portfoliosResponse.data) {
        suggestions.push(...portfoliosResponse.data.map(portfolio => ({
          type: 'portfolio' as const,
          label: portfolio.title,
          value: portfolio.slug
        })));
      }

      return suggestions;
    },
    enabled: filters.query.length >= 2
  });

  // Main search function
  const performSearch = async (): Promise<SearchResult[]> => {
    setIsSearching(true);
    
    try {
      const results: SearchResult[] = [];

      // Search artists
      if (filters.query || filters.artisticMediums.length || filters.artisticStyles.length || filters.locations.length) {
        let artistQuery = supabase
          .from('profiles')
          .select('*')
          .not('username', 'is', null);

        if (filters.query) {
          artistQuery = artistQuery.or(`first_name.ilike.%${filters.query}%,last_name.ilike.%${filters.query}%,username.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`);
        }

        if (filters.artisticMediums.length) {
          artistQuery = artistQuery.in('artistic_medium', filters.artisticMediums);
        }

        if (filters.artisticStyles.length) {
          artistQuery = artistQuery.in('artistic_style', filters.artisticStyles);
        }

        if (filters.locations.length) {
          artistQuery = artistQuery.in('location', filters.locations);
        }

        if (filters.availableForCommission !== null) {
          artistQuery = artistQuery.eq('available_for_commission', filters.availableForCommission);
        }

        const { data: artists } = await artistQuery.limit(20);
        
        if (artists) {
          results.push(...artists.map(artist => ({
            type: 'artist' as const,
            id: artist.id,
            title: `${artist.first_name} ${artist.last_name}`.trim() || artist.username || 'Unknown Artist',
            description: artist.bio,
            imageUrl: artist.avatar_url,
            relevanceScore: calculateRelevanceScore(filters.query, [
              artist.first_name,
              artist.last_name,
              artist.username,
              artist.bio,
              artist.artistic_medium,
              artist.artistic_style
            ].filter(Boolean).join(' '))
          })));
        }
      }

      // Search portfolios
      if (filters.query || filters.portfolioType.length) {
        let portfolioQuery = supabase
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

        if (filters.query) {
          portfolioQuery = portfolioQuery.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
        }

        const { data: portfolios } = await portfolioQuery.limit(20);
        
        if (portfolios) {
          results.push(...portfolios.map(portfolio => ({
            type: 'portfolio' as const,
            id: portfolio.id,
            title: portfolio.title,
            description: portfolio.description,
            imageUrl: portfolio.cover_image,
            artistName: `${portfolio.profiles.first_name} ${portfolio.profiles.last_name}`.trim() || portfolio.profiles.username,
            artistId: portfolio.user_id,
            relevanceScore: calculateRelevanceScore(filters.query, [
              portfolio.title,
              portfolio.description
            ].filter(Boolean).join(' '))
          })));
        }
      }

      // Sort results
      return sortResults(results, filters.sortBy, filters.sortOrder);
    } finally {
      setIsSearching(false);
    }
  };

  const calculateRelevanceScore = (query: string, text: string): number => {
    if (!query || !text) return 0;
    
    const normalizedQuery = query.toLowerCase();
    const normalizedText = text.toLowerCase();
    
    // Exact match gets highest score
    if (normalizedText.includes(normalizedQuery)) {
      return 100;
    }
    
    // Word matches
    const queryWords = normalizedQuery.split(' ');
    const textWords = normalizedText.split(' ');
    const matchingWords = queryWords.filter(word => 
      textWords.some(textWord => textWord.includes(word))
    );
    
    return (matchingWords.length / queryWords.length) * 80;
  };

  const sortResults = (results: SearchResult[], sortBy: string, sortOrder: string): SearchResult[] => {
    const sorted = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return b.relevanceScore - a.relevanceScore;
      }
    });

    return sortOrder === 'desc' ? sorted : sorted.reverse();
  };

  // Get filter options
  const { data: filterOptions } = useQuery({
    queryKey: ['search-filter-options'],
    queryFn: async () => {
      const [mediumsResponse, stylesResponse, locationsResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('artistic_medium')
          .not('artistic_medium', 'is', null),
        supabase
          .from('profiles')
          .select('artistic_style')
          .not('artistic_style', 'is', null),
        supabase
          .from('profiles')
          .select('location')
          .not('location', 'is', null)
      ]);

      return {
        artisticMediums: [...new Set(mediumsResponse.data?.map(p => p.artistic_medium).filter(Boolean))],
        artisticStyles: [...new Set(stylesResponse.data?.map(p => p.artistic_style).filter(Boolean))],
        locations: [...new Set(locationsResponse.data?.map(p => p.location).filter(Boolean))]
      };
    }
  });

  return {
    filters,
    setFilters,
    suggestions: suggestions || [],
    filterOptions: filterOptions || { artisticMediums: [], artisticStyles: [], locations: [] },
    performSearch,
    isSearching
  };
};
