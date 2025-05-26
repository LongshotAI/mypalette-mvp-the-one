
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Search, Filter, MoreHorizontal, Eye, Edit } from 'lucide-react';

const AdminEducation = () => {
  const mockContent = [
    {
      id: 1,
      title: "Getting Started with Digital Art",
      category: "Beginner Tutorials",
      status: "published",
      views: 1234,
      author: "Art Expert",
      lastUpdated: "2024-02-15"
    },
    {
      id: 2,
      title: "Advanced Portfolio Techniques",
      category: "Portfolio Building",
      status: "draft",
      views: 0,
      author: "Portfolio Specialist",
      lastUpdated: "2024-03-01"
    },
    {
      id: 3,
      title: "NFT Marketplace Guide",
      category: "NFT & Blockchain",
      status: "published",
      views: 856,
      author: "Crypto Expert",
      lastUpdated: "2024-02-28"
    },
    {
      id: 4,
      title: "Color Theory for Digital Artists",
      category: "Art Theory",
      status: "review",
      views: 0,
      author: "Art Professor",
      lastUpdated: "2024-03-05"
    }
  ];

  const categories = [
    "Beginner Tutorials",
    "Portfolio Building", 
    "NFT & Blockchain",
    "Art Theory",
    "Career Development",
    "Technical Skills"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'review': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Education Content Management</h1>
              <p className="text-muted-foreground">Create and manage educational resources</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Admin Access</Badge>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search content..." 
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer">
                        <span className="text-sm">{category}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 10) + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Category
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Content List */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Content ({mockContent.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockContent.map((content) => (
                      <div key={content.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{content.title}</h3>
                              <Badge variant={getStatusColor(content.status)}>
                                {content.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{content.category}</p>
                          </div>
                          
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-4">
                            <span>By {content.author}</span>
                            <span>Updated {content.lastUpdated}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{content.views} views</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          {content.status === 'draft' && (
                            <Button variant="default" size="sm">
                              Publish
                            </Button>
                          )}
                          {content.status === 'review' && (
                            <>
                              <Button variant="default" size="sm">
                                Approve
                              </Button>
                              <Button variant="outline" size="sm">
                                Request Changes
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">89</div>
                  <div className="text-sm text-muted-foreground">Total Content</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">67</div>
                  <div className="text-sm text-muted-foreground">Published</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">15</div>
                  <div className="text-sm text-muted-foreground">In Review</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">45,234</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-8 border-t mt-8">
            <h3 className="text-lg font-semibold mb-2">Advanced Content Management Coming Soon</h3>
            <p className="text-muted-foreground">
              Rich text editor, media management, and automated publishing workflows are in development.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminEducation;
