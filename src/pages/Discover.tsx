
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Palette, Eye, Heart, User } from 'lucide-react';

const Discover = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Artists</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore portfolios from talented digital artists around the world
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search artists, portfolios, or styles..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>

          {/* Filter tags */}
          <div className="flex flex-wrap gap-2">
            {['Digital Art', '3D Modeling', 'Photography', 'Illustration', 'Animation', 'NFT'].map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Palette className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Discovery Engine Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            We're building an amazing discovery experience to help you find the perfect artists and portfolios.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Card className="text-center p-6">
              <Eye className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-medium mb-2">Smart Discovery</h3>
              <p className="text-sm text-muted-foreground">AI-powered recommendations</p>
            </Card>
            <Card className="text-center p-6">
              <Filter className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-medium mb-2">Advanced Filters</h3>
              <p className="text-sm text-muted-foreground">Find exactly what you're looking for</p>
            </Card>
            <Card className="text-center p-6">
              <User className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-medium mb-2">Artist Profiles</h3>
              <p className="text-sm text-muted-foreground">Detailed artist information</p>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Discover;
