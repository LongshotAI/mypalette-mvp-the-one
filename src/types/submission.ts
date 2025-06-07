
export interface SubmissionData {
  title: string;
  description: string;
  medium: string;
  year: string;
  dimensions: string;
  artist_statement: string;
  image_urls: string[];
  external_links: string[];
  files?: File[];
}

export interface Submission {
  id: string;
  open_call_id: string;
  artist_id: string;
  artwork_id?: string;
  submission_data: SubmissionData;
  payment_status: 'pending' | 'paid' | 'free' | 'failed';
  payment_id?: string;
  curator_notes?: string;
  is_selected: boolean;
  submitted_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export interface OpenCallSubmissionResponse {
  submission: Submission;
  paymentRequired: boolean;
}
