
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, TrendingUp, Users, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import SearchFilters, { SearchFilters as SearchFiltersType } from '@/components/discover/SearchFilters';
import ArtistCard from '@/components/discover/ArtistCard';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Discover = () => {
  const {
    filters,
    updateFilters,
    artists,
    artistsLoading,
    portfolios,
    portfoliosLoading,
    featuredData,
    featuredLoading,
    followArtist,
    nextPage,
    prevPage,
    currentPage
  } = useDiscovery();

  // Fetch actual featured content for the Featured tab
  const { data: featuredContent, isLoading: featuredContentLoading } = useQuery({
    queryKey: ['featured-discover-content'],
    queryFn: async () => {
      console.log('Loading featured content for discover page...');
      
      const [featuredArtistsResponse, featuredPortfoliosResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .not('username', 'is', null)
          .not('avatar_url', 'is', null)
          .order('created_at', { ascending: false })
          .limit(8),
        supabase
          .from('portfolios')
          .select(`
            *,
            profiles!inner (
              username,
              first_name,
              last_name,
              avatar_url,
              artistic_medium
            )
          `)
          .eq('is_public', true)
          .eq('is_featured', true)
          .order('view_count', { ascending: false })
          .limit(8)
      ]);

      const result = {
        featuredArtists: featuredArtistsResponse.data || [],
        featuredPortfolios: featuredPortfoliosResponse.data || []
      };

      console.log('Featured content loaded for discover:', result);
      return result;
    },
  });

  const [activeView, setActiveView] = useState<'search' | 'featured' | 'trending'>('featured');

  // Determine loading state based on active view
  const loading = activeView === 'featured' ? featuredContentLoading : 
                 activeView === 'search' ? artistsLoading : 
                 portfoliosLoading;

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    // Fix: Ensure sortOrder is properly typed
    const typedFilters = {
      ...newFilters,
      sortOrder: newFilters.sortOrder as 'asc' | 'desc'
    };
    updateFilters(typedFilters);
    setActiveView('search');
  };

  const handleViewChange = (view: 'search' | 'featured' | 'trending') => {
    setActiveView(view);
  };

  const updateFollowStatus = (artistId: string, isFollowing: boolean) => {
    followArtist(artistId, isFollowing);
  };

  const renderArtistGrid = (artistList: any[], title: string, subtitle?: string) => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      {artistList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artistList.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onFollowChange={updateFollowStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-primary/60" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No artists found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search filters or browse featured artists.
          </p>
        </div>
      )}

      {activeView === 'search' && artists.length >= 12 && (
        <div className="text-center">
          <Button onClick={nextPage} disabled={loading} variant="outline">
            {loading ? 'Loading...' : 'Load More Artists'}
          </Button>
        </div>
      )}
    </div>
  );

  const renderTrendingPortfolios = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Trending Portfolios</h2>
        <p className="text-muted-foreground">Most viewed portfolios this week</p>
      </div>
      
      {portfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {portfolios.map((portfolio) => {
            // Fix: Transform the portfolio data to match the expected Portfolio type
            const transformedPortfolio = {
              ...portfolio,
              profiles: {
                ...portfolio.profiles,
                artistic_medium: portfolio.profiles?.artistic_medium || null
              }
            };
            
            return (
              <PortfolioCard
                key={portfolio.id}
                portfolio={transformedPortfolio}
                showActions={false}
                showPublicActions={true} // Enable public actions
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-primary/60" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No trending portfolios yet</h3>
          <p className="text-muted-foreground">
            Check back soon to see what's trending!
          </p>
        </div>
      )}
    </div>
  );

  const renderFeaturedContent = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Featured Content</h2>
        <p className="text-muted-foreground">Handpicked artists and portfolios showcasing exceptional work</p>
      </div>
      
      {featuredContentLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {/* Featured Portfolios Section */}
          {featuredContent?.featuredPortfolios && featuredContent.featuredPortfolios.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Palette className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Featured Portfolios</h3>
                <Badge variant="secondary">{featuredContent.featuredPortfolios.length}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredContent.featuredPortfolios.map((portfolio) => {
                  const transformedPortfolio = {
                    ...portfolio,
                    profiles: {
                      ...portfolio.profiles,
                      artistic_medium: portfolio.profiles?.artistic_medium || null
                    }
                  };
                  
                  return (
                    <PortfolioCard
                      key={portfolio.id}
                      portfolio={transformedPortfolio}
                      showActions={false}
                      showPublicActions={true}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Featured Artists Section */}
          {featuredContent?.featuredArtists && featuredContent.featuredArtists.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Featured Artists</h3>
                <Badge variant="secondary">{featuredContent.featuredArtists.length}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredContent.featuredArtists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onFollowChange={updateFollowStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!featuredContent?.featuredPortfolios?.length && !featuredContent?.featuredArtists?.length) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No featured content yet</h3>
              <p className="text-muted-foreground">
                Check back soon for featured artists and portfolios!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Artists</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore portfolios from talented digital artists around the world
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeView === 'featured' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewChange('featured')}
              className="flex items-center space-x-2"
            >
              <Star className="h-4 w-4" />
              <span>Featured</span>
            </Button>
            <Button
              variant={activeView === 'trending' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewChange('trending')}
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </Button>
            <Button
              variant={activeView === 'search' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewChange('search')}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </div>
        </motion.div>

        {/* Search Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <SearchFilters
            onFiltersChange={handleFiltersChange}
            isLoading={loading}
          />
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          )}
          
          {!loading && (
            <>
              {activeView === 'search' && renderArtistGrid(
                artists,
                'Search Results',
                `Found ${artists.length} artists`
              )}
              
              {activeView === 'featured' && renderFeaturedContent()}
              
              {activeView === 'trending' && renderTrendingPortfolios()}
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Discover;
