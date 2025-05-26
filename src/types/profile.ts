
export interface Profile {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  phone?: string;
  location?: string;
  artistic_medium?: string;
  artistic_style?: string;
  years_active?: number;
  available_for_commission?: boolean;
  education?: string;
  awards?: string;
  exhibitions?: string;
  artist_statement?: string;
  role: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
}
