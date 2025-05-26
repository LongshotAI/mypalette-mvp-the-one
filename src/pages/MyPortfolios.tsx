
import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolios } from '@/hooks/usePortfolios';
import { 
  Plus, 
  Eye, 
  Edit, 
  Share2, 
  Trash2, 
  Image,
  Calendar,
  Globe,
  Lock
} from 'lucide-react';

const MyPortfolios = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { portfolios, loading, deletePortfolio } = usePortfolios();

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-muted-foreground">You need to be logged in to view your portfolios.</p>
            <Button onClick={() => navigate('/auth/login')} className="mt-4">
              Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      await deletePortfolio(id);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
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
            <Button onClick={() => navigate('/create-portfolio')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Portfolio
            </Button>
          </motion.div>

          {/* Portfolios Grid */}
          {portfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio, index) => (
                <motion.div
                  key={portfolio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden rounded-t-lg">
                        {portfolio.cover_image ? (
                          <img 
                            src={portfolio.cover_image} 
                            alt={portfolio.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge variant={portfolio.is_public ? "default" : "secondary"}>
                            {portfolio.is_public ? (
                              <><Globe className="h-3 w-3 mr-1" />Public</>
                            ) : (
                              <><Lock className="h-3 w-3 mr-1" />Private</>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">{portfolio.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {portfolio.description || 'No description provided'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>Updated {new Date(portfolio.updated_at || '').toLocaleDateString()}</span>
                        <span className="ml-auto flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {portfolio.view_count || 0}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate(`/edit-portfolio/${portfolio.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => portfolio.slug && navigate(`/portfolio/${portfolio.slug}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            if (portfolio.slug) {
                              navigator.clipboard.writeText(`${window.location.origin}/portfolio/${portfolio.slug}`);
                            }
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(portfolio.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Image className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Portfolios Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first portfolio to showcase your artwork to the world.
              </p>
              <Button onClick={() => navigate('/create-portfolio')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Portfolio
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyPortfolios;
