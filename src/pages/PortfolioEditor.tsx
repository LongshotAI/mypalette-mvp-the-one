import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, ArrowLeft, Settings, Image, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolios } from '@/hooks/usePortfolios';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import EnhancedArtworkUpload from '@/components/portfolio/EnhancedArtworkUpload';
import ArtworkGrid from '@/components/portfolio/ArtworkGrid';
import { supabase } from '@/integrations/supabase/client';

const PortfolioEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updatePortfolio } = usePortfolios();
  const { toast } = useToast();
  const isNew = id === 'new';
  
  const [portfolio, setPortfolio] = useState({
    id: '',
    title: '',
    description: '',
    slug: '',
    is_public: false,
    template_id: 'minimal',
    cover_image: null as string | null
  });

  const [activeTab, setActiveTab] = useState<'details' | 'artworks' | 'settings'>('details');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load portfolio data if editing existing portfolio
  useEffect(() => {
    const loadPortfolio = async () => {
      if (isNew || !id || !user?.id) return;

      try {
        console.log('Loading portfolio for editing:', id);
        
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error loading portfolio:', error);
          toast({
            title: "Error",
            description: "Failed to load portfolio. You may not have permission to edit this portfolio.",
            variant: "destructive"
          });
          navigate('/my-portfolios');
          return;
        }

        console.log('Portfolio loaded:', data);
        setPortfolio({
          id: data.id,
          title: data.title,
          description: data.description || '',
          slug: data.slug || '',
          is_public: data.is_public || false,
          template_id: data.template_id || 'minimal',
          cover_image: data.cover_image
        });
      } catch (error) {
        console.error('Error loading portfolio:', error);
        toast({
          title: "Error",
          description: "Failed to load portfolio",
          variant: "destructive"
        });
        navigate('/my-portfolios');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [id, isNew, user?.id, navigate, toast]);

  const handleSave = async () => {
    if (!portfolio.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Portfolio title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      console.log('Saving portfolio:', portfolio);
      
      await updatePortfolio(portfolio.id, {
        title: portfolio.title.trim(),
        description: portfolio.description.trim() || null,
        is_public: portfolio.is_public,
        template_id: portfolio.template_id
      });
      
      toast({
        title: "Portfolio saved",
        description: "Your changes have been saved successfully!"
      });
    } catch (error) {
      console.error('Error saving portfolio:', error);
    } finally {
      setSaving(false);
    }
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

  const handleCoverImageUpload = async (file: File) => {
    if (!user?.id || !portfolio.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${portfolio.id}/cover.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      await updatePortfolio(portfolio.id, { cover_image: publicUrl });
      
      setPortfolio(prev => ({ ...prev, cover_image: publicUrl }));
      
      toast({
        title: "Cover image updated",
        description: "Portfolio cover image has been updated successfully!"
      });
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload cover image",
        variant: "destructive"
      });
    }
  };

  const templates = [
    { id: 'minimal', name: 'Minimal', description: 'Clean and elegant design' },
    { id: 'glassmorphic', name: 'Glassmorphic', description: 'Modern glass-like effects' },
    { id: 'parallax', name: 'Parallax', description: 'Dynamic scrolling with depth' },
    { id: 'gallery', name: 'Gallery', description: 'Image-focused layout' },
    { id: 'modern', name: 'Modern', description: 'Contemporary design' },
  ];

  if (isNew) {
    navigate('/my-portfolios');
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-center text-muted-foreground mt-4">Loading portfolio...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
                <h1 className="text-3xl font-bold">Edit Portfolio</h1>
                <p className="text-muted-foreground">
                  Modify your portfolio settings and content
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Portfolio'}
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

                    <div>
                      <Label htmlFor="cover-image">Cover Image</Label>
                      <div className="mt-2">
                        {portfolio.cover_image ? (
                          <div className="relative">
                            <img
                              src={portfolio.cover_image}
                              alt="Cover"
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Label htmlFor="cover-upload" className="cursor-pointer">
                                <Button variant="secondary" size="sm">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Change Cover
                                </Button>
                              </Label>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <Label htmlFor="cover-upload" className="cursor-pointer text-primary hover:text-primary/80">
                              Upload Cover Image
                            </Label>
                          </div>
                        )}
                        <input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleCoverImageUpload(e.target.files[0])}
                          className="hidden"
                        />
                      </div>
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
                            portfolio.template_id === template.id
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => setPortfolio(prev => ({ ...prev, template_id: template.id }))}
                        >
                          <h3 className="font-medium mb-1">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          {portfolio.template_id === template.id && (
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
              <div className="space-y-6">
                <EnhancedArtworkUpload 
                  portfolioId={portfolio.id} 
                  onSuccess={() => setRefreshKey(prev => prev + 1)}
                />
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Artworks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ArtworkGrid 
                      portfolioId={portfolio.id} 
                      key={refreshKey}
                      onRefresh={() => setRefreshKey(prev => prev + 1)}
                    />
                  </CardContent>
                </Card>
              </div>
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
                      checked={portfolio.is_public}
                      onCheckedChange={(checked) => setPortfolio(prev => ({ ...prev, is_public: checked }))}
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
