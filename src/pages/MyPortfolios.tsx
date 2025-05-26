
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Share2, MoreHorizontal } from 'lucide-react';

const MyPortfolios = () => {
  const mockPortfolios = [
    {
      id: 1,
      title: "Abstract Digital Collection",
      description: "A collection of abstract digital artworks exploring color and form.",
      status: "Published",
      views: 1234,
      artworks: 12,
      coverImage: null,
    },
    {
      id: 2,
      title: "Character Design Portfolio",
      description: "Character designs and concept art for games and animation.",
      status: "Draft",
      views: 0,
      artworks: 8,
      coverImage: null,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Portfolios</h1>
              <p className="text-muted-foreground">
                Manage and showcase your artwork collections
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Portfolio
            </Button>
          </div>

          {/* Portfolios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPortfolios.map((portfolio) => (
              <Card key={portfolio.id} className="group hover:shadow-lg transition-all">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 relative overflow-hidden">
                  {portfolio.coverImage ? (
                    <img 
                      src={portfolio.coverImage} 
                      alt={portfolio.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">No cover image</span>
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4">
                    <Badge variant={portfolio.status === 'Published' ? 'default' : 'secondary'}>
                      {portfolio.status}
                    </Badge>
                  </div>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{portfolio.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {portfolio.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{portfolio.artworks} artworks</span>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{portfolio.views} views</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {mockPortfolios.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No portfolios yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first portfolio to start showcasing your artwork
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Portfolio
              </Button>
            </div>
          )}

          {/* Coming Soon */}
          <div className="text-center py-8 border-t mt-8">
            <h3 className="text-lg font-semibold mb-2">Full Portfolio Management Coming Soon</h3>
            <p className="text-muted-foreground">
              Advanced portfolio editor, templates, and customization options are in development.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyPortfolios;
