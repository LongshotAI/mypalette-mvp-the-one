
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          first_name: string | null;
          last_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          website: string | null;
          phone: string | null;
          location: string | null;
          artistic_medium: string | null;
          artistic_style: string | null;
          years_active: number | null;
          education: string | null;
          awards: string | null;
          exhibitions: string | null;
          artist_statement: string | null;
          commission_info: string | null;
          pricing_info: string | null;
          available_for_commission: boolean;
          featured_artwork_id: string | null;
          created_at: string;
          updated_at: string;
          role: 'user' | 'admin';
        };
        Insert: {
          id: string;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          phone?: string | null;
          location?: string | null;
          artistic_medium?: string | null;
          artistic_style?: string | null;
          years_active?: number | null;
          education?: string | null;
          awards?: string | null;
          exhibitions?: string | null;
          artist_statement?: string | null;
          commission_info?: string | null;
          pricing_info?: string | null;
          available_for_commission?: boolean;
          featured_artwork_id?: string | null;
          created_at?: string;
          updated_at?: string;
          role?: 'user' | 'admin';
        };
        Update: {
          id?: string;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          phone?: string | null;
          location?: string | null;
          artistic_medium?: string | null;
          artistic_style?: string | null;
          years_active?: number | null;
          education?: string | null;
          awards?: string | null;
          exhibitions?: string | null;
          artist_statement?: string | null;
          commission_info?: string | null;
          pricing_info?: string | null;
          available_for_commission?: boolean;
          featured_artwork_id?: string | null;
          created_at?: string;
          updated_at?: string;
          role?: 'user' | 'admin';
        };
      };
      portfolios: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          slug: string;
          template_id: string;
          is_public: boolean;
          is_featured: boolean;
          cover_image: string | null;
          custom_settings: any | null;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          slug: string;
          template_id?: string;
          is_public?: boolean;
          is_featured?: boolean;
          cover_image?: string | null;
          custom_settings?: any | null;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          slug?: string;
          template_id?: string;
          is_public?: boolean;
          is_featured?: boolean;
          cover_image?: string | null;
          custom_settings?: any | null;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      artworks: {
        Row: {
          id: string;
          user_id: string;
          portfolio_id: string;
          title: string;
          description: string | null;
          image_url: string;
          video_url: string | null;
          external_url: string | null;
          year: number | null;
          medium: string | null;
          dimensions: string | null;
          blockchain: string | null;
          tags: string[] | null;
          sort_order: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          portfolio_id: string;
          title: string;
          description?: string | null;
          image_url: string;
          video_url?: string | null;
          external_url?: string | null;
          year?: number | null;
          medium?: string | null;
          dimensions?: string | null;
          blockchain?: string | null;
          tags?: string[] | null;
          sort_order?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          portfolio_id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          video_url?: string | null;
          external_url?: string | null;
          year?: number | null;
          medium?: string | null;
          dimensions?: string | null;
          blockchain?: string | null;
          tags?: string[] | null;
          sort_order?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      open_calls: {
        Row: {
          id: string;
          host_user_id: string;
          title: string;
          description: string;
          organization_name: string | null;
          organization_website: string | null;
          banner_image: string | null;
          submission_deadline: string;
          submission_fee: number;
          max_submissions: number;
          submission_requirements: any | null;
          status: 'pending' | 'approved' | 'rejected' | 'live' | 'closed';
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_user_id: string;
          title: string;
          description: string;
          organization_name?: string | null;
          organization_website?: string | null;
          banner_image?: string | null;
          submission_deadline: string;
          submission_fee?: number;
          max_submissions?: number;
          submission_requirements?: any | null;
          status?: 'pending' | 'approved' | 'rejected' | 'live' | 'closed';
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_user_id?: string;
          title?: string;
          description?: string;
          organization_name?: string | null;
          organization_website?: string | null;
          banner_image?: string | null;
          submission_deadline?: string;
          submission_fee?: number;
          max_submissions?: number;
          submission_requirements?: any | null;
          status?: 'pending' | 'approved' | 'rejected' | 'live' | 'closed';
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
