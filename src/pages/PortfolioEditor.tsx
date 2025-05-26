
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, Settings, Upload, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost"
                onClick={() => navigate('/my-portfolios')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portfolios
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Portfolio Editor</h1>
                <p className="text-muted-foreground">Editing Portfolio ID: {id}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input placeholder="Portfolio title" defaultValue="My Amazing Portfolio" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea 
                      placeholder="Describe your portfolio..."
                      defaultValue="A collection of my best artwork"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary">Digital Art</Badge>
                      <Badge variant="secondary">Abstract</Badge>
                      <Badge variant="secondary">NFT</Badge>
                    </div>
                    <Input placeholder="Add tags..." />
                  </div>
                </CardContent>
              </Card>

              {/* Artworks */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Artworks</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Artwork
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Upload Your Artwork</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop images or click to browse
                    </p>
                    <Button variant="outline">Choose Files</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Template */}
              <Card>
                <CardHeader>
                  <CardTitle>Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                      <div className="font-medium">Crestline</div>
                      <div className="text-sm text-muted-foreground">Fullscreen gallery</div>
                    </div>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent bg-accent">
                      <div className="font-medium">Artfolio</div>
                      <div className="text-sm text-muted-foreground">Parallax scrolling</div>
                    </div>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                      <div className="font-medium">Rowan</div>
                      <div className="text-sm text-muted-foreground">Collection headers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Public Portfolio</span>
                    <Badge variant="secondary">Private</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Featured</span>
                    <Badge variant="outline">No</Badge>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-8 border-t mt-8">
            <h3 className="text-lg font-semibold mb-2">Full Portfolio Editor Coming Soon</h3>
            <p className="text-muted-foreground">
              Advanced editing features, template customization, and artwork management tools are in development.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PortfolioEditor;
