
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Grid, List, Plus, Palette, Eye, Heart } from 'lucide-react';
import { usePortfolios } from '@/hooks/usePortfolios';
import CreatePortfolioDialog from '@/components/portfolio/CreatePortfolioDialog';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const MyPortfolios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { portfolios, loading, deletePortfolio, refetch } = usePortfolios();

  const filteredPortfolios = portfolios.filter(portfolio =>
    portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const publicPortfolios = filteredPortfolios.filter(p => p.is_public);
  const privatePortfolios = filteredPortfolios.filter(p => !p.is_public);

  const handlePortfolioCreated = () => {
    refetch();
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    try {
      await deletePortfolio(portfolioId);
    } catch (error) {
      console.error('Error deleting portfolio:', error);
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Palette className="h-8 w-8" />
                My Portfolios
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and showcase your artistic work
              </p>
            </div>
            <CreatePortfolioDialog onPortfolioCreated={handlePortfolioCreated} />
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Portfolios</p>
                    <p className="text-2xl font-bold">{portfolios.length}</p>
                  </div>
                  <Palette className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">
                      {portfolios.reduce((sum, p) => sum + (p.view_count || 0), 0)}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Public Portfolios</p>
                    <p className="text-2xl font-bold">{publicPortfolios.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search portfolios..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Empty State */}
          {portfolios.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-12 text-center">
                  <Palette className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No portfolios yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first portfolio to start showcasing your work
                  </p>
                  <CreatePortfolioDialog onPortfolioCreated={handlePortfolioCreated} />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Portfolio Tabs */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All ({filteredPortfolios.length})
                  </TabsTrigger>
                  <TabsTrigger value="public">
                    Public ({publicPortfolios.length})
                  </TabsTrigger>
                  <TabsTrigger value="private">
                    Private ({privatePortfolios.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredPortfolios.map((portfolio, index) => (
                      <motion.div
                        key={portfolio.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <PortfolioCard
                          portfolio={portfolio}
                          onDelete={handleDeletePortfolio}
                          showActions={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="public" className="space-y-6">
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {publicPortfolios.map((portfolio, index) => (
                      <motion.div
                        key={portfolio.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <PortfolioCard
                          portfolio={portfolio}
                          onDelete={handleDeletePortfolio}
                          showActions={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="private" className="space-y-6">
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {privatePortfolios.map((portfolio, index) => (
                      <motion.div
                        key={portfolio.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <PortfolioCard
                          portfolio={portfolio}
                          onDelete={handleDeletePortfolio}
                          showActions={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyPortfolios;
