-- Fix host_applications table by adding missing organization_type column
ALTER TABLE public.host_applications 
ADD COLUMN organization_type text NOT NULL DEFAULT 'other';

-- Update the create_host_application function to handle all the expected parameters properly
DROP FUNCTION IF EXISTS public.create_host_application(uuid, text, text, text, text, text, text, text, text, text, text, text, text, text, text, numeric, numeric, integer, text, text, text);

CREATE OR REPLACE FUNCTION public.create_host_application(
  p_applicant_id uuid,
  p_organization_name text,
  p_organization_type text,
  p_contact_email text,
  p_proposed_title text,
  p_proposed_description text,
  p_proposed_deadline text,
  p_experience_description text,
  p_curatorial_statement text,
  p_website_url text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_proposed_theme text DEFAULT NULL,
  p_proposed_exhibition_dates text DEFAULT NULL,
  p_proposed_venue text DEFAULT NULL,
  p_proposed_budget numeric DEFAULT NULL,
  p_proposed_prize_amount numeric DEFAULT 0,
  p_target_submissions integer DEFAULT 100,
  p_previous_exhibitions text DEFAULT NULL,
  p_technical_requirements text DEFAULT NULL,
  p_marketing_plan text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_application_id uuid;
BEGIN
  INSERT INTO public.host_applications (
    applicant_id,
    organization_name,
    organization_type,
    organization_website,
    contact_email,
    contact_phone,
    event_title,
    event_description,
    event_type,
    submission_deadline,
    max_submissions,
    admin_notes,
    status,
    submitted_at
  ) VALUES (
    p_applicant_id,
    p_organization_name,
    p_organization_type,
    p_website_url,
    p_contact_email,
    p_phone,
    p_proposed_title,
    p_proposed_description || 
    CASE WHEN p_proposed_theme IS NOT NULL THEN E'\n\nTheme: ' || p_proposed_theme ELSE '' END ||
    CASE WHEN p_proposed_exhibition_dates IS NOT NULL THEN E'\n\nExhibition Dates: ' || p_proposed_exhibition_dates ELSE '' END ||
    CASE WHEN p_proposed_venue IS NOT NULL THEN E'\n\nVenue: ' || p_proposed_venue ELSE '' END ||
    CASE WHEN p_proposed_budget IS NOT NULL THEN E'\n\nBudget: $' || p_proposed_budget::text ELSE '' END ||
    CASE WHEN p_proposed_prize_amount IS NOT NULL THEN E'\n\nPrize Amount: $' || p_proposed_prize_amount::text ELSE '' END ||
    CASE WHEN p_experience_description IS NOT NULL THEN E'\n\nExperience: ' || p_experience_description ELSE '' END ||
    CASE WHEN p_previous_exhibitions IS NOT NULL THEN E'\n\nPrevious Exhibitions: ' || p_previous_exhibitions ELSE '' END ||
    CASE WHEN p_curatorial_statement IS NOT NULL THEN E'\n\nCuratorial Statement: ' || p_curatorial_statement ELSE '' END ||
    CASE WHEN p_technical_requirements IS NOT NULL THEN E'\n\nTechnical Requirements: ' || p_technical_requirements ELSE '' END ||
    CASE WHEN p_marketing_plan IS NOT NULL THEN E'\n\nMarketing Plan: ' || p_marketing_plan ELSE '' END ||
    CASE WHEN p_address IS NOT NULL THEN E'\n\nAddress: ' || p_address ELSE '' END,
    'open_call',
    p_proposed_deadline::timestamptz,
    COALESCE(p_target_submissions, 100),
    'Host application submitted via form',
    'pending',
    now()
  ) RETURNING id INTO new_application_id;
  
  RETURN new_application_id;
END;
$$;

-- Ensure submissions table has proper indexes for curation queries
CREATE INDEX IF NOT EXISTS idx_submissions_open_call_selected ON public.submissions(open_call_id, is_selected);
CREATE INDEX IF NOT EXISTS idx_submissions_payment_status ON public.submissions(open_call_id, payment_status);