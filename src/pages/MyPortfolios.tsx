
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Share2, MoreVertical, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Portfolio {
  id: string;
  title: string;
  description: string;
  slug: string;
  isPublic: boolean;
  isFeatured: boolean;
  coverImage?: string;
  viewCount: number;
  createdAt: string;
}

const MyPortfolios = () => {
  const navigate = useNavigate();
  const [portfolios] = useState<Portfolio[]>([
    {
      id: '1',
      title: 'Digital Dreams',
      description: 'A collection of surreal digital artworks exploring the subconscious mind.',
      slug: 'digital-dreams',
      isPublic: true,
      isFeatured: false,
      viewCount: 234,
      createdAt: '2024-01-15'
    },
    {
      id: '2', 
      title: 'Urban Landscapes',
      description: 'Photography and digital art capturing the essence of city life.',
      slug: 'urban-landscapes',
      isPublic: false,
      isFeatured: true,
      viewCount: 189,
      createdAt: '2024-02-10'
    }
  ]);

  const handleCreatePortfolio = () => {
    // For now, navigate to a placeholder
    navigate('/portfolio/new/edit');
  };

  const handleEditPortfolio = (portfolioId: string) => {
    navigate(`/portfolio/${portfolioId}/edit`);
  };

  const handleViewPortfolio = (slug: string) => {
    navigate(`/portfolio/${slug}`);
  };

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
            <Button onClick={handleCreatePortfolio} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Portfolio
            </Button>
          </motion.div>

          {/* Portfolios Grid */}
          {portfolios.length > 0 ? (
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
                      {portfolio.coverImage ? (
                        <img
                          src={portfolio.coverImage}
                          alt={portfolio.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Palette className="h-12 w-12 text-primary/60" />
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        {portfolio.isFeatured && (
                          <Badge variant="secondary" className="bg-yellow-500/90 text-white">
                            Featured
                          </Badge>
                        )}
                        <Badge 
                          variant={portfolio.isPublic ? "default" : "secondary"}
                          className={portfolio.isPublic ? "bg-green-500" : ""}
                        >
                          {portfolio.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-4 right-4 flex items-center space-x-1 text-white bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                        <Eye className="h-3 w-3" />
                        <span className="text-xs">{portfolio.viewCount}</span>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{portfolio.title}</CardTitle>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {portfolio.description}
                      </p>
                      
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
                          onClick={() => handleViewPortfolio(portfolio.slug)}
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
          ) : (
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
              <Button onClick={handleCreatePortfolio} size="lg">
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
