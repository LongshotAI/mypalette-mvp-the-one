
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

  return {
    title: typeof rawData.title === 'string' ? rawData.title : '',
    description: typeof rawData.description === 'string' ? rawData.description : '',
    medium: typeof rawData.medium === 'string' ? rawData.medium : '',
    year: typeof rawData.year === 'string' ? rawData.year : '',
    dimensions: typeof rawData.dimensions === 'string' ? rawData.dimensions : '',
    artist_statement: typeof rawData.artist_statement === 'string' ? rawData.artist_statement : '',
    image_urls: Array.isArray(rawData.image_urls) ? rawData.image_urls : [],
    external_links: Array.isArray(rawData.external_links) ? rawData.external_links : [],
    files: Array.isArray(rawData.files) ? rawData.files : []
  };
};
