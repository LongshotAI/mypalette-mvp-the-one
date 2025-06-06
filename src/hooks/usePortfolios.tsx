
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  template_id: string | null;
  is_public: boolean | null;
  is_featured: boolean | null;
  cover_image: string | null;
  view_count: number | null;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  profiles?: {
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    artistic_medium: string | null;
  };
}

export const usePortfolios = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchFeaturedPortfolios = async () => {
    try {
      setLoading(true);
      console.log('Fetching featured portfolios...');
      
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          id,
          title,
          description,
          slug,
          cover_image,
          view_count,
          user_id,
          created_at,
          updated_at,
          template_id,
          is_public,
          is_featured,
          profiles!inner (
            username,
            first_name,
            last_name,
            avatar_url,
            artistic_medium
          )
        `)
        .eq('is_public', true)
        .eq('is_featured', true)
        .order('view_count', { ascending: false })
        .limit(6);

      if (error) throw error;
      console.log('Featured portfolios fetched:', data);
      setPortfolios(data || []);
    } catch (err) {
      console.error('Error fetching featured portfolios:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPortfolios = async (userId?: string) => {
    try {
      setLoading(true);
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        console.log('No user ID provided for portfolio fetch');
        setPortfolios([]);
        setLoading(false);
        return;
      }

      console.log('Fetching portfolios for user:', targetUserId);
      
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          id,
          title,
          description,
          slug,
          cover_image,
          view_count,
          user_id,
          created_at,
          updated_at,
          template_id,
          is_public,
          is_featured
        `)
        .eq('user_id', targetUserId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      console.log('User portfolios fetched:', data);
      setPortfolios(data || []);
    } catch (err) {
      console.error('Error fetching user portfolios:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const uploadCoverImage = async (file: File, portfolioId: string) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${portfolioId}/cover.${fileExt}`;

      console.log('Uploading cover image:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading cover image:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to upload image',
        variant: "destructive",
      });
      throw err;
    }
  };

  const createPortfolio = async (portfolioData: {
    title: string;
    description?: string;
    template_id?: string;
    is_public?: boolean;
  }) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Creating portfolio with data:', portfolioData);

      // Generate slug using the database function
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_portfolio_slug', {
          title: portfolioData.title,
          user_id: user.id
        });

      if (slugError) {
        console.warn('Slug generation failed, using fallback:', slugError);
        // Fallback slug generation
        const baseSlug = portfolioData.title.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');
        
        const timestamp = Date.now();
        var fallbackSlug = `${baseSlug}-${timestamp}`;
      }

      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          ...portfolioData,
          user_id: user.id,
          slug: slugData || fallbackSlug,
          template_id: portfolioData.template_id || 'minimal'
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Portfolio created:', data);
      toast({
        title: "Portfolio created",
        description: "Your portfolio has been created successfully!",
      });

      // Add to local state
      setPortfolios(prev => [data, ...prev]);

      return data;
    } catch (err) {
      console.error('Error creating portfolio:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to create portfolio',
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePortfolio = async (id: string, updates: Partial<Portfolio>) => {
    try {
      console.log('Updating portfolio:', id, updates);

      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log('Portfolio updated:', data);
      toast({
        title: "Portfolio updated",
        description: "Your portfolio has been updated successfully!",
      });

      // Update local state
      setPortfolios(prev => prev.map(p => p.id === id ? data : p));

      return data;
    } catch (err) {
      console.error('Error updating portfolio:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update portfolio',
        variant: "destructive",
      });
      throw err;
    }
  };

  const deletePortfolio = async (id: string) => {
    try {
      console.log('Deleting portfolio:', id);

      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('Portfolio deleted successfully');
      toast({
        title: "Portfolio deleted",
        description: "Your portfolio has been deleted successfully!",
      });

      // Remove from local state
      setPortfolios(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting portfolio:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to delete portfolio',
        variant: "destructive",
      });
      throw err;
    }
  };

  // Auto-fetch user portfolios when user changes
  useEffect(() => {
    if (user?.id) {
      fetchUserPortfolios();
    } else {
      setPortfolios([]);
      setLoading(false);
    }
  }, [user?.id]);

  return {
    portfolios,
    loading,
    error,
    fetchFeaturedPortfolios,
    fetchUserPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    uploadCoverImage,
    refetch: () => fetchUserPortfolios()
  };
};
