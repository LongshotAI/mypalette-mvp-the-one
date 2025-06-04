
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string | null;
  preview_image: string | null;
  template_data: {
    theme: string;
    layout: string;
    colors: {
      primary: string;
      secondary: string;
    };
    effects?: string[];
  };
  is_premium: boolean;
  created_at: string;
}

export const usePortfolioTemplates = () => {
  return useQuery({
    queryKey: ['portfolio-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as PortfolioTemplate[];
    },
  });
};
