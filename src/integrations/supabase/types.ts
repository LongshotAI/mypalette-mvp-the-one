export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_configuration: {
        Row: {
          admin_emails: string[] | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          admin_emails?: string[] | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          admin_emails?: string[] | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      aifilm3_announcements: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      aifilm3_config: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      artworks: {
        Row: {
          blockchain: string | null
          created_at: string | null
          description: string | null
          dimensions: string | null
          external_url: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          medium: string | null
          portfolio_id: string | null
          sort_order: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
          video_url: string | null
          year: number | null
        }
        Insert: {
          blockchain?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          external_url?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          medium?: string | null
          portfolio_id?: string | null
          sort_order?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          year?: number | null
        }
        Update: {
          blockchain?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          external_url?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          medium?: string | null
          portfolio_id?: string | null
          sort_order?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artworks_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artworks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      education_content: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          id: string
          is_published: boolean | null
          preview_text: string | null
          slug: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          preview_text?: string | null
          slug?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          preview_text?: string | null
          slug?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "education_content_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      host_applications: {
        Row: {
          admin_notes: string | null
          applicant_id: string
          contact_email: string
          contact_phone: string | null
          event_description: string
          event_title: string
          event_type: string
          id: string
          max_submissions: number | null
          organization_name: string
          organization_type: string
          organization_website: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submission_deadline: string
          submission_fee: number | null
          submission_requirements: Json | null
          submitted_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          applicant_id: string
          contact_email: string
          contact_phone?: string | null
          event_description: string
          event_title: string
          event_type: string
          id?: string
          max_submissions?: number | null
          organization_name: string
          organization_type?: string
          organization_website?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submission_deadline: string
          submission_fee?: number | null
          submission_requirements?: Json | null
          submitted_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          applicant_id?: string
          contact_email?: string
          contact_phone?: string | null
          event_description?: string
          event_title?: string
          event_type?: string
          id?: string
          max_submissions?: number | null
          organization_name?: string
          organization_type?: string
          organization_website?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submission_deadline?: string
          submission_fee?: number | null
          submission_requirements?: Json | null
          submitted_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      open_calls: {
        Row: {
          about_host: string | null
          admin_notes: string | null
          aifilm3_partner: boolean | null
          banner_image: string | null
          cover_image: string | null
          created_at: string | null
          description: string
          host_user_id: string | null
          id: string
          logo_image: string | null
          max_submissions: number | null
          num_winners: number | null
          organization_name: string | null
          organization_website: string | null
          prize_info: string | null
          status: string | null
          submission_deadline: string
          submission_fee: number | null
          submission_requirements: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          about_host?: string | null
          admin_notes?: string | null
          aifilm3_partner?: boolean | null
          banner_image?: string | null
          cover_image?: string | null
          created_at?: string | null
          description: string
          host_user_id?: string | null
          id?: string
          logo_image?: string | null
          max_submissions?: number | null
          num_winners?: number | null
          organization_name?: string | null
          organization_website?: string | null
          prize_info?: string | null
          status?: string | null
          submission_deadline: string
          submission_fee?: number | null
          submission_requirements?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          about_host?: string | null
          admin_notes?: string | null
          aifilm3_partner?: boolean | null
          banner_image?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string
          host_user_id?: string | null
          id?: string
          logo_image?: string | null
          max_submissions?: number | null
          num_winners?: number | null
          organization_name?: string | null
          organization_website?: string | null
          prize_info?: string | null
          status?: string | null
          submission_deadline?: string
          submission_fee?: number | null
          submission_requirements?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "open_calls_host_user_id_fkey"
            columns: ["host_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_analytics: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          portfolio_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          portfolio_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          portfolio_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_analytics_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          parent_id: string | null
          portfolio_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          parent_id?: string | null
          portfolio_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          parent_id?: string | null
          portfolio_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "portfolio_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_comments_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_likes: {
        Row: {
          created_at: string | null
          id: string
          like_type: string | null
          portfolio_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          like_type?: string | null
          portfolio_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          like_type?: string | null
          portfolio_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_likes_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_premium: boolean | null
          name: string
          preview_image: string | null
          template_data: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          is_premium?: boolean | null
          name: string
          preview_image?: string | null
          template_data: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
          preview_image?: string | null
          template_data?: Json
        }
        Relationships: []
      }
      portfolio_views: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          portfolio_id: string
          user_agent: string | null
          viewer_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          portfolio_id: string
          user_agent?: string | null
          viewer_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          portfolio_id?: string
          user_agent?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_views_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          cover_image: string | null
          created_at: string | null
          custom_settings: Json | null
          description: string | null
          id: string
          is_featured: boolean | null
          is_public: boolean | null
          slug: string | null
          template_id: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          custom_settings?: Json | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          slug?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          custom_settings?: Json | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          slug?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          artist_statement: string | null
          artistic_medium: string | null
          artistic_style: string | null
          available_for_commission: boolean | null
          avatar_url: string | null
          awards: string | null
          bio: string | null
          commission_info: string | null
          created_at: string | null
          education: string | null
          exhibitions: string | null
          featured_artwork_id: string | null
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone: string | null
          pricing_info: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string | null
          website: string | null
          years_active: number | null
        }
        Insert: {
          artist_statement?: string | null
          artistic_medium?: string | null
          artistic_style?: string | null
          available_for_commission?: boolean | null
          avatar_url?: string | null
          awards?: string | null
          bio?: string | null
          commission_info?: string | null
          created_at?: string | null
          education?: string | null
          exhibitions?: string | null
          featured_artwork_id?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          pricing_info?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string | null
          website?: string | null
          years_active?: number | null
        }
        Update: {
          artist_statement?: string | null
          artistic_medium?: string | null
          artistic_style?: string | null
          available_for_commission?: boolean | null
          avatar_url?: string | null
          awards?: string | null
          bio?: string | null
          commission_info?: string | null
          created_at?: string | null
          education?: string | null
          exhibitions?: string | null
          featured_artwork_id?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          pricing_info?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string | null
          website?: string | null
          years_active?: number | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_curation: {
        Row: {
          action: string
          created_at: string | null
          curator_id: string
          curator_type: string
          id: string
          notes: string | null
          submission_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          curator_id: string
          curator_type: string
          id?: string
          notes?: string | null
          submission_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          curator_id?: string
          curator_type?: string
          id?: string
          notes?: string | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_curation_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          artist_id: string | null
          artwork_id: string | null
          curator_notes: string | null
          id: string
          is_selected: boolean | null
          open_call_id: string | null
          payment_id: string | null
          payment_status: string | null
          submission_data: Json | null
          submitted_at: string | null
        }
        Insert: {
          artist_id?: string | null
          artwork_id?: string | null
          curator_notes?: string | null
          id?: string
          is_selected?: boolean | null
          open_call_id?: string | null
          payment_id?: string | null
          payment_status?: string | null
          submission_data?: Json | null
          submitted_at?: string | null
        }
        Update: {
          artist_id?: string | null
          artwork_id?: string | null
          curator_notes?: string | null
          id?: string
          is_selected?: boolean | null
          open_call_id?: string | null
          payment_id?: string | null
          payment_status?: string | null
          submission_data?: Json | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_open_call_id_fkey"
            columns: ["open_call_id"]
            isOneToOne: false
            referencedRelation: "open_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_submission_payments: {
        Row: {
          created_at: string | null
          free_submissions_used: number
          id: string
          open_call_id: string
          paid_submissions: number
          submission_count: number
          total_paid: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          free_submissions_used?: number
          id?: string
          open_call_id: string
          paid_submissions?: number
          submission_count?: number
          total_paid?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          free_submissions_used?: number
          id?: string
          open_call_id?: string
          paid_submissions?: number
          submission_count?: number
          total_paid?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_submission_payments_open_call_id_fkey"
            columns: ["open_call_id"]
            isOneToOne: false
            referencedRelation: "open_calls"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_host_application: {
        Args: {
          p_applicant_id: string
          p_organization_name: string
          p_organization_type: string
          p_contact_email: string
          p_proposed_title: string
          p_proposed_description: string
          p_proposed_deadline: string
          p_experience_description: string
          p_curatorial_statement: string
          p_website_url?: string
          p_phone?: string
          p_address?: string
          p_proposed_theme?: string
          p_proposed_exhibition_dates?: string
          p_proposed_venue?: string
          p_proposed_budget?: number
          p_proposed_prize_amount?: number
          p_target_submissions?: number
          p_previous_exhibitions?: string
          p_technical_requirements?: string
          p_marketing_plan?: string
        }
        Returns: string
      }
      create_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_title: string
          p_message: string
          p_metadata?: Json
        }
        Returns: string
      }
      generate_portfolio_slug: {
        Args: { title: string; user_id: string }
        Returns: string
      }
      get_open_call_stats: {
        Args: { p_open_call_id: string }
        Returns: {
          total_submissions: number
          paid_submissions: number
          selected_submissions: number
          average_score: number
        }[]
      }
      get_user_submission_count: {
        Args: { p_user_id: string; p_open_call_id: string }
        Returns: number
      }
      get_user_submission_pricing: {
        Args: { p_user_id: string; p_open_call_id: string }
        Returns: {
          free_remaining: number
          paid_count: number
          next_submission_cost: number
        }[]
      }
      increment_portfolio_views: {
        Args: { portfolio_id: string }
        Returns: undefined
      }
      track_portfolio_analytics: {
        Args: {
          p_portfolio_id: string
          p_event_type: string
          p_event_data?: Json
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: undefined
      }
      track_portfolio_view: {
        Args: {
          p_portfolio_id: string
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: undefined
      }
      track_user_event: {
        Args: { p_event_type: string; p_event_data?: Json }
        Returns: undefined
      }
      update_submission_payment_tracking: {
        Args: { p_user_id: string; p_open_call_id: string; p_is_free: boolean }
        Returns: undefined
      }
      update_submission_status: {
        Args: {
          p_submission_id: string
          p_new_status: string
          p_notes?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["user", "admin"],
    },
  },
} as const
