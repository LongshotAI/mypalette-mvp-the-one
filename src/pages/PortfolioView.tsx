
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, Share2, User } from 'lucide-react';

const PortfolioView = () => {
  const { slug } = useParams();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Portfolio Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Portfolio Title</h1>
                  <p className="text-lg text-muted-foreground mb-4">
                    Portfolio description will be displayed here. This showcases the artist's collection.
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Artist Name</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>1,234 views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>89 likes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Digital Art</Badge>
                    <Badge variant="secondary">Abstract</Badge>
                    <Badge variant="secondary">2024</Badge>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Portfolio System Coming Soon</h2>
            <p className="text-muted-foreground mb-4">
              Full portfolio viewing with artwork galleries, templates, and interactive features.
            </p>
            <p className="text-sm text-muted-foreground">Portfolio slug: {slug}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PortfolioView;
