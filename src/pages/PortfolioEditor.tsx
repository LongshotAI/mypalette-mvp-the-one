
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, ArrowLeft, Plus, Image, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const PortfolioEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [portfolio, setPortfolio] = useState({
    title: isNew ? '' : 'Digital Dreams',
    description: isNew ? '' : 'A collection of surreal digital artworks exploring the subconscious mind.',
    slug: isNew ? '' : 'digital-dreams',
    isPublic: isNew ? false : true,
    template: 'crestline'
  });

  const [activeTab, setActiveTab] = useState<'details' | 'artworks' | 'settings'>('details');

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving portfolio:', portfolio);
    navigate('/my-portfolios');
  };

  const handleBack = () => {
    navigate('/my-portfolios');
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setPortfolio(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const templates = [
    { id: 'crestline', name: 'Crestline', description: 'Fullscreen gallery with sidebar navigation' },
    { id: 'artfolio', name: 'Artfolio', description: 'Spinning logo with parallax scrolling' },
    { id: 'rowan', name: 'Rowan', description: 'Collection headers with series portfolios' },
    { id: 'panorama', name: 'Panorama', description: 'Horizontal parallax for video/AI artists' }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">
                  {isNew ? 'Create Portfolio' : 'Edit Portfolio'}
                </h1>
                <p className="text-muted-foreground">
                  {isNew ? 'Create a new portfolio to showcase your work' : 'Modify your portfolio settings and content'}
                </p>
              </div>
            </div>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Portfolio
            </Button>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex border-b mb-8"
          >
            {[
              { id: 'details', label: 'Portfolio Details', icon: Settings },
              { id: 'artworks', label: 'Artworks', icon: Image },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {activeTab === 'details' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Portfolio Title</Label>
                      <Input
                        id="title"
                        value={portfolio.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter portfolio title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={portfolio.slug}
                        onChange={(e) => setPortfolio(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="portfolio-url-slug"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Your portfolio will be available at: mypalette.com/portfolio/{portfolio.slug || 'your-slug'}
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={portfolio.description}
                        onChange={(e) => setPortfolio(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your portfolio"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Template Selection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            portfolio.template === template.id
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => setPortfolio(prev => ({ ...prev, template: template.id }))}
                        >
                          <h3 className="font-medium mb-1">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          {portfolio.template === template.id && (
                            <Badge className="mt-2">Selected</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'artworks' && (
              <Card>
                <CardHeader>
                  <CardTitle>Artworks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Image className="h-8 w-8 text-primary/60" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No artworks yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first artwork to start building your portfolio.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Artwork
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public">Make Portfolio Public</Label>
                      <p className="text-sm text-muted-foreground">
                        Public portfolios can be discovered and viewed by anyone
                      </p>
                    </div>
                    <Switch
                      id="public"
                      checked={portfolio.isPublic}
                      onCheckedChange={(checked) => setPortfolio(prev => ({ ...prev, isPublic: checked }))}
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Privacy & Sharing</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Control who can see and interact with your portfolio.
                    </p>
                    <div className="space-y-2">
                      <Badge variant="secondary">Coming Soon: Password Protection</Badge>
                      <Badge variant="secondary">Coming Soon: Download Protection</Badge>
                      <Badge variant="secondary">Coming Soon: Analytics</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PortfolioEditor;
