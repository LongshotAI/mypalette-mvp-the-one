
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Heart, Share2, Eye, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Portfolio = () => {
  const { slug } = useParams();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Portfolio Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-primary/60" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Portfolio: {slug}</h1>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This portfolio is currently being loaded. Full portfolio viewing functionality will be available soon.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <Badge variant="secondary">Digital Art</Badge>
              <Badge variant="secondary">NFT</Badge>
              <Badge variant="secondary">Contemporary</Badge>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                <span>247 views</span>
              </div>
            </div>
          </motion.div>

          {/* Portfolio Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="aspect-square overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                      <ExternalLink className="h-8 w-8 text-primary/60" />
                    </div>
                    <p className="text-sm text-primary/80">Artwork {item}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Artist Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">About the Artist</h3>
                <p className="text-muted-foreground mb-6">
                  Full portfolio viewing and artist information will be available soon. 
                  This feature is currently in development and will include detailed artwork descriptions, 
                  artist statements, and interactive portfolio browsing.
                </p>
                
                <div className="flex gap-4">
                  <Button>Contact Artist</Button>
                  <Button variant="outline">View More Work</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;
