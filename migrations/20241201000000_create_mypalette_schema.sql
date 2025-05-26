
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Extended profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  first_name text,
  last_name text,
  bio text,
  avatar_url text,
  website text,
  phone text,
  location text,
  artistic_medium text,
  artistic_style text,
  years_active integer,
  education text,
  awards text,
  exhibitions text,
  artist_statement text,
  commission_info text,
  pricing_info text,
  available_for_commission boolean DEFAULT false,
  featured_artwork_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  role user_role DEFAULT 'user'
);

-- Social links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enhanced portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  slug text UNIQUE,
  template_id text DEFAULT 'crestline',
  is_public boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  cover_image text,
  custom_settings jsonb,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  portfolio_id uuid REFERENCES portfolios(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  video_url text,
  external_url text,
  year integer,
  medium text,
  dimensions text,
  blockchain text,
  tags text[],
  sort_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Open calls system
CREATE TABLE IF NOT EXISTS open_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  organization_name text,
  organization_website text,
  banner_image text,
  submission_deadline timestamptz NOT NULL,
  submission_fee numeric DEFAULT 0,
  max_submissions integer DEFAULT 100,
  submission_requirements jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'live', 'closed')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Submissions tracking
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  open_call_id uuid REFERENCES open_calls(id) ON DELETE CASCADE,
  artist_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  artwork_id uuid REFERENCES artworks(id),
  submission_data jsonb,
  payment_status text DEFAULT 'pending',
  payment_id text,
  is_selected boolean DEFAULT false,
  curator_notes text,
  submitted_at timestamptz DEFAULT now()
);

-- Following system
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Portfolio likes/loves
CREATE TABLE IF NOT EXISTS portfolio_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  portfolio_id uuid REFERENCES portfolios(id) ON DELETE CASCADE,
  like_type text DEFAULT 'like' CHECK (like_type IN ('like', 'love')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, portfolio_id)
);

-- Education content
CREATE TABLE IF NOT EXISTS education_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  category text NOT NULL,
  thumbnail_url text,
  preview_text text,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id),
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_content ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Social links policies
CREATE POLICY "Social links are viewable by everyone" ON social_links
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own social links" ON social_links
  FOR ALL USING (auth.uid() = user_id);

-- Portfolios policies
CREATE POLICY "Public portfolios are viewable by everyone" ON portfolios
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own portfolios" ON portfolios
  FOR ALL USING (auth.uid() = user_id);

-- Artworks policies
CREATE POLICY "Artworks are viewable if portfolio is public" ON artworks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = artworks.portfolio_id 
      AND (portfolios.is_public = true OR portfolios.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own artworks" ON artworks
  FOR ALL USING (auth.uid() = user_id);

-- Open calls policies
CREATE POLICY "Live open calls are viewable by everyone" ON open_calls
  FOR SELECT USING (status = 'live' OR auth.uid() = host_user_id);

CREATE POLICY "Users can create open calls" ON open_calls
  FOR INSERT WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Users can update their own open calls" ON open_calls
  FOR UPDATE USING (auth.uid() = host_user_id);

-- Submissions policies
CREATE POLICY "Users can view their own submissions" ON submissions
  FOR SELECT USING (auth.uid() = artist_id);

CREATE POLICY "Users can create submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own follows" ON follows
  FOR ALL USING (auth.uid() = follower_id);

-- Portfolio likes policies
CREATE POLICY "Portfolio likes are viewable by everyone" ON portfolio_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON portfolio_likes
  FOR ALL USING (auth.uid() = user_id);

-- Education content policies
CREATE POLICY "Published education content is viewable by everyone" ON education_content
  FOR SELECT USING (is_published = true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON portfolios(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_artworks_portfolio_id ON artworks(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_artworks_user_id ON artworks(user_id);
CREATE INDEX IF NOT EXISTS idx_open_calls_status ON open_calls(status);
CREATE INDEX IF NOT EXISTS idx_submissions_artist_id ON submissions(artist_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_portfolio_id ON portfolio_likes(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_education_content_category ON education_content(category);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, username, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'username',
    CASE 
      WHEN NEW.email = 'lshot.crypto@gmail.com' THEN 'admin'::user_role
      ELSE 'user'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to generate unique portfolio slug
CREATE OR REPLACE FUNCTION generate_portfolio_slug(title text, user_id uuid)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  -- Create base slug from title
  base_slug := lower(trim(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  -- Ensure it's not empty
  IF base_slug = '' THEN
    base_slug := 'portfolio';
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and increment if needed
  WHILE EXISTS (SELECT 1 FROM portfolios WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to update portfolio view count
CREATE OR REPLACE FUNCTION increment_portfolio_views(portfolio_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE portfolios 
  SET view_count = view_count + 1,
      updated_at = now()
  WHERE id = portfolio_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
