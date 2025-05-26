
-- Function to create host application
CREATE OR REPLACE FUNCTION create_host_application(
  p_applicant_id uuid,
  p_organization_name text,
  p_organization_type text,
  p_website_url text DEFAULT NULL,
  p_contact_email text,
  p_phone text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_proposed_title text,
  p_proposed_description text,
  p_proposed_theme text DEFAULT NULL,
  p_proposed_deadline text,
  p_proposed_exhibition_dates text DEFAULT NULL,
  p_proposed_venue text DEFAULT NULL,
  p_proposed_budget numeric DEFAULT NULL,
  p_proposed_prize_amount numeric DEFAULT 0,
  p_target_submissions integer DEFAULT 100,
  p_experience_description text,
  p_previous_exhibitions text DEFAULT NULL,
  p_curatorial_statement text,
  p_technical_requirements text DEFAULT NULL,
  p_marketing_plan text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  application_id uuid;
BEGIN
  INSERT INTO host_applications (
    applicant_id, organization_name, organization_type, website_url, contact_email,
    phone, address, proposed_title, proposed_description, proposed_theme,
    proposed_deadline, proposed_exhibition_dates, proposed_venue, proposed_budget,
    proposed_prize_amount, target_submissions, experience_description,
    previous_exhibitions, curatorial_statement, technical_requirements, marketing_plan
  ) VALUES (
    p_applicant_id, p_organization_name, p_organization_type, p_website_url, p_contact_email,
    p_phone, p_address, p_proposed_title, p_proposed_description, p_proposed_theme,
    p_proposed_deadline::timestamptz, p_proposed_exhibition_dates, p_proposed_venue, p_proposed_budget,
    p_proposed_prize_amount, p_target_submissions, p_experience_description,
    p_previous_exhibitions, p_curatorial_statement, p_technical_requirements, p_marketing_plan
  ) RETURNING id INTO application_id;
  
  RETURN application_id;
END;
$$;

-- Function to get user host applications
CREATE OR REPLACE FUNCTION get_user_host_applications(p_user_id uuid)
RETURNS TABLE (
  id uuid, applicant_id uuid, organization_name text, organization_type text,
  website_url text, contact_email text, phone text, address text,
  proposed_title text, proposed_description text, proposed_theme text,
  proposed_deadline text, proposed_exhibition_dates text, proposed_venue text,
  proposed_budget numeric, proposed_prize_amount numeric, target_submissions integer,
  experience_description text, previous_exhibitions text, curatorial_statement text,
  technical_requirements text, marketing_plan text, application_status text,
  admin_notes text, reviewed_by text, reviewed_at text, created_at text, updated_at text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ha.id, ha.applicant_id, ha.organization_name, ha.organization_type,
    ha.website_url, ha.contact_email, ha.phone, ha.address,
    ha.proposed_title, ha.proposed_description, ha.proposed_theme,
    ha.proposed_deadline::text, ha.proposed_exhibition_dates, ha.proposed_venue,
    ha.proposed_budget, ha.proposed_prize_amount, ha.target_submissions,
    ha.experience_description, ha.previous_exhibitions, ha.curatorial_statement,
    ha.technical_requirements, ha.marketing_plan, ha.application_status,
    ha.admin_notes, ha.reviewed_by::text, ha.reviewed_at::text, 
    ha.created_at::text, ha.updated_at::text
  FROM host_applications ha
  WHERE ha.applicant_id = p_user_id
  ORDER BY ha.created_at DESC;
END;
$$;

-- Function to get all host applications (admin)
CREATE OR REPLACE FUNCTION get_all_host_applications()
RETURNS TABLE (
  id uuid, applicant_id uuid, organization_name text, organization_type text,
  website_url text, contact_email text, phone text, address text,
  proposed_title text, proposed_description text, proposed_theme text,
  proposed_deadline text, proposed_exhibition_dates text, proposed_venue text,
  proposed_budget numeric, proposed_prize_amount numeric, target_submissions integer,
  experience_description text, previous_exhibitions text, curatorial_statement text,
  technical_requirements text, marketing_plan text, application_status text,
  admin_notes text, reviewed_by text, reviewed_at text, created_at text, updated_at text,
  username text, first_name text, last_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ha.id, ha.applicant_id, ha.organization_name, ha.organization_type,
    ha.website_url, ha.contact_email, ha.phone, ha.address,
    ha.proposed_title, ha.proposed_description, ha.proposed_theme,
    ha.proposed_deadline::text, ha.proposed_exhibition_dates, ha.proposed_venue,
    ha.proposed_budget, ha.proposed_prize_amount, ha.target_submissions,
    ha.experience_description, ha.previous_exhibitions, ha.curatorial_statement,
    ha.technical_requirements, ha.marketing_plan, ha.application_status,
    ha.admin_notes, ha.reviewed_by::text, ha.reviewed_at::text, 
    ha.created_at::text, ha.updated_at::text,
    p.username, p.first_name, p.last_name
  FROM host_applications ha
  LEFT JOIN profiles p ON ha.applicant_id = p.id
  ORDER BY ha.created_at DESC;
END;
$$;

-- Function to update host application status
CREATE OR REPLACE FUNCTION update_host_application_status(
  p_application_id uuid,
  p_status text,
  p_notes text DEFAULT NULL,
  p_reviewer_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE host_applications 
  SET 
    application_status = p_status,
    admin_notes = COALESCE(p_notes, admin_notes),
    reviewed_by = p_reviewer_id,
    reviewed_at = now(),
    updated_at = now()
  WHERE id = p_application_id;
END;
$$;

-- Function to get submissions for review
CREATE OR REPLACE FUNCTION get_submissions_for_review(p_open_call_id uuid)
RETURNS TABLE (
  id uuid, open_call_id uuid, artist_id uuid, artwork_id uuid,
  submission_data jsonb, payment_status text, payment_id text,
  is_selected boolean, curator_notes text, submitted_at text,
  submission_title text, submission_description text, artist_statement text,
  payment_amount numeric, is_first_submission boolean,
  username text, first_name text, last_name text, email text, avatar_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id, s.open_call_id, s.artist_id, s.artwork_id,
    s.submission_data, s.payment_status, s.payment_id,
    s.is_selected, s.curator_notes, s.submitted_at::text,
    (s.submission_data->>'title')::text as submission_title,
    (s.submission_data->>'description')::text as submission_description,
    (s.submission_data->>'artist_statement')::text as artist_statement,
    CASE WHEN s.payment_status = 'free' THEN 0 ELSE 200 END as payment_amount,
    (s.payment_status = 'free')::boolean as is_first_submission,
    p.username, p.first_name, p.last_name, 
    u.email, p.avatar_url
  FROM submissions s
  LEFT JOIN profiles p ON s.artist_id = p.id
  LEFT JOIN auth.users u ON s.artist_id = u.id
  WHERE s.open_call_id = p_open_call_id
  AND s.payment_status IN ('paid', 'free')
  ORDER BY s.submitted_at DESC;
END;
$$;

-- Function to create submission review
CREATE OR REPLACE FUNCTION create_submission_review(
  p_submission_id uuid,
  p_reviewer_id uuid,
  p_rating integer,
  p_technical_quality_score integer,
  p_artistic_merit_score integer,
  p_theme_relevance_score integer,
  p_overall_score integer,
  p_review_notes text,
  p_private_notes text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  review_id uuid;
BEGIN
  INSERT INTO submission_reviews (
    submission_id, reviewer_id, rating, technical_quality_score,
    artistic_merit_score, theme_relevance_score, overall_score,
    review_notes, private_notes, review_status
  ) VALUES (
    p_submission_id, p_reviewer_id, p_rating, p_technical_quality_score,
    p_artistic_merit_score, p_theme_relevance_score, p_overall_score,
    p_review_notes, p_private_notes, 'completed'
  ) RETURNING id INTO review_id;
  
  RETURN review_id;
END;
$$;
