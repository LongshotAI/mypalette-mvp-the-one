
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Edit, Star, Trash2, FileText, Users, Palette } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ContentManagementPanel = () => {
  const [activeTab, setActiveTab] = useState('portfolios');
  const queryClient = useQueryClient();

  // Fetch portfolios
  const { data: portfolios, isLoading: portfoliosLoading } = useQuery({
    queryKey: ['admin-portfolios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          profiles(first_name, last_name, username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  // Fetch artworks
  const { data: artworks, isLoading: artworksLoading } = useQuery({
    queryKey: ['admin-artworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          portfolios(title, slug),
          profiles(first_name, last_name, username)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  // Update portfolio featured status
  const updatePortfolioFeatured = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase
        .from('portfolios')
        .update({ is_featured, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolios'] });
      toast({
        title: "Portfolio Updated",
        description: "Portfolio featured status has been updated.",
      });
    },
  });

  // Update portfolio visibility
  const updatePortfolioVisibility = useMutation({
    mutationFn: async ({ id, is_public }: { id: string; is_public: boolean }) => {
      const { error } = await supabase
        .from('portfolios')
        .update({ is_public, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolios'] });
      toast({
        title: "Portfolio Updated",
        description: "Portfolio visibility has been updated.",
      });
    },
  });

  // Update artwork featured status
  const updateArtworkFeatured = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase
        .from('artworks')
        .update({ is_featured, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      toast({
        title: "Artwork Updated",
        description: "Artwork featured status has been updated.",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="portfolios">Portfolio Management</TabsTrigger>
          <TabsTrigger value="artworks">Artwork Management</TabsTrigger>
          <TabsTrigger value="featured">Featured Content</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolios" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Portfolio Management</h3>
            <Badge variant="outline">{portfolios?.length || 0} Total Portfolios</Badge>
          </div>

          {portfoliosLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid gap-4">
              {portfolios?.map((portfolio: any) => (
                <Card key={portfolio.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {portfolio.cover_image && (
                          <img
                            src={portfolio.cover_image}
                            alt={portfolio.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{portfolio.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {portfolio.profiles?.first_name} {portfolio.profiles?.last_name}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={portfolio.is_public ? "default" : "secondary"}>
                              {portfolio.is_public ? "Public" : "Private"}
                            </Badge>
                            {portfolio.is_featured && (
                              <Badge variant="destructive">Featured</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <div className="flex items-center gap-2">
                           <label className="text-sm font-medium">Public:</label>
                           <Switch
                             checked={portfolio.is_public}
                             onCheckedChange={(checked) => {
                               updatePortfolioVisibility.mutate({ id: portfolio.id, is_public: checked });
                               toast({
                                 title: checked ? "Portfolio Made Public" : "Portfolio Made Private",
                                 description: `${portfolio.title} is now ${checked ? 'visible to everyone' : 'private'}.`,
                               });
                             }}
                             disabled={updatePortfolioVisibility.isPending}
                           />
                         </div>
                         <div className="flex items-center gap-2">
                           <label className="text-sm font-medium">Featured:</label>
                           <Switch
                             checked={portfolio.is_featured}
                             onCheckedChange={(checked) => {
                               updatePortfolioFeatured.mutate({ id: portfolio.id, is_featured: checked });
                               toast({
                                 title: checked ? "Portfolio Featured" : "Portfolio Unfeatured",
                                 description: `${portfolio.title} ${checked ? 'will appear on the landing page' : 'removed from landing page'}.`,
                               });
                             }}
                             disabled={updatePortfolioFeatured.isPending}
                           />
                         </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/portfolio/${portfolio.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="artworks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Artwork Management</h3>
            <Badge variant="outline">{artworks?.length || 0} Recent Artworks</Badge>
          </div>

          {artworksLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid gap-4">
              {artworks?.map((artwork: any) => (
                <Card key={artwork.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{artwork.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {artwork.medium} • {artwork.year}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Portfolio: {artwork.portfolios?.title}
                          </p>
                          {artwork.is_featured && (
                            <Badge variant="destructive" className="mt-1">Featured</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Featured:</label>
                          <Switch
                            checked={artwork.is_featured}
                            onCheckedChange={(checked) => {
                              updateArtworkFeatured.mutate({ id: artwork.id, is_featured: checked });
                              toast({
                                title: checked ? "Artwork Featured" : "Artwork Unfeatured",
                                description: `${artwork.title} ${checked ? 'will appear in featured sections' : 'removed from featured sections'}.`,
                              });
                            }}
                            disabled={updateArtworkFeatured.isPending}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Featured Portfolios
                </CardTitle>
                <CardDescription>Currently featured portfolios on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolios?.filter(p => p.is_featured).slice(0, 5).map((portfolio: any) => (
                    <div key={portfolio.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{portfolio.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {portfolio.profiles?.first_name} {portfolio.profiles?.last_name}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/portfolio/${portfolio.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Featured Artworks
                </CardTitle>
                <CardDescription>Currently featured artworks on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {artworks?.filter(a => a.is_featured).slice(0, 5).map((artwork: any) => (
                    <div key={artwork.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{artwork.title}</p>
                          <p className="text-xs text-muted-foreground">{artwork.medium}</p>
                        </div>
                      </div>
                      <Switch
                        checked={artwork.is_featured}
                        onCheckedChange={(checked) => 
                          updateArtworkFeatured.mutate({ id: artwork.id, is_featured: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagementPanel;
