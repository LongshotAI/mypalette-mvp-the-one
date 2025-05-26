
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { usePortfolios } from '@/hooks/usePortfolios';
import { 
  Search, 
  Eye, 
  Heart, 
  User, 
  Filter,
  Palette,
  Star,
  MapPin
} from 'lucide-react';

const Discover = () => {
  const navigate = useNavigate();
  const { portfolios, loading, fetchFeaturedPortfolios } = usePortfolios();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchFeaturedPortfolios();
  }, []);

  const filteredPortfolios = portfolios.filter(portfolio => 
    portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPortfolios = [...filteredPortfolios].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return (b.view_count || 0) - (a.view_count || 0);
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Discover Artists</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Explore portfolios from talented digital artists around the world
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{portfolios.length}+</div>
              <div className="text-sm text-muted-foreground">Portfolios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Artists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100K+</div>
              <div className="text-sm text-muted-foreground">Views</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search artists and portfolios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedPortfolios.map((portfolio, index) => (
            <motion.div
              key={portfolio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden rounded-t-lg">
                    {portfolio.cover_image ? (
                      <img 
                        src={portfolio.cover_image} 
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {portfolio.is_featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {portfolio.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {portfolio.profiles?.first_name} {portfolio.profiles?.last_name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {portfolio.description || 'No description available'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{portfolio.view_count || 0} views</span>
                    </div>
                    {portfolio.profiles?.artistic_medium && (
                      <Badge variant="secondary" className="text-xs">
                        {portfolio.profiles.artistic_medium}
                      </Badge>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => portfolio.slug && navigate(`/portfolio/${portfolio.slug}`)}
                  >
                    View Portfolio
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {sortedPortfolios.length === 0 && !loading && (
          <div className="text-center py-12">
            <Palette className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Portfolios Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a portfolio!'}
            </p>
            <Button onClick={() => navigate('/create-portfolio')}>
              Create Your Portfolio
            </Button>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 py-12 bg-muted/50 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Share Your Art?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join our community of talented artists and showcase your work to the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/create-portfolio')}>
              Create Your Portfolio
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/open-calls')}>
              View Open Calls
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Discover;
