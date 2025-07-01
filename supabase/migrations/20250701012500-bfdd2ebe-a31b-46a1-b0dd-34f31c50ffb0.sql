
-- Create aifilm3_announcements table
CREATE TABLE public.aifilm3_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for aifilm3_announcements
ALTER TABLE public.aifilm3_announcements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for aifilm3_announcements
-- Allow public read access
CREATE POLICY "Public can view announcements" 
    ON public.aifilm3_announcements 
    FOR SELECT 
    TO PUBLIC 
    USING (true);

-- Allow admin and super_admin to insert
CREATE POLICY "Admins can create announcements" 
    ON public.aifilm3_announcements 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Allow admin and super_admin to update
CREATE POLICY "Admins can update announcements" 
    ON public.aifilm3_announcements 
    FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Allow admin and super_admin to delete
CREATE POLICY "Admins can delete announcements" 
    ON public.aifilm3_announcements 
    FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Create aifilm3_config table
CREATE TABLE public.aifilm3_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_aifilm3_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_aifilm3_config_updated_at
    BEFORE UPDATE ON public.aifilm3_config
    FOR EACH ROW
    EXECUTE FUNCTION update_aifilm3_config_updated_at();

-- Enable RLS for aifilm3_config
ALTER TABLE public.aifilm3_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for aifilm3_config
-- Allow authenticated users to read config
CREATE POLICY "Authenticated users can view config" 
    ON public.aifilm3_config 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Allow admin and super_admin to insert
CREATE POLICY "Admins can create config" 
    ON public.aifilm3_config 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Allow admin and super_admin to update
CREATE POLICY "Admins can update config" 
    ON public.aifilm3_config 
    FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Allow admin and super_admin to delete
CREATE POLICY "Admins can delete config" 
    ON public.aifilm3_config 
    FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Insert some initial configuration data for AIFilm3
INSERT INTO public.aifilm3_config (key, value) VALUES
('festival_name', 'AIFilm3 Festival'),
('festival_active', 'true'),
('submission_deadline', '2024-12-31'),
('festival_description', 'Annual AI Film Festival showcasing the best in AI-generated cinema');
