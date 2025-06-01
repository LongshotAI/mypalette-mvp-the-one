
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, TrendingUp, Users, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import SearchFilters, { SearchFilters as SearchFiltersType } from '@/components/discover/SearchFilters';
import ArtistCard from '@/components/discover/ArtistCard';
import { useDiscovery } from '@/hooks/useDiscovery';

const Discover = () => {
  const {
    artists,
    featuredContent,
    loading,
    hasMore,
    searchArtists,
    loadFeaturedContent,
    loadMore,
    updateFollowStatus
  } = useDiscovery();

  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({
    query: '',
    artisticMedium: [],
    artisticStyle: [],
    location: '',
    yearsActive: '',
    availableForCommission: null,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const [activeView, setActiveView] = useState<'search' | 'featured' | 'trending'>('featured');

  useEffect(() => {
    loadFeaturedContent();
  }, [loadFeaturedContent]);

  const handleFiltersChange = (filters: SearchFiltersType) => {
    setCurrentFilters(filters);
    setActiveView('search');
    searchArtists(filters, 0, false);
  };

  const handleViewChange = (view: 'search' | 'featured' | 'trending') => {
    setActiveView(view);
    
    if (view === 'search') {
      searchArtists(currentFilters, 0, false);
    } else if (view === 'featured') {
      loadFeaturedContent();
    }
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

      {hasMore && activeView === 'search' && (
        <div className="text-center">
          <Button onClick={loadMore} disabled={loading} variant="outline">
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
      
      {featuredContent.trending_portfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredContent.trending_portfolios.map((portfolio) => (
            <motion.div
              key={portfolio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  {portfolio.cover_image ? (
                    <img
                      src={portfolio.cover_image}
                      alt={portfolio.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <Palette className="h-12 w-12 text-primary/60" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">{portfolio.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    by {portfolio.profiles?.first_name && portfolio.profiles?.last_name 
                      ? `${portfolio.profiles.first_name} ${portfolio.profiles.last_name}`
                      : portfolio.profiles?.username || 'Unknown Artist'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{portfolio.view_count || 0} views</span>
                    <Badge variant="secondary">{portfolio.template_id}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
          {loading && artists.length === 0 && featuredContent.featured_artists.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {activeView === 'search' && renderArtistGrid(
                artists,
                'Search Results',
                `Found ${artists.length} artists`
              )}
              
              {activeView === 'featured' && renderArtistGrid(
                featuredContent.featured_artists,
                'Featured Artists',
                'Discover talented artists making waves in the community'
              )}
              
              {activeView === 'trending' && renderTrendingPortfolios()}
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Discover;
