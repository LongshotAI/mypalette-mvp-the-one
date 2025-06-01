
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreVertical, Edit, Eye, Trash2, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolios } from '@/hooks/usePortfolios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CreatePortfolioDialog from '@/components/portfolio/CreatePortfolioDialog';

const MyPortfolios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { portfolios, loading, deletePortfolio } = usePortfolios();

  const filteredPortfolios = portfolios.filter(portfolio =>
    portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (portfolioId: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      await deletePortfolio(portfolioId);
    }
  };

  if (loading) {
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">My Portfolios</h1>
              <p className="text-muted-foreground">
                Create and manage your artistic portfolios
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Portfolio
            </Button>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search portfolios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Portfolios Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {filteredPortfolios.length === 0 && !loading ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No portfolios yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first portfolio to showcase your artwork
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  Create Your First Portfolio
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPortfolios.map((portfolio) => (
                  <Card key={portfolio.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
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
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge variant={portfolio.is_public ? 'default' : 'secondary'} className="flex items-center gap-1">
                            {portfolio.is_public ? (
                              <>
                                <Globe className="h-3 w-3" />
                                Public
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3" />
                                Private
                              </>
                            )}
                          </Badge>
                        </div>

                        {/* Actions Menu */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/portfolio/${portfolio.slug}`} className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  View Portfolio
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/portfolio/edit/${portfolio.id}`} className="flex items-center gap-2">
                                  <Edit className="h-4 w-4" />
                                  Edit Portfolio
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(portfolio.id)}
                                className="text-destructive flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-1">{portfolio.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {portfolio.description || 'No description provided'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            {portfolio.view_count || 0} views
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(portfolio.updated_at || '').toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <CreatePortfolioDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </Layout>
  );
};

export default MyPortfolios;
