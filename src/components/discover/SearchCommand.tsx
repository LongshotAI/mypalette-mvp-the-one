
import React, { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, Palette, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  type: 'artist' | 'portfolio' | 'tag';
  title: string;
  subtitle?: string;
  url: string;
  avatar?: string;
}

const SearchCommand = ({ open, onOpenChange }: SearchCommandProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const performSearch = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    try {
      const searchResults: SearchResult[] = [];

      // Search artists
      const { data: artists } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name, avatar_url, artistic_medium')
        .or(`
          first_name.ilike.%${query}%,
          last_name.ilike.%${query}%,
          username.ilike.%${query}%,
          artistic_medium.ilike.%${query}%
        `)
        .limit(5);

      if (artists) {
        artists.forEach(artist => {
          const name = artist.first_name && artist.last_name 
            ? `${artist.first_name} ${artist.last_name}`
            : artist.username || 'Unknown Artist';
          
          searchResults.push({
            id: artist.id,
            type: 'artist',
            title: name,
            subtitle: artist.artistic_medium || undefined,
            url: `/artists/${artist.username}`,
            avatar: artist.avatar_url || undefined
          });
        });
      }

      // Search portfolios
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select(`
          id,
          title,
          slug,
          description,
          profiles!inner (
            username,
            first_name,
            last_name
          )
        `)
        .eq('is_public', true)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(5);

      if (portfolios) {
        portfolios.forEach(portfolio => {
          const artistName = portfolio.profiles?.first_name && portfolio.profiles?.last_name
            ? `${portfolio.profiles.first_name} ${portfolio.profiles.last_name}`
            : portfolio.profiles?.username || 'Unknown Artist';

          searchResults.push({
            id: portfolio.id,
            type: 'portfolio',
            title: portfolio.title,
            subtitle: `by ${artistName}`,
            url: `/portfolio/${portfolio.slug}`
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    onOpenChange(false);
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'artist':
        return <User className="h-4 w-4" />;
      case 'portfolio':
        return <Palette className="h-4 w-4" />;
      case 'tag':
        return <Hash className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search artists, portfolios, or styles..."
        onValueChange={performSearch}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? 'Searching...' : 'No results found.'}
        </CommandEmpty>
        
        {results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((result) => (
              <CommandItem
                key={`${result.type}-${result.id}`}
                onSelect={() => handleSelect(result)}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {result.avatar ? (
                    <img
                      src={result.avatar}
                      alt={result.title}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {getIcon(result.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{result.title}</div>
                    {result.subtitle && (
                      <div className="text-sm text-muted-foreground truncate">
                        {result.subtitle}
                      </div>
                    )}
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {result.type}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
