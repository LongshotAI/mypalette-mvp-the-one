
import { SubmissionData, SubmissionFile } from '@/types/submission';

export const isSubmissionData = (data: any): data is SubmissionData => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    typeof data.medium === 'string' &&
    typeof data.year === 'string' &&
    typeof data.dimensions === 'string' &&
    typeof data.artist_statement === 'string' &&
    Array.isArray(data.image_urls) &&
    Array.isArray(data.external_links)
  );
};

export const isSubmissionFile = (file: any): file is SubmissionFile => {
  return (
    file &&
    typeof file === 'object' &&
    typeof file.id === 'string' &&
    typeof file.file_name === 'string' &&
    typeof file.file_url === 'string' &&
    typeof file.file_type === 'string' &&
    typeof file.file_size === 'number' &&
    typeof file.created_at === 'string'
  );
};

export const convertToSubmissionData = (rawData: any): SubmissionData => {
  const defaultData: SubmissionData = {
    title: '',
    description: '',
    medium: '',
    year: '',
    dimensions: '',
    artist_statement: '',
    image_urls: [],
    external_links: [],
    files: []
  };

  if (!rawData || typeof rawData !== 'object') {
    return defaultData;
  }

  // Safely convert files array
  let files: SubmissionFile[] = [];
  if (Array.isArray(rawData.files)) {
    files = rawData.files.filter(isSubmissionFile);
  }

  return {
    title: typeof rawData.title === 'string' ? rawData.title : '',
    description: typeof rawData.description === 'string' ? rawData.description : '',
    medium: typeof rawData.medium === 'string' ? rawData.medium : '',
    year: typeof rawData.year === 'string' ? rawData.year : '',
    dimensions: typeof rawData.dimensions === 'string' ? rawData.dimensions : '',
    artist_statement: typeof rawData.artist_statement === 'string' ? rawData.artist_statement : '',
    image_urls: Array.isArray(rawData.image_urls) ? rawData.image_urls.filter((url: any) => typeof url === 'string') : [],
    external_links: Array.isArray(rawData.external_links) ? rawData.external_links.filter((link: any) => typeof link === 'string') : [],
    files
  };
};
