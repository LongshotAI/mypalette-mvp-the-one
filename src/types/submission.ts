
export interface SubmissionData {
  title?: string;
  description?: string;
  artist_statement?: string;
  files?: SubmissionFile[];
  [key: string]: any;
}

export interface SubmissionFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface SubmissionWorkflow {
  id: string;
  submission_id: string;
  status: string;
  updated_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SubmissionReview {
  id: string;
  submission_id: string;
  reviewer_id: string;
  rating?: number;
  technical_quality_score?: number;
  artistic_merit_score?: number;
  theme_relevance_score?: number;
  overall_score?: number;
  review_notes?: string;
  private_notes?: string;
  review_status: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  open_call_id: string;
  artist_id: string;
  artwork_id?: string;
  submission_data: SubmissionData | null;
  payment_status: string;
  payment_id?: string;
  is_selected: boolean;
  curator_notes?: string;
  submitted_at: string;
  // New fields that exist in database but missing from types
  submission_title?: string;
  submission_description?: string;
  artist_statement?: string;
  payment_amount?: number;
  is_first_submission?: boolean;
  profiles?: {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    avatar_url?: string;
  };
  open_calls?: {
    title: string;
    organization_name?: string;
  };
  // Relations that we're joining in queries
  submission_workflow?: SubmissionWorkflow[];
  submission_reviews?: SubmissionReview[];
}
