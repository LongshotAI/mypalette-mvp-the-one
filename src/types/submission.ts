
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
  profiles?: {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    avatar_url?: string;
  };
  open_calls?: {
    title: string;
  };
}
