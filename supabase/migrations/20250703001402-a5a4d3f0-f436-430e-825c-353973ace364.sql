-- Add new columns to open_calls table for enhanced functionality
ALTER TABLE open_calls
ADD COLUMN prize_info TEXT,
ADD COLUMN num_winners INTEGER DEFAULT 1,
ADD COLUMN about_host TEXT,
ADD COLUMN aifilm3_partner BOOLEAN DEFAULT FALSE,
ADD COLUMN cover_image TEXT,
ADD COLUMN logo_image TEXT;

-- Update the existing max_submissions to be unlimited by default (-1 for unlimited)
ALTER TABLE open_calls ALTER COLUMN max_submissions SET DEFAULT -1;