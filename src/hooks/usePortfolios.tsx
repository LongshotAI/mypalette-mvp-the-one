
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFeaturedPortfolios = async () => {
    try {
      setLoading(true);
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
      setPortfolios(data || []);
    } catch (err) {
      console.error('Error fetching featured portfolios:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPortfolios = async (userId: string) => {
    try {
      setLoading(true);
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
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (err) {
      console.error('Error fetching user portfolios:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (portfolioData: {
    title: string;
    description?: string;
    template_id?: string;
    is_public?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate slug using the database function
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_portfolio_slug', {
          title: portfolioData.title,
          user_id: user.id
        });

      if (slugError) throw slugError;

      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          ...portfolioData,
          user_id: user.id,
          slug: slugData
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Portfolio created",
        description: "Your portfolio has been created successfully!",
      });

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
      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Portfolio updated",
        description: "Your portfolio has been updated successfully!",
      });

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
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

  useEffect(() => {
    fetchFeaturedPortfolios();
  }, []);

  return {
    portfolios,
    loading,
    error,
    fetchFeaturedPortfolios,
    fetchUserPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    refetch: fetchFeaturedPortfolios
  };
};
