-- Add image upload fields to open_calls table for logo and cover images
-- This will enhance the hosting application to support visual branding

-- Add logo_image and cover_image fields if they don't already exist
-- These will be used for host branding and visual appeal
DO $$
BEGIN
  -- Check if logo_image exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'open_calls' AND column_name = 'logo_image'
  ) THEN
    ALTER TABLE public.open_calls ADD COLUMN logo_image TEXT;
  END IF;

  -- Check if cover_image exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'open_calls' AND column_name = 'cover_image'
  ) THEN
    ALTER TABLE public.open_calls ADD COLUMN cover_image TEXT;
  END IF;
END $$;

-- Create a table to track user submission counts per open call for payment logic
-- This ensures we can implement the "1 free + up to 5 at $2 each" logic
CREATE TABLE IF NOT EXISTS public.user_submission_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  open_call_id UUID NOT NULL REFERENCES public.open_calls(id) ON DELETE CASCADE,
  submission_count INTEGER NOT NULL DEFAULT 0,
  free_submissions_used INTEGER NOT NULL DEFAULT 0,
  paid_submissions INTEGER NOT NULL DEFAULT 0,
  total_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, open_call_id)
);

-- Enable RLS on the new table
ALTER TABLE public.user_submission_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_submission_payments
CREATE POLICY "Users can view their own submission payments" 
ON public.user_submission_payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submission payments" 
ON public.user_submission_payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submission payments" 
ON public.user_submission_payments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create a function to get user submission pricing info
CREATE OR REPLACE FUNCTION public.get_user_submission_pricing(
  p_user_id UUID,
  p_open_call_id UUID
) RETURNS TABLE (
  free_remaining INTEGER,
  paid_count INTEGER,
  next_submission_cost DECIMAL
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_free_used INTEGER := 0;
  v_paid_count INTEGER := 0;
BEGIN
  -- Get current usage
  SELECT 
    COALESCE(free_submissions_used, 0),
    COALESCE(paid_submissions, 0)
  INTO v_free_used, v_paid_count
  FROM public.user_submission_payments
  WHERE user_id = p_user_id AND open_call_id = p_open_call_id;
  
  -- Calculate values
  free_remaining := GREATEST(0, 1 - v_free_used);
  paid_count := v_paid_count;
  
  -- Determine cost of next submission
  IF free_remaining > 0 THEN
    next_submission_cost := 0;
  ELSIF v_paid_count < 5 THEN
    next_submission_cost := 2.00;
  ELSE
    next_submission_cost := -1; -- Indicates max reached
  END IF;
  
  RETURN NEXT;
END;
$$;

-- Create function to update submission payment tracking
CREATE OR REPLACE FUNCTION public.update_submission_payment_tracking(
  p_user_id UUID,
  p_open_call_id UUID,
  p_is_free BOOLEAN
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_submission_payments (
    user_id, 
    open_call_id, 
    submission_count,
    free_submissions_used,
    paid_submissions,
    total_paid
  )
  VALUES (
    p_user_id,
    p_open_call_id,
    1,
    CASE WHEN p_is_free THEN 1 ELSE 0 END,
    CASE WHEN p_is_free THEN 0 ELSE 1 END,
    CASE WHEN p_is_free THEN 0 ELSE 2.00 END
  )
  ON CONFLICT (user_id, open_call_id) 
  DO UPDATE SET
    submission_count = user_submission_payments.submission_count + 1,
    free_submissions_used = CASE 
      WHEN p_is_free THEN user_submission_payments.free_submissions_used + 1 
      ELSE user_submission_payments.free_submissions_used 
    END,
    paid_submissions = CASE 
      WHEN p_is_free THEN user_submission_payments.paid_submissions 
      ELSE user_submission_payments.paid_submissions + 1 
    END,
    total_paid = CASE 
      WHEN p_is_free THEN user_submission_payments.total_paid 
      ELSE user_submission_payments.total_paid + 2.00 
    END,
    updated_at = now();
END;
$$;