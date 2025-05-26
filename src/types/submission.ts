
export interface SubmissionFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface SubmissionData {
  title: string;
  description: string;
  medium: string;
  year: string;
  dimensions: string;
  artist_statement: string;
  image_urls: string[];
  external_links: string[];
  files?: SubmissionFile[];
  [key: string]: any; // This allows it to be compatible with Json type
}

export interface Submission {
  id: string;
  open_call_id: string;
  artist_id: string;
  artwork_id?: string;
  submission_data: SubmissionData | any;
  payment_status: string;
  payment_id?: string;
  is_selected: boolean;
  curator_notes?: string;
  submitted_at: string;
  submission_title?: string;
  submission_description?: string;
  artist_statement?: string;
  is_first_submission?: boolean;
  payment_amount?: number;
  open_calls?: {
    title: string;
    organization_name?: string;
  };
  profiles?: {
    username?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    email?: string;
  };
  submission_workflow?: Array<{
    status: string;
    notes?: string;
    created_at: string;
  }>;
  submission_reviews?: Array<{
    rating?: number;
    overall_score?: number;
    review_notes?: string;
  }>;
}
