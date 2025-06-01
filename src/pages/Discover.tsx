
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, Users, Eye, Heart } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SearchFilters from '@/components/discover/SearchFilters';
import { motion } from 'framer-motion';
import { usePortfolios } from '@/hooks/usePortfolios';

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { fetchFeaturedPortfolios, portfolios, loading } = usePortfolios();

  React.useEffect(() => {
    fetchFeaturedPortfolios();
  }, []);

  // Fetch featured artists
  const { data: artists, isLoading: artistsLoading } = useQuery({
    queryKey: ['featured-artists'],
    queryFn: async () => {
      console.log('Fetching featured artists...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'user')
        .not('avatar_url', 'is', null)
        .limit(12);

      if (error) {
        console.error('Error fetching artists:', error);
        throw error;
      }

      return data;
    },
  });

  // Fetch recent artworks
  const { data: artworks, isLoading: artworksLoading } = useQuery({
    queryKey: ['recent-artworks'],
    queryFn: async () => {
      console.log('Fetching recent artworks...');
      
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          profiles(username, first_name, last_name, avatar_url)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching artworks:', error);
        throw error;
      }

      return data;
    },
  });

  const filteredArtworks = artworks?.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.medium?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || artwork.medium === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  if (loading || artistsLoading || artworksLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Discover Amazing Art</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore portfolios, artworks, and connect with talented artists
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artworks, artists, or mediums..."
                  className="pl-10 pr-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <SearchFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Featured Portfolios */}
          {portfolios && portfolios.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Featured Portfolios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.slice(0, 6).map((portfolio) => (
                  <Card key={portfolio.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                        {portfolio.cover_image ? (
                          <img
                            src={portfolio.cover_image}
                            alt={portfolio.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                            <span className="text-4xl font-bold text-primary/50">
                              {portfolio.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{portfolio.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={portfolio.profiles?.avatar_url} />
                              <AvatarFallback>
                                {portfolio.profiles?.first_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {portfolio.profiles?.first_name} {portfolio.profiles?.last_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            {portfolio.view_count || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>
          )}

          {/* Featured Artists */}
          {artists && artists.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Featured Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {artists.slice(0, 12).map((artist) => (
                  <Card key={artist.id} className="text-center p-4 hover:shadow-md transition-shadow">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src={artist.avatar_url} />
                      <AvatarFallback>
                        {artist.first_name?.charAt(0)}{artist.last_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium text-sm mb-1">
                      {artist.first_name} {artist.last_name}
                    </h3>
                    <p className="text-xs text-muted-foreground">@{artist.username}</p>
                    {artist.artistic_medium && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {artist.artistic_medium}
                      </Badge>
                    )}
                  </Card>
                ))}
              </div>
            </motion.section>
          )}

          {/* Recent Artworks */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Recent Artworks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredArtworks.map((artwork) => (
                <Card key={artwork.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-1 line-clamp-1">{artwork.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={artwork.profiles?.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {artwork.profiles?.first_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            @{artwork.profiles?.username}
                          </span>
                        </div>
                        {artwork.medium && (
                          <Badge variant="outline" className="text-xs">
                            {artwork.medium}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
};

export default Discover;
