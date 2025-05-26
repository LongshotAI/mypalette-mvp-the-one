
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Share2, MoreVertical, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolios } from '@/hooks/usePortfolios';
import { useAuth } from '@/contexts/AuthContext';
import CreatePortfolioModal from '@/components/portfolio/CreatePortfolioModal';
import { format } from 'date-fns';

const MyPortfolios = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { portfolios, loading, error, refetch } = usePortfolios();

  console.log('MyPortfolios - Current user:', user?.id);
  console.log('MyPortfolios - Portfolios:', portfolios);
  console.log('MyPortfolios - Loading:', loading);
  console.log('MyPortfolios - Error:', error);

  const handleCreatePortfolioSuccess = () => {
    console.log('Portfolio created successfully, refreshing list...');
    refetch();
  };

  const handleEditPortfolio = (portfolioId: string) => {
    navigate(`/portfolio/${portfolioId}/edit`);
  };

  const handleViewPortfolio = (slug: string) => {
    if (slug) {
      navigate(`/portfolio/${slug}`);
    } else {
      console.warn('Portfolio slug is missing');
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-muted-foreground">You need to be logged in to view your portfolios.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">My Portfolios</h1>
              <p className="text-muted-foreground">Create and manage your art portfolios</p>
            </div>
            <CreatePortfolioModal 
              onSuccess={handleCreatePortfolioSuccess}
              trigger={
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Portfolio
                </Button>
              }
            />
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your portfolios...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
                <Palette className="h-12 w-12 text-destructive/60" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Error Loading Portfolios</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={refetch} variant="outline">
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Portfolios Grid */}
          {!loading && !error && portfolios.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {portfolios.map((portfolio, index) => (
                <motion.div
                  key={portfolio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      {portfolio.cover_image ? (
                        <img
                          src={portfolio.cover_image}
                          alt={portfolio.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Palette className="h-12 w-12 text-primary/60" />
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        {portfolio.is_featured && (
                          <Badge variant="secondary" className="bg-yellow-500/90 text-white">
                            Featured
                          </Badge>
                        )}
                        <Badge 
                          variant={portfolio.is_public ? "default" : "secondary"}
                          className={portfolio.is_public ? "bg-green-500" : ""}
                        >
                          {portfolio.is_public ? 'Public' : 'Private'}
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-4 right-4 flex items-center space-x-1 text-white bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                        <Eye className="h-3 w-3" />
                        <span className="text-xs">{portfolio.view_count || 0}</span>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{portfolio.title}</CardTitle>
                          {portfolio.created_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Created {format(new Date(portfolio.created_at), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {portfolio.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {portfolio.description}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditPortfolio(portfolio.id)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewPortfolio(portfolio.slug || '')}
                          disabled={!portfolio.slug}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && portfolios.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <Palette className="h-12 w-12 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No portfolios yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first portfolio to showcase your amazing artwork to the world.
              </p>
              <CreatePortfolioModal 
                onSuccess={handleCreatePortfolioSuccess}
                trigger={
                  <Button size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Portfolio
                  </Button>
                }
              />
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyPortfolios;
